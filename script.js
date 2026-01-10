const STORAGE_KEY = "tangoChoWords";
const HF_BASE_KEY = "tangoChoHfBase";
const HF_TOKEN_KEY = "tangoChoAppToken";
const FILTER_KEY = "tangoChoFilter";
const SEARCH_KEY = "tangoChoSearch";

let editId = null;

const STATUS_LABEL = {
  forgot: "覚えてない",
  default: "デフォルト",
  learned: "覚えた",
};


function parseTags(tagStr) {
  const s = (tagStr || "").trim();
  if (!s) return [];
  return s
    .split(/[\s,、]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildTagSuggestions(words) {
  const dl = document.getElementById("tagSuggestions");
  if (!dl) return;
  const set = new Set();
  for (const w of words || []) {
    for (const t of parseTags(w.tags)) set.add(t);
  }
  const list = Array.from(set).sort((a, b) => a.localeCompare(b));
  const opts = [];
  for (const t of list) {
    const esc = t.replace(/"/g, "&quot;");
    opts.push(`<option value="${esc}"></option>`);
    opts.push(`<option value="#${esc}"></option>`);
  }
  dl.innerHTML = opts.join("");
}

function extractQueryAndTags(raw) {
  let s = (raw || "").trim();
  const tags = [];

  // tag:xxx / tags:xxx,yyy / タグ:xxx
  s = s.replace(/(?:^|\s)(?:tag|tags|タグ)\s*[:：]\s*([^\s]+)/gi, (m, g1) => {
    tags.push(...parseTags(g1));
    return " ";
  });

  // #tag tokens (e.g. #travel)
  s = s.replace(/#([^\s#,、]+)/g, (m, g1) => {
    tags.push(g1);
    return " ";
  });

  const query = s.replace(/\s+/g, " ").trim();
  const cleanTags = tags.map((t) => String(t || "").trim()).filter(Boolean);
  return { query, tags: cleanTags };
}

function containsQuery(wordObj, qLower) {
  if (!qLower) return true;
  const fields = [
    wordObj.word || "",
    wordObj.meaning || "",
    wordObj.memo || "",
    wordObj.tags || "",
    wordObj.synonyms || "",
  ];
  const hay = fields.join(" ").toLowerCase();
  return hay.includes(qLower);
}

function containsAllTags(wordObj, requiredTagsLower) {
  if (!requiredTagsLower || requiredTagsLower.length === 0) return true;
  const tags = parseTags(wordObj.tags).map((t) => t.toLowerCase());
  if (tags.length === 0) return false;
  for (const need of requiredTagsLower) {
    if (!tags.includes(need)) return false;
  }
  return true;
}

function nowIso() {
  return new Date().toISOString();
}

function loadWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveWords(words) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("この端末では音声読み上げが利用できません。");
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function setMsg(text, kind) {
  const el = document.getElementById("msg");
  if (!el) return;
  el.className = "msg";
  el.textContent = text || "";
  if (kind === "ok") el.classList.add("ok");
  if (kind === "err") el.classList.add("err");
}

function setListMsg(text, kind) {
  const el = document.getElementById("listMsg");
  if (!el) return;
  el.className = "msg";
  el.textContent = text || "";
  if (kind === "ok") el.classList.add("ok");
  if (kind === "err") el.classList.add("err");
}


function getHfBase() {
  // 1) primary key
  let v = (localStorage.getItem(HF_BASE_KEY) || "").trim();

  // 2) legacy keys migration (older versions)
  if (!v) {
    const legacyKeys = ["tangoChoApiBase", "tangoChoApiBaseUrl", "tangoChoSpaceBase", "tangoChoServerBase"];
    for (const k of legacyKeys) {
      const t = (localStorage.getItem(k) || "").trim();
      if (t) {
        v = t;
        localStorage.setItem(HF_BASE_KEY, v);
        break;
      }
    }
  }

  // 3) fallback: current input value (if user typed but didn't press save)
  if (!v) {
    const el = document.getElementById("hfBase");
    if (el && el.value && el.value.trim()) v = el.value.trim();
  }
  return v;
}

function getAppToken() {
  let v = (localStorage.getItem(HF_TOKEN_KEY) || "").trim();

  if (!v) {
    const legacyKeys = ["tangoChoToken", "tangoChoAppTokenLegacy", "tangoChoApiToken"];
    for (const k of legacyKeys) {
      const t = (localStorage.getItem(k) || "").trim();
      if (t) {
        v = t;
        localStorage.setItem(HF_TOKEN_KEY, v);
        break;
      }
    }
  }

  if (!v) {
    const el = document.getElementById("appToken");
    if (el && el.value && el.value.trim()) v = el.value.trim();
  }
  return v;
}

async function translateToJaViaSpace(word) {
  const base = getHfBase();
  if (!base) throw new Error("HF Spaces API Base が未設定です（⚙️接続設定）。");
  const token = getAppToken();

  const res = await fetch(`${base.replace(/\/$/, "")}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-App-Token": token } : {}),
    },
    body: JSON.stringify({ text: word, target_lang: "JA" }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Spaces error: ${res.status} ${msg}`);
  }
  const data = await res.json();
  return data.translated || "";
}

async function fetchSynonymsViaSpace(word, max = 8) {
  const base = getHfBase();
  if (!base) throw new Error("HF Spaces API Base が未設定です（⚙️接続設定）。");
  const token = getAppToken();

  const res = await fetch(`${base.replace(/\/$/, "")}/synonyms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-App-Token": token } : {}),
    },
    body: JSON.stringify({ text: word, max }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.detail ? ` (${j.detail})` : "";
    } catch (_) {}
    if (res.status === 404) {
      throw new Error("Spaces側に /synonyms がありません。Spaces を v3.2 に更新してください。");
    }
    throw new Error(`類義語取得に失敗: ${res.status}${detail}`);
  }

  const data = await res.json();
  const arr = data?.synonyms || [];
  return Array.isArray(arr) ? arr : [];
}

async function getSynonymsSmart(word, max = 8) {
  return await fetchSynonymsViaSpace(word, max);
}


function setupTabs() {
  const btns = document.querySelectorAll(".tab-button");
  const secs = document.querySelectorAll(".section");
  btns.forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-section");
      btns.forEach((x) => x.classList.remove("active"));
      secs.forEach((s) => s.classList.remove("active"));
      b.classList.add("active");
      document.getElementById(id)?.classList.add("active");
      // When entering list tab, rerender to reflect any changes
      if (id === "listSection") renderWordList();
    });
  });
}

function switchToAddTab() {
  const btn = document.querySelector('.tab-button[data-section="addSection"]');
  if (btn) btn.click();
}


function setupSettings() {
  const hfBase = document.getElementById("hfBase");
  const saveHfBaseBtn = document.getElementById("saveHfBaseBtn");
  const appToken = document.getElementById("appToken");
  const saveAppTokenBtn = document.getElementById("saveAppTokenBtn");
  const connStatus = document.getElementById("connStatus");

  hfBase.value = getHfBase();
  appToken.value = getAppToken();

  function updateConnBadge() {
    const v = (hfBase.value || '').trim();
    if (!connStatus) return;
    connStatus.textContent = v ? '✅ 接続先設定済み' : '⚠️ 未設定';
  }
  updateConnBadge();

  saveHfBaseBtn?.addEventListener("click", () => {
    localStorage.setItem(HF_BASE_KEY, hfBase.value.trim());
    updateConnBadge();
    setMsg("HF Spaces API Base を保存しました。", "ok");
  });
  saveAppTokenBtn?.addEventListener("click", () => {
    localStorage.setItem(HF_TOKEN_KEY, appToken.value.trim());
    setMsg("APP_TOKEN を保存しました。", "ok");
  });


  // Auto-save (user may forget pressing "保存")
  hfBase.addEventListener("blur", () => {
    localStorage.setItem(HF_BASE_KEY, hfBase.value.trim());
    updateConnBadge();
  });
  hfBase.addEventListener("change", () => {
    localStorage.setItem(HF_BASE_KEY, hfBase.value.trim());
    updateConnBadge();
  });

  appToken.addEventListener("blur", () => {
    localStorage.setItem(HF_TOKEN_KEY, appToken.value.trim());
  });
  appToken.addEventListener("change", () => {
    localStorage.setItem(HF_TOKEN_KEY, appToken.value.trim());
  });
}

function setupAddForm() {
  const wordEl = document.getElementById("word");
  const meaningEl = document.getElementById("meaning");
  const statusEl = document.getElementById("status");
  const memoEl = document.getElementById("memo");
  const tagsEl = document.getElementById("tags");
  const synonymsEl = document.getElementById("synonyms");
  const synFetchBtn = document.getElementById("synFetchBtn");
  const translateBtn = document.getElementById("translateBtn");
  const saveBtn = document.getElementById("saveBtn");
  const clearBtn = document.getElementById("clearBtn");
  const ttsBtn = document.getElementById("ttsBtn");
  const statePill = document.getElementById("translateState");
  const editBanner = document.getElementById("editBanner");
  const editSub = document.getElementById("editSub");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  function setState(text) {
    if (!statePill) return;
    statePill.textContent = text;
  }

  function clearForm(afterSave=false) {
    wordEl.value = "";
    meaningEl.value = "";
    statusEl.value = "default";
    memoEl.value = "";
    tagsEl.value = "";
    if (synonymsEl) synonymsEl.value = "";
    setState("未翻訳");
    if (!afterSave) setMsg("", "");
  }

  function enterEditMode(item) {
    editId = item.id;
    wordEl.value = item.word || "";
    meaningEl.value = item.meaning || "";
    statusEl.value = item.status || "default";
    memoEl.value = item.memo || "";
    tagsEl.value = item.tags || "";
    if (synonymsEl) synonymsEl.value = item.synonyms || "";

    if (editBanner) editBanner.style.display = "flex";
    if (editSub) editSub.textContent = `${(item.word || "").trim()} を編集中`;

    saveBtn.textContent = "更新";
    setState("編集");
    setMsg("編集モードに入りました。内容を修正して「更新」を押してください。", "ok");

    switchToAddTab();
    wordEl.focus();
  }

  function exitEditMode(showMsg = false) {
    editId = null;
    if (editBanner) editBanner.style.display = "none";
    saveBtn.textContent = "単語帳に保存";
    clearForm(false);
    if (showMsg) setMsg("編集を終了しました。", "ok");
  }

  // expose for list tab
  window.startEdit = (id) => {
    const all = loadWords();
    const item = all.find((x) => x.id === id);
    if (!item) return;
    enterEditMode(item);
  };

  cancelEditBtn?.addEventListener("click", () => exitEditMode(true));



  ttsBtn.addEventListener("click", () => {
    const w = wordEl.value.trim();
    if (w) speak(w);
  });

  clearBtn.addEventListener("click", () => {
    if (editId) return exitEditMode(true);
    clearForm(false);
  });

  translateBtn.addEventListener("click", async () => {
    const w = wordEl.value.trim();
    if (!w) return setMsg("英単語を入力してください。", "err");

    setMsg("翻訳中...", "");
    setState("翻訳中");
    try {
      const ja = await translateToJaViaSpace(w);
      meaningEl.value = ja;
      setMsg("翻訳しました（編集できます）。", "ok");
      setState("翻訳済み");
    } catch (e) {
      setMsg(String(e.message || e), "err");
      setState("失敗");
    }
  });

  async function fillSynonymsIfEmpty(word) {
    if (!synonymsEl) return;
    if (synonymsEl.value.trim()) return; // don't overwrite user input
    try {
      const syns = await getSynonymsSmart(word, 8);
      if (syns.length) {
        synonymsEl.value = syns.slice(0, 8).join(", ");
        setMsg(`類義語を自動取得しました（${Math.min(8, syns.length)}件）。`, "ok");
      }
    } catch (e) {
      // silent, avoid annoying
    }
  }

  if (synFetchBtn) {
    synFetchBtn.addEventListener("click", async () => {
      const w = wordEl.value.trim();
      if (!w) return setMsg("英単語を入力してください。", "err");
      try {
        const syns = await getSynonymsSmart(w, 8);
        synonymsEl.value = syns.slice(0, 8).join(", ");
        setMsg(`類義語を取得しました（${Math.min(8, syns.length)}件）。`, "ok");
      } catch (e) {
        setMsg(String(e && e.message ? e.message : "類義語の取得に失敗しました。"), "err");
      }
    });
  }


  saveBtn.addEventListener("click", () => {
    const w = wordEl.value.trim();
    const m = meaningEl.value.trim();
    if (!w) return setMsg("英単語が空です。", "err");
    if (!m) return setMsg("日本語訳が空です（翻訳 or 手入力してください）。", "err");

    const words = loadWords();
    const now = nowIso();

    // ===== Edit mode =====
    let baseId = `${now}-${Math.random().toString(36).slice(2, 8)}`;
    if (editId) {
      const idx = words.findIndex((x) => x.id === editId);
      if (idx >= 0) {
        const prev = words[idx];
        baseId = prev.id;
        words[idx] = {
          ...prev,
          word: w,
          meaning: m,
          status: statusEl.value || "default",
          memo: memoEl.value.trim(),
          tags: tagsEl.value.trim(),
          synonyms: synonymsEl ? synonymsEl.value.trim() : (prev.synonyms || ""),
          updatedAt: now,
        };
      } else {
        // If the item disappeared, fall back to adding as new.
        editId = null;
      }
    }

    // ===== Add new if not editing =====
    if (!editId) {
      words.push({
        id: baseId,
        word: w,
        meaning: m,
        status: statusEl.value || "default",
        memo: memoEl.value.trim(),
        tags: tagsEl.value.trim(),
        synonyms: synonymsEl ? synonymsEl.value.trim() : "",
        source: "manual",
        createdAt: now,
      });
    }

    // ===== Auto-add synonym cards (comma-separated) =====
    const synRaw = (synonymsEl ? synonymsEl.value : "").trim();
    const synTokens = synRaw
      ? synRaw.split(/[,、\n\r]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const seen = new Set();
    const baseLower = w.toLowerCase();
    const existingKey = new Set(words.map((x) => `${String(x.word || "").toLowerCase()}|${String(x.meaning || "")}`));
    let synAdded = 0;

    for (const t of synTokens) {
      const tl = t.toLowerCase();
      if (!t || tl === baseLower) continue;
      if (seen.has(tl)) continue;
      seen.add(tl);

      const key = `${tl}|${m}`;
      if (existingKey.has(key)) continue;

      words.push({
        id: `${baseId}-syn-${Math.random().toString(36).slice(2, 8)}`,
        word: t,
        meaning: m,
        status: statusEl.value || "default",
        memo: `同義語（${w}）`,
        tags: tagsEl.value.trim(),
        synonyms: "",
        source: "synonym",
        createdAt: nowIso(),
      });
      existingKey.add(key);
      synAdded += 1;
    }

    saveWords(words);

    if (editId) {
      exitEditMode(false);
      setMsg(`更新しました（入力をクリアしました）。${synAdded ? ` 類似語カード +${synAdded}` : ""}`.trim(), "ok");
    } else {
      clearForm(true);
      setMsg(`保存しました（入力をクリアしました）。${synAdded ? ` 類似語カード +${synAdded}` : ""}`.trim(), "ok");
    }

    renderWordList();
    wordEl.focus();
  });
}

function renderWordList() {
  const listEl = document.getElementById("wordList");
  const countEl = document.getElementById("wordCount");
  const filter = (localStorage.getItem(FILTER_KEY) || "all").trim();
  const all = loadWords();

  if (countEl) countEl.textContent = String(all.length);
  if (!listEl) return;

  let words = [...all].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  
if (filter !== "all") words = words.filter((w) => (w.status || "default") === filter);

// search / tag filter (unified)
const raw = (document.getElementById("searchBox")?.value || (localStorage.getItem(SEARCH_KEY) || "")).trim();
const parsed = extractQueryAndTags(raw);
const q = parsed.query;
const qLower = q.toLowerCase();
const requiredTagsLower = parsed.tags.map((t) => t.toLowerCase());

buildTagSuggestions(all);

words = words.filter((w) => containsQuery(w, qLower) && containsAllTags(w, requiredTagsLower));

const hasAnyFilter = !!q || (requiredTagsLower.length > 0) || (filter !== "all");
if (hasAnyFilter) {
  setListMsg(`表示: ${words.length} / 全体: ${all.length}`, "ok");
} else {
  setListMsg("", "");
}

  listEl.innerHTML = "";

  if (words.length === 0) {
    listEl.innerHTML = `<p style="font-size:0.85rem;color:#888;">該当する単語がありません。</p>`;
    return;
  }

  for (const w of words) {
    const item = document.createElement("div");
    item.className = "word-item";

    const top = document.createElement("div");
    top.className = "word-top";

    const left = document.createElement("div");
    left.className = "word-main";
    left.textContent = w.word || "(unknown)";

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.gap = "6px";
    right.style.alignItems = "center";

    const tts = document.createElement("button");
    tts.className = "tts-btn";
    tts.textContent = "🔊";
    tts.title = "発音";
    tts.addEventListener("click", () => w.word && speak(w.word));

    const status = document.createElement("select");
    status.className = "select small";
    status.innerHTML = `
      <option value="forgot">覚えてない</option>
      <option value="default">デフォルト</option>
      <option value="learned">覚えた</option>
    `;
    status.value = w.status || "default";
    status.addEventListener("change", () => {
      const allWords = loadWords();
      const idx = allWords.findIndex((x) => x.id === w.id);
      if (idx >= 0) {
        allWords[idx].status = status.value;
        saveWords(allWords);
        renderWordList(); // filter might hide/show
      }
    });

    right.appendChild(tts);
    right.appendChild(status);

    top.appendChild(left);
    top.appendChild(right);

    const meaning = document.createElement("div");
    meaning.className = "word-meaning";
    meaning.textContent = w.meaning || "";

    const syn = (w.synonyms || "").trim();
    let synEl = null;
    if (syn) {
      synEl = document.createElement("div");
      synEl.className = "word-synonyms";
      synEl.textContent = `類似語: ${syn}`;
    }

    const meta = document.createElement("div");
    meta.className = "word-meta";
    const created = w.createdAt ? new Date(w.createdAt).toLocaleString() : "";
    const tags = w.tags ? ` / タグ: ${w.tags}` : "";
    const st = ` / ${STATUS_LABEL[w.status || "default"]}`;
    meta.textContent = `登録: ${created}${tags}${st}`;

    const actions = document.createElement("div");
    actions.className = "word-actions";

    const edit = document.createElement("button");
    edit.className = "ghost-btn small";
    edit.textContent = "編集";
    edit.addEventListener("click", () => {
      if (typeof window.startEdit === "function") window.startEdit(w.id);
    });

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "削除";
    del.addEventListener("click", () => {
      if (!confirm(`「${w.word}」を削除しますか？`)) return;
      const next = loadWords().filter((x) => x.id !== w.id);
      saveWords(next);
      renderWordList();
    });

    actions.appendChild(edit);

    actions.appendChild(del);

    item.appendChild(top);
    item.appendChild(meaning);
    if (synEl) item.appendChild(synEl);
    if (w.memo) {
      const mm = document.createElement("div");
      mm.className = "word-meta";
      mm.textContent = `メモ: ${w.memo}`;
      item.appendChild(mm);
    }

    item.appendChild(meta);
    item.appendChild(actions);
    listEl.appendChild(item);
  }
}

function setupFilter() {
  const sel = document.getElementById("statusFilter");
  if (!sel) return;
  sel.value = (localStorage.getItem(FILTER_KEY) || "all").trim();
  sel.addEventListener("change", () => {
    localStorage.setItem(FILTER_KEY, sel.value);
    renderWordList();
  });
}

function setupSearch() {
  const box = document.getElementById("searchBox");
  if (!box) return;
  box.value = (localStorage.getItem(SEARCH_KEY) || "").trim();
  box.addEventListener("input", () => {
    localStorage.setItem(SEARCH_KEY, box.value);
    renderWordList();
  });
  box.addEventListener("change", () => {
    localStorage.setItem(SEARCH_KEY, box.value);
    renderWordList();
  });
}

function setupExport() {
  const btn = document.getElementById("exportBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const words = loadWords();
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    a.href = url;
    a.download = `tango-cho-backup-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

// --------------------
// Quiz (4-choice)
// --------------------
let quizState = {
  active: false,
  current: null,
  answered: false,
  correct: 0,
  total: 0,
};

function choiceShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weightedPick(items, weightFn) {
  const weights = items.map(weightFn);
  const sum = weights.reduce((s, w) => s + w, 0);
  if (sum <= 0) return items[Math.floor(Math.random() * items.length)];
  let r = Math.random() * sum;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function getPoolWords(pool) {
  const all = loadWords();
  if (pool === "all") return all;
  return all.filter(w => (w.status || "default") === pool);
}

function statusWeight(st) {
  if (st === "forgot") return 3;
  if (st === "default") return 2;
  if (st === "learned") return 1;
  return 2;
}

function buildQuestion(mode, pool) {
  const poolWords = getPoolWords(pool);
  if (poolWords.length < 4) return { error: "4択クイズには、同じ出題カテゴリ内に単語が最低4つ必要です。" };

  const target = weightedPick(poolWords, w => statusWeight(w.status || "default"));

  const prompt = mode === "en2ja" ? target.word : (target.meaning || "");
  const correct = mode === "en2ja" ? (target.meaning || "") : target.word;

  // distractors
  const others = poolWords.filter(w => w.id !== target.id);
  const seen = new Set([correct]);
  const distract = [];
  const keyOf = (w) => mode === "en2ja" ? (w.meaning || "") : (w.word || "");
  const shuffled = choiceShuffle(others);

  for (const w of shuffled) {
    const k = keyOf(w);
    if (!k) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    distract.push(k);
    if (distract.length >= 3) break;
  }

  if (distract.length < 3) {
    return { error: "4択の選択肢を作れませんでした（訳/単語の重複が多い可能性）。別カテゴリを選ぶか、単語数を増やしてください。" };
  }

  const choices = choiceShuffle([correct, ...distract]);

  return { target, mode, prompt, correct, choices };
}

function renderQuiz() {
  const area = document.getElementById("quizArea");
  const score = document.getElementById("scorePill");
  const nextBtn = document.getElementById("nextQuizBtn");
  if (!area || !score || !nextBtn) return;

  score.textContent = `${quizState.correct} / ${quizState.total}`;

  if (!quizState.active || !quizState.current) {
    area.innerHTML = `<p class="note">「出題」を押すと始まります。※ 4択クイズは、単語が最低4つ必要です。</p>`;
    nextBtn.disabled = true;
    return;
  }

  const q = quizState.current;
  if (q.error) {
    area.innerHTML = `<p class="note" style="color:#ff4f4f;">${q.error}</p>`;
    nextBtn.disabled = true;
    return;
  }

  const modeLabel = q.mode === "en2ja" ? "英 → 日" : "日 → 英";
  const promptLabel = q.mode === "en2ja" ? "この英単語の意味は？" : "この日本語に対応する英単語は？";

  area.innerHTML = `
    <p class="quiz-mini">${modeLabel}</p>
    <p class="quiz-q">${promptLabel}<br><span style="font-size:1.25rem;">${escapeHtml(q.prompt)}</span></p>
    <div class="quiz-choices" id="choices"></div>
    <div class="quiz-foot" id="quizFoot"></div>
  `;

  const choicesEl = document.getElementById("choices");
  const footEl = document.getElementById("quizFoot");
  choicesEl.innerHTML = "";

  q.choices.forEach((c) => {
    const b = document.createElement("button");
    b.className = "choice-btn";
    b.textContent = c;
    b.disabled = quizState.answered;
    b.addEventListener("click", () => onAnswer(c));
    choicesEl.appendChild(b);
  });

  footEl.innerHTML = `<span class="quiz-mini">出題元カテゴリ: ${STATUS_LABEL[q.target.status || "default"]}</span>`;
  nextBtn.disabled = !quizState.answered;
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}

function onAnswer(selected) {
  if (!quizState.current || quizState.answered) return;
  quizState.answered = true;
  quizState.total += 1;

  const q = quizState.current;
  const isCorrect = selected === q.correct;
  if (isCorrect) quizState.correct += 1;

  // mark buttons
  const btns = Array.from(document.querySelectorAll(".choice-btn"));
  btns.forEach((b) => {
    const txt = b.textContent;
    if (txt === q.correct) b.classList.add("correct");
    if (txt === selected && !isCorrect) b.classList.add("wrong");
    b.disabled = true;
  });

  // footer actions
  const footEl = document.getElementById("quizFoot");
  if (footEl) {
    const msg = document.createElement("div");
    msg.className = "quiz-mini";
    msg.style.marginTop = "6px";
    msg.textContent = isCorrect ? "正解！" : `不正解（正解: ${q.correct}）`;
    footEl.appendChild(msg);

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.alignItems = "center";
    actions.style.flexWrap = "wrap";
    actions.style.marginTop = "10px";

    const speakBtn = document.createElement("button");
    speakBtn.className = "small-btn";
    speakBtn.textContent = "🔊 発音";
    speakBtn.addEventListener("click", () => q.target.word && speak(q.target.word));

    const markForgot = document.createElement("button");
    markForgot.className = "small-btn danger";
    markForgot.textContent = "覚えてないへ";
    markForgot.addEventListener("click", () => updateWordStatus(q.target.id, "forgot"));

    const markLearned = document.createElement("button");
    markLearned.className = "small-btn accent";
    markLearned.textContent = "覚えたへ";
    markLearned.addEventListener("click", () => updateWordStatus(q.target.id, "learned"));

    actions.appendChild(speakBtn);
    actions.appendChild(markForgot);
    actions.appendChild(markLearned);
    footEl.appendChild(actions);
  }

  const score = document.getElementById("scorePill");
  if (score) score.textContent = `${quizState.correct} / ${quizState.total}`;

  const nextBtn = document.getElementById("nextQuizBtn");
  if (nextBtn) nextBtn.disabled = false;
}

function updateWordStatus(id, status) {
  const all = loadWords();
  const idx = all.findIndex(w => w.id === id);
  if (idx >= 0) {
    all[idx].status = status;
    saveWords(all);
    // update label in footer
    const footEl = document.getElementById("quizFoot");
    if (footEl && quizState.current) {
      const lbl = STATUS_LABEL[status] || status;
      const info = footEl.querySelector(".quiz-mini");
      if (info) info.textContent = `出題元カテゴリ: ${lbl}`;
    }
  }
}

function nextQuestion() {
  const mode = document.getElementById("quizMode")?.value || "en2ja";
  const pool = document.getElementById("quizPool")?.value || "all";
  quizState.current = buildQuestion(mode, pool);
  quizState.answered = false;
  quizState.active = true;
  renderQuiz();
}

function setupQuiz() {
  const startBtn = document.getElementById("startQuizBtn");
  const nextBtn = document.getElementById("nextQuizBtn");
  if (!startBtn || !nextBtn) return;

  startBtn.addEventListener("click", () => {
    quizState.active = true;
    quizState.current = null;
    quizState.answered = false;
    // keep score (or reset?). Better to reset on new start.
    quizState.correct = 0;
    quizState.total = 0;
    nextQuestion();
  });

  nextBtn.addEventListener("click", () => {
    nextQuestion();
  });
}


function normalizeImportedItem(x) {
  if (!x || typeof x !== "object") return null;
  const word = String(x.word || "").trim();
  const meaning = String(x.meaning || "").trim();
  if (!word || !meaning) return null;
  return {
    id: String(x.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    word,
    meaning,
    status: (x.status === "forgot" || x.status === "default" || x.status === "learned") ? x.status : "default",
    memo: String(x.memo || "").trim(),
    tags: String(x.tags || "").trim(),
    synonyms: String(x.synonyms || "").trim(),
    source: String(x.source || "import"),
    createdAt: String(x.createdAt || new Date().toISOString()),
  };
}

function setupImport() {
  const btn = document.getElementById("importBtn");
  const file = document.getElementById("importFile");
  if (!btn || !file) return;

  btn.addEventListener("click", () => file.click());

  file.addEventListener("change", async () => {
    const f = file.files && file.files[0];
    file.value = ""; // allow re-importing same file
    if (!f) return;

    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.words) ? parsed.words : null);
      if (!arr) throw new Error("JSON形式が不正です（配列を期待）。");

      const incoming = arr.map(normalizeImportedItem).filter(Boolean);
      if (incoming.length === 0) throw new Error("取り込める単語がありません（word/meaning必須）。");

      const current = loadWords();

      // Merge: prefer id, fallback to (word|meaning)
      const byId = new Map(current.map(w => [w.id, w]));
      const byKey = new Map(current.map(w => [`${(w.word||"").toLowerCase()}|${w.meaning||""}`, w]));

      let added = 0;
      for (const w of incoming) {
        const key = `${w.word.toLowerCase()}|${w.meaning}`;
        if (byId.has(w.id)) continue;
        if (byKey.has(key)) continue;

        current.push(w);
        byId.set(w.id, w);
        byKey.set(key, w);
        added += 1;
      }

      // ✅ Always persist immediately after upload/import
      saveWords(current);
      renderWordList();
      setListMsg(`Import完了：${added}件 追加しました（重複はスキップ）。`, "ok");
    } catch (e) {
      setListMsg(String(e.message || e), "err");
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupSettings();
  setupAddForm();
  setupFilter();
  setupSearch();
  setupExport();
  setupImport();
  setupQuiz();

  renderWordList();
  renderQuiz();

  document.getElementById("ttsTestBtn")?.addEventListener("click", () => speak("Hello, this is a test."));
});
