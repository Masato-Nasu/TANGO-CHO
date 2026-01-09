const STORAGE_KEY = "tangoChoWords";
const HF_BASE_KEY = "tangoChoHfBase";
const HF_TOKEN_KEY = "tangoChoAppToken";
const FILTER_KEY = "tangoChoFilter";

const STATUS_LABEL = {
  forgot: "覚えてない",
  default: "デフォルト",
  learned: "覚えた",
};

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

function getHfBase() {
  return (localStorage.getItem(HF_BASE_KEY) || "").trim();
}
function getAppToken() {
  return (localStorage.getItem(HF_TOKEN_KEY) || "").trim();
}

async function translateToJaViaSpace(word) {
  const base = getHfBase();
  if (!base) throw new Error("HF Spaces API Base が未設定です。");
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
    });
  });
}

function setupHfSettings() {
  const hfBase = document.getElementById("hfBase");
  const saveHfBaseBtn = document.getElementById("saveHfBaseBtn");
  const appToken = document.getElementById("appToken");
  const saveAppTokenBtn = document.getElementById("saveAppTokenBtn");

  hfBase.value = getHfBase();
  appToken.value = getAppToken();

  saveHfBaseBtn.addEventListener("click", () => {
    localStorage.setItem(HF_BASE_KEY, hfBase.value.trim());
    alert("HF Spaces API Base を保存しました。");
  });
  saveAppTokenBtn.addEventListener("click", () => {
    localStorage.setItem(HF_TOKEN_KEY, appToken.value.trim());
    alert("APP_TOKEN を保存しました。");
  });
}

function renderWordList() {
  const listEl = document.getElementById("wordList");
  const countEl = document.getElementById("wordCount");
  const filter = (localStorage.getItem(FILTER_KEY) || "all").trim();

  let words = loadWords().sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  if (filter !== "all") {
    words = words.filter((w) => (w.status || "default") === filter);
  }

  listEl.innerHTML = "";
  countEl.textContent = String(loadWords().length);

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
      const all = loadWords();
      const idx = all.findIndex((x) => x.id === w.id);
      if (idx >= 0) {
        all[idx].status = status.value;
        saveWords(all);
        renderWordList();
      }
    });

    right.appendChild(tts);
    right.appendChild(status);

    top.appendChild(left);
    top.appendChild(right);

    const meaning = document.createElement("div");
    meaning.className = "word-meaning";
    meaning.textContent = w.meaning || "";

    const meta = document.createElement("div");
    meta.className = "word-meta";
    const created = w.createdAt ? new Date(w.createdAt).toLocaleString() : "";
    const tags = w.tags ? ` / タグ: ${w.tags}` : "";
    const src = w.source ? ` / from: ${w.source}` : "";
    const st = ` / ${STATUS_LABEL[w.status || "default"]}`;
    meta.textContent = `登録: ${created}${tags}${src}${st}`;

    const actions = document.createElement("div");
    actions.className = "word-actions";

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "削除";
    del.addEventListener("click", () => {
      if (!confirm(`「${w.word}」を削除しますか？`)) return;
      const next = loadWords().filter((x) => x.id !== w.id);
      saveWords(next);
      renderWordList();
    });

    actions.appendChild(del);

    item.appendChild(top);
    item.appendChild(meaning);

    if (w.example) {
      const ex = document.createElement("div");
      ex.className = "word-meta";
      ex.textContent = `例: ${w.example}`;
      item.appendChild(ex);
    }
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
  sel.value = (localStorage.getItem(FILTER_KEY) || "all").trim();
  sel.addEventListener("change", () => {
    localStorage.setItem(FILTER_KEY, sel.value);
    renderWordList();
  });
}

function setupExport() {
  const btn = document.getElementById("exportBtn");
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

function setupSearch() {
  const input = document.getElementById("searchWord");
  const btn = document.getElementById("searchBtn");
  const result = document.getElementById("searchResult");
  const addArea = document.getElementById("addFromSearchArea");

  const meaningInput = document.getElementById("addMeaningFromSearch");
  const memoInput = document.getElementById("addMemoFromSearch");
  const statusSel = document.getElementById("addStatusFromSearch");
  const saveBtn = document.getElementById("saveFromSearchBtn");

  async function show(word) {
    const w = (word || "").trim();
    if (!w) {
      result.innerHTML = `<p class="search-error">英単語を入力してください。</p>`;
      addArea.classList.add("hidden");
      return;
    }

    result.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <div>
          <div style="font-size:1.1rem;font-weight:700;">${w}</div>
          <div style="font-size:0.85rem;color:#bbb;">翻訳中...</div>
        </div>
        <button class="tts-btn" id="ttsBtnNow">🔊 発音</button>
      </div>
      <div style="margin-top:6px;">HF Spaces → DeepL で日本語訳を取得しています</div>
    `;
    document.getElementById("ttsBtnNow")?.addEventListener("click", () => speak(w));

    addArea.classList.remove("hidden");
    meaningInput.value = "";
    memoInput.value = "";
    statusSel.value = "default";

    try {
      const ja = await translateToJaViaSpace(w);
      result.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <div>
            <div style="font-size:1.1rem;font-weight:700;">${w}</div>
            <div style="font-size:0.85rem;color:#bbb;">DeepL 翻訳</div>
          </div>
          <button class="tts-btn" id="ttsBtnNow">🔊 発音</button>
        </div>
        <div style="margin-top:6px;"><b>日本語:</b> ${ja}</div>
      `;
      document.getElementById("ttsBtnNow")?.addEventListener("click", () => speak(w));
      meaningInput.value = ja;
    } catch (e) {
      result.innerHTML = `<p class="search-error">${String(e.message || e)}</p>`;
    }
  }

  btn.addEventListener("click", () => show(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      show(input.value);
    }
  });

  saveBtn.addEventListener("click", () => {
    const word = input.value.trim();
    const meaning = meaningInput.value.trim();
    const memo = memoInput.value.trim();
    const status = statusSel.value;

    if (!word) return alert("英単語が空です。");
    if (!meaning) return alert("日本語訳が空です。");

    const now = new Date().toISOString();
    const words = loadWords();
    words.push({
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      word,
      meaning,
      memo,
      example: "",
      tags: "",
      source: "search",
      status,
      createdAt: now,
    });
    saveWords(words);
    renderWordList();
    alert("保存しました。");
  });
}

function setupManual() {
  const word = document.getElementById("manualWord");
  const meaning = document.getElementById("manualMeaning");
  const status = document.getElementById("manualStatus");
  const example = document.getElementById("manualExample");
  const memo = document.getElementById("manualMemo");
  const tags = document.getElementById("manualTags");
  const save = document.getElementById("manualSaveBtn");

  save.addEventListener("click", () => {
    const w = word.value.trim();
    const m = meaning.value.trim();
    if (!w) return alert("英単語を入力してください。");
    if (!m) return alert("日本語訳を入力してください。");

    const now = new Date().toISOString();
    const words = loadWords();
    words.push({
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      word: w,
      meaning: m,
      status: status.value,
      example: example.value.trim(),
      memo: memo.value.trim(),
      tags: tags.value.trim(),
      source: "manual",
      createdAt: now,
    });
    saveWords(words);
    renderWordList();

    word.value = "";
    meaning.value = "";
    status.value = "default";
    example.value = "";
    memo.value = "";
    tags.value = "";
    alert("保存しました。");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupHfSettings();
  setupSearch();
  setupManual();
  setupFilter();
  setupExport();
  renderWordList();

  document.getElementById("ttsTestBtn")?.addEventListener("click", () => speak("Hello, this is a test."));
});
