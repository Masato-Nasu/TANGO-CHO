/* TANGO-CHO v48.0.1: BYOK settings persistence fix */
(() => {
  const DB_NAME = "tangoChoPrivateSettings";
  const DB_VERSION = 1;
  const STORE = "settings";
  const RECORD = "openai";
  let memory = { apiKey: "", model: DEFAULT_OPENAI_MODEL, level: "adult", loaded: false };
  let loading = null;

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return reject(new Error("IndexedDB unavailable"));
      let req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); }
      catch (e) { reject(e); return; }
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("IndexedDB open failed"));
      req.onblocked = () => reject(new Error("IndexedDB blocked"));
    });
  }

  async function readDb() {
    const db = await openDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(RECORD);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error || new Error("IndexedDB read failed"));
      });
    } finally { try { db.close(); } catch (_) {} }
  }

  async function writeDb(value) {
    const db = await openDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(value, RECORD);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("IndexedDB write failed"));
        tx.onabort = () => reject(tx.error || new Error("IndexedDB write aborted"));
      });
    } finally { try { db.close(); } catch (_) {} }
  }

  function legacy() {
    try {
      return {
        apiKey: String(localStorage.getItem(OPENAI_API_KEY_KEY) || "").trim(),
        model: String(localStorage.getItem(OPENAI_MODEL_KEY) || DEFAULT_OPENAI_MODEL).trim() || DEFAULT_OPENAI_MODEL,
        level: String(localStorage.getItem(OPENAI_LEVEL_KEY) || "adult").trim() || "adult",
      };
    } catch (_) {
      return { apiKey: "", model: DEFAULT_OPENAI_MODEL, level: "adult" };
    }
  }

  function normalize(raw) {
    return {
      apiKey: String(raw?.apiKey || "").trim(),
      model: String(raw?.model || DEFAULT_OPENAI_MODEL).trim() || DEFAULT_OPENAI_MODEL,
      level: String(raw?.level || "adult").trim() || "adult",
    };
  }

  async function ensureLoaded() {
    if (memory.loaded) return memory;
    if (loading) return loading;
    loading = (async () => {
      const old = legacy();
      let stored = null;
      try { stored = await readDb(); } catch (_) {}
      memory = { ...normalize(stored || old), loaded: true };
      if (!stored && (old.apiKey || old.model !== DEFAULT_OPENAI_MODEL || old.level !== "adult")) {
        try {
          await writeDb(normalize(old));
          try { localStorage.removeItem(OPENAI_API_KEY_KEY); } catch (_) {}
        } catch (_) {}
      }
      return memory;
    })();
    try { return await loading; }
    finally { loading = null; }
  }

  async function saveToDevice(raw) {
    const value = normalize(raw);
    let dbOk = false;
    try {
      await writeDb(value);
      const check = normalize(await readDb());
      if (check.apiKey !== value.apiKey || check.model !== value.model || check.level !== value.level) {
        throw new Error("verification failed");
      }
      dbOk = true;
    } catch (_) {}

    if (!dbOk) {
      try {
        if (value.apiKey) localStorage.setItem(OPENAI_API_KEY_KEY, value.apiKey);
        else localStorage.removeItem(OPENAI_API_KEY_KEY);
        localStorage.setItem(OPENAI_MODEL_KEY, value.model);
        localStorage.setItem(OPENAI_LEVEL_KEY, value.level);
      } catch (_) {
        throw new Error("端末の保存領域を利用できません。通常タブで開くか、ブラウザのサイトデータ容量をご確認ください。");
      }
    } else {
      try { localStorage.removeItem(OPENAI_API_KEY_KEY); } catch (_) {}
    }
    memory = { ...value, loaded: true };
    return memory;
  }

  getOpenAiApiKey = function () {
    const field = document.getElementById("openAiApiKey");
    const typed = String(field?.value || "").trim();
    return typed || memory.apiKey || legacy().apiKey;
  };

  getOpenAiModel = function () {
    const field = document.getElementById("aiModel");
    const typed = String(field?.value || "").trim();
    return typed || memory.model || legacy().model || DEFAULT_OPENAI_MODEL;
  };

  getAiLevel = function () {
    const field = document.getElementById("aiLevel");
    const typed = String(field?.value || "").trim();
    return typed || memory.level || legacy().level || "adult";
  };

  const originalCallOpenAiJson = callOpenAiJson;
  callOpenAiJson = async function (args) {
    await ensureLoaded();
    return originalCallOpenAiJson(args);
  };

  setupSettings = async function setupSettingsV4801() {
    const apiKeyEl = document.getElementById("openAiApiKey");
    const modelEl = document.getElementById("aiModel");
    const levelEl = document.getElementById("aiLevel");
    const toggleBtn = document.getElementById("toggleApiKeyBtn");
    const saveBtn = document.getElementById("saveAiSettingsBtn");
    const testBtn = document.getElementById("testAiBtn");
    const clearBtn = document.getElementById("clearAiKeyBtn");
    const connStatus = document.getElementById("connStatus");
    const settingsMsg = document.getElementById("aiSettingsMsg");
    const exportJsonBtn = document.getElementById("exportJsonBtn");
    const importJsonBtn = document.getElementById("importJsonBtn");
    const importJsonInput = document.getElementById("importJsonInput");

    function show(text, kind) {
      if (!settingsMsg) { setMsg(text, kind); return; }
      settingsMsg.className = "msg ai-settings-msg";
      settingsMsg.textContent = text || "";
      if (kind === "ok") settingsMsg.classList.add("ok");
      if (kind === "err") settingsMsg.classList.add("err");
    }

    function badge() {
      if (!connStatus) return;
      const typed = String(apiKeyEl?.value || "").trim();
      const saved = String(memory.apiKey || "").trim();
      if (!typed && !saved) connStatus.textContent = "⚠️ APIキー未設定";
      else if (typed && typed === saved) connStatus.textContent = "✅ APIキー保存済み";
      else if (typed) connStatus.textContent = "● 未保存の変更あり";
      else connStatus.textContent = "✅ APIキー保存済み";
    }

    show("保存済み設定を読み込んでいます…", "");
    try {
      const loaded = await ensureLoaded();
      if (apiKeyEl) apiKeyEl.value = loaded.apiKey || "";
      if (modelEl) modelEl.value = loaded.model || DEFAULT_OPENAI_MODEL;
      if (levelEl) levelEl.value = loaded.level || "adult";
      show("", "");
    } catch (_) {
      show("保存済み設定を読み込めませんでした。入力後に「設定を保存」を押してください。", "err");
    }
    badge();

    async function persist(showMessage = true) {
      const value = {
        apiKey: String(apiKeyEl?.value || "").trim(),
        model: String(modelEl?.value || DEFAULT_OPENAI_MODEL).trim() || DEFAULT_OPENAI_MODEL,
        level: String(levelEl?.value || "adult").trim() || "adult",
      };
      const oldText = saveBtn?.textContent || "設定を保存";
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "保存中…"; }
      try {
        await saveToDevice(value);
        badge();
        if (showMessage) show(value.apiKey ? "APIキーとAI設定をこの端末に保存しました。" : "AI設定を保存しました（APIキーは未入力です）。", "ok");
        if (saveBtn) saveBtn.textContent = "保存しました";
        return true;
      } catch (e) {
        if (showMessage) show(String(e?.message || e), "err");
        badge();
        return false;
      } finally {
        setTimeout(() => {
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = oldText; }
        }, 900);
      }
    }

    toggleBtn?.addEventListener("click", () => {
      if (!apiKeyEl) return;
      const visible = apiKeyEl.type === "password";
      apiKeyEl.type = visible ? "text" : "password";
      toggleBtn.textContent = visible ? "隠す" : "表示";
    });
    saveBtn?.addEventListener("click", () => { void persist(true); });
    apiKeyEl?.addEventListener("input", () => { badge(); show("", ""); });
    modelEl?.addEventListener("input", badge);
    levelEl?.addEventListener("change", badge);
    apiKeyEl?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); void persist(true); }
    });

    clearBtn?.addEventListener("click", async () => {
      try {
        await saveToDevice({ apiKey: "", model: getOpenAiModel(), level: getAiLevel() });
        if (apiKeyEl) apiKeyEl.value = "";
        badge();
        show("保存済みのAPIキーを削除しました。", "ok");
      } catch (e) { show(String(e?.message || e), "err"); }
    });

    testBtn?.addEventListener("click", async () => {
      if (!String(apiKeyEl?.value || "").trim()) return show("OpenAI APIキーを入力してください。", "err");
      if (!(await persist(false))) return show("APIキーを保存できなかったため、接続テストを中止しました。", "err");
      const oldText = testBtn.textContent;
      testBtn.disabled = true;
      testBtn.textContent = "確認中…";
      show("OpenAI APIへ接続しています…", "");
      try {
        const result = await callOpenAiJson({ instruction: "Return only valid JSON, with no markdown.", input: 'Return exactly {"ok":true}.', maxOutputTokens: 200 });
        show(result?.ok === true ? "接続できました。AI機能を利用できます。" : "接続はできましたが、応答形式を確認できませんでした。", result?.ok === true ? "ok" : "err");
      } catch (e) { show(String(e?.message || e), "err"); }
      finally { testBtn.disabled = false; testBtn.textContent = oldText; }
    });

    exportJsonBtn?.addEventListener("click", () => {
      try {
        const ymd = new Date().toISOString().slice(0, 10).replaceAll("-", "");
        downloadJson(`tangocho-backup-${ymd}.json`, buildBackupPayload());
        show("単語を保存しました。APIキーはバックアップに含まれません。", "ok");
      } catch (_) { show("単語の保存に失敗しました。", "err"); }
    });
    importJsonBtn?.addEventListener("click", () => { try { importJsonInput?.click(); } catch (_) {} });
    importJsonInput?.addEventListener("change", async () => {
      const file = importJsonInput.files && importJsonInput.files[0];
      if (!file) return;
      try {
        const obj = JSON.parse(await file.text());
        const arr = Array.isArray(obj) ? obj : (Array.isArray(obj.words) ? obj.words : null);
        if (!arr) throw new Error("invalid");
        const imported = sanitizeImportedWords(arr);
        if (!imported.length) throw new Error("empty");
        if (!confirm(`単語を復元します。現在の単語帳（${loadWords().length}件）を上書きして、${imported.length}件に置き換えます。よろしいですか？`)) return;
        saveWords(imported);
        show(`単語を復元しました（${imported.length}件）。`, "ok");
        __bootstrapPosForExistingWords();
        try { renderWordList(); } catch (_) {}
      } catch (_) { show("単語の復元に失敗しました。ファイル形式を確認してください。", "err"); }
      finally { try { importJsonInput.value = ""; } catch (_) {} }
    });
  };
})();
