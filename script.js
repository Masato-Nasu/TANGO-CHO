const STORAGE_KEY = "tangoChoWords";
const HF_BASE_KEY = "tangoChoHfBase";
const HF_TOKEN_KEY = "tangoChoAppToken";

function loadWords() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
function saveWords(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

let words = loadWords();

// タブ切り替え
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-button, .tab-content').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active');
    if(btn.dataset.section === 'listSection') renderWordList();
  });
});

// 自動入力
async function fetchAutoFill() {
  const word = document.getElementById("word").value.trim();
  const hfBase = localStorage.getItem(HF_BASE_KEY);
  const token = localStorage.getItem(HF_TOKEN_KEY);
  if (!word || !hfBase) return alert("設定を確認してね");

  const btn = document.getElementById("autoFillBtn");
  btn.disabled = true; btn.textContent = "中...";

  try {
    const tRes = await fetch(`${hfBase}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ text: word })
    });
    const tData = await tRes.json();
    document.getElementById("meaning").value = tData.translated;

    const eRes = await fetch(`${hfBase}/examples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ word: word, meaning: tData.translated })
    });
    const eData = await eRes.json();
    document.getElementById("example").value = eData.examples[0] || "";
  } catch (e) { alert("API接続エラー"); }
  finally { btn.disabled = false; btn.textContent = "自動入力"; }
}

function addWord() {
  const word = document.getElementById("word").value.trim();
  const meaning = document.getElementById("meaning").value.trim();
  const example = document.getElementById("example").value.trim();
  if (!word || !meaning) return;

  words.push({ id: Date.now(), word, meaning, example, tags: document.getElementById("tags").value, status: 'default' });
  saveWords(words);
  renderWordList();
  document.getElementById("word").value = "";
  document.getElementById("meaning").value = "";
  document.getElementById("example").value = "";
  alert("追加完了");
}

function renderWordList() {
  const listEl = document.getElementById("wordList");
  listEl.innerHTML = words.map((w, i) => `
    <div class="card">
      <strong>${w.word}</strong>: ${w.meaning}
      ${w.example ? `<div style="font-size:0.8rem; color:#888; margin-top:5px;">💡 ${w.example}</div>` : ''}
      <button onclick="deleteWord(${w.id})" class="small-btn danger" style="margin-top:5px;">削除</button>
    </div>
  `).reverse().join('');
}

function deleteWord(id) {
  words = words.filter(w => w.id !== id);
  saveWords(words);
  renderWordList();
}

function saveSettings() {
  localStorage.setItem(HF_BASE_KEY, document.getElementById("hfBaseUrl").value.trim());
  localStorage.setItem(HF_TOKEN_KEY, document.getElementById("hfToken").value.trim());
  alert("設定保存完了");
}

// クイズ等の既存機能（お父様の元のコード）をここに追記してください