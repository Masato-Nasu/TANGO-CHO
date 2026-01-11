const STORAGE_KEY = "tangoChoWords";
const HF_BASE_KEY = "tangoChoHfBase";
const HF_TOKEN_KEY = "tangoChoAppToken";

let words = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let editId = null;

// --- 初期化 ---
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("hfBaseUrl").value = localStorage.getItem(HF_BASE_KEY) || "";
  renderWordList();
  
  // タブ切り替え
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-button, .tab-content').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      const sectionId = btn.dataset.section;
      document.getElementById(sectionId).classList.add('active');
      if (sectionId === 'listSection') renderWordList();
    });
  });
});

function saveWords(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

// --- 自動入力 ---
async function fetchAutoFill() {
  const word = document.getElementById("word").value.trim();
  const url = localStorage.getItem(HF_BASE_KEY);
  const token = localStorage.getItem(HF_TOKEN_KEY);
  if (!word || !url) return alert("URLを設定してください");

  const btn = document.getElementById("autoFillBtn");
  btn.disabled = true; btn.textContent = "取得中...";

  try {
    const tRes = await fetch(`${url}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ text: word })
    });
    const tData = await tRes.json();
    document.getElementById("meaning").value = tData.translated || "";

    const eRes = await fetch(`${url}/examples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ word: word, meaning: tData.translated })
    });
    const eData = await eRes.json();
    document.getElementById("example").value = eData.examples[0] || "";
  } catch (e) { alert("API接続エラー"); }
  finally { btn.disabled = false; btn.textContent = "自動入力"; }
}

// --- 保存・削除 ---
function addWord() {
  const word = document.getElementById("word").value.trim();
  const meaning = document.getElementById("meaning").value.trim();
  const example = document.getElementById("example").value.trim();
  const tags = document.getElementById("tags").value;

  if (!word || !meaning) return;

  if (editId) {
    words = words.map(w => w.id === editId ? { ...w, word, meaning, example, tags } : w);
    editId = null;
    document.getElementById("addBtn").textContent = "保存";
    document.getElementById("cancelEditBtn").style.display = "none";
  } else {
    words.push({ id: Date.now(), word, meaning, example, tags, status: 'default' });
  }

  saveWords(words);
  clearInput();
  alert("保存完了");
}

function clearInput() {
  ["word", "meaning", "example", "tags"].forEach(id => document.getElementById(id).value = "");
}

// --- リスト表示 ---
function renderWordList() {
  const listEl = document.getElementById("wordList");
  listEl.innerHTML = words.map((w, i) => `
    <div class="card" style="border-left:4px solid ${getStatusColor(w.status)}">
      <div style="display:flex; justify-content:space-between;">
        <strong>${w.word}</strong>
        <div>
          <button onclick="editWord(${w.id})" class="small-btn">編集</button>
          <button onclick="deleteWord(${w.id})" class="small-btn danger">削除</button>
        </div>
      </div>
      <div>${w.meaning}</div>
      ${w.example ? `<div style="font-size:0.85rem; color:#888; margin-top:4px; padding-left:5px; border-left:2px solid #ccc;">${w.example}</div>` : ''}
    </div>
  `).reverse().join('');
}

function getStatusColor(s) {
  return s === 'learned' ? '#00c896' : (s === 'forgot' ? '#ff4f4f' : '#333');
}

function deleteWord(id) {
  if(!confirm("削除しますか？")) return;
  words = words.filter(w => w.id !== id);
  saveWords(words);
  renderWordList();
}

function editWord(id) {
  const w = words.find(x => x.id === id);
  if (!w) return;
  editId = id;
  document.getElementById("word").value = w.word;
  document.getElementById("meaning").value = w.meaning;
  document.getElementById("example").value = w.example || "";
  document.getElementById("tags").value = w.tags || "";
  document.getElementById("addBtn").textContent = "更新";
  document.getElementById("cancelEditBtn").style.display = "block";
  document.querySelector('.tab-button[data-section="addSection"]').click();
}

function cancelEdit() {
  editId = null;
  clearInput();
  document.getElementById("addBtn").textContent = "保存";
  document.getElementById("cancelEditBtn").style.display = "none";
}

function saveSettings() {
  localStorage.setItem(HF_BASE_KEY, document.getElementById("hfBaseUrl").value.trim());
  localStorage.setItem(HF_TOKEN_KEY, document.getElementById("hfToken").value.trim());
  alert("保存しました");
}

// --- クイズ機能 (オリジナル復旧) ---
let quizWords = [];
let currentQuizIndex = 0;

document.getElementById("startQuizBtn").addEventListener("click", () => {
  quizWords = words.filter(w => w.status !== 'learned').sort(() => 0.5 - Math.random()).slice(0, 10);
  if (quizWords.length < 4) return alert("単語が4つ以上必要です");
  currentQuizIndex = 0;
  showNextQuiz();
});

function showNextQuiz() {
  const area = document.getElementById("quizArea");
  const q = quizWords[currentQuizIndex];
  if (!q) { area.innerHTML = "終了！"; return; }

  const choices = [q, ...words.filter(x => x.id !== q.id).sort(() => 0.5 - Math.random()).slice(0, 3)].sort(() => 0.5 - Math.random());

  area.innerHTML = `
    <div style="font-size:1.5rem; text-align:center; margin-bottom:10px;">${q.word}</div>
    ${choices.map(c => `<button class="primary-btn" onclick="checkAnswer(${c.id === q.id})" style="margin-bottom:5px;">${c.meaning}</button>`).join('')}
  `;
}

function checkAnswer(isCorrect) {
  alert(isCorrect ? "正解！" : "残念...");
  currentQuizIndex++;
  showNextQuiz();
}

// --- インポート/エクスポート ---
function exportWords() {
  const blob = new Blob([JSON.stringify(words)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `tango_backup.json`;
  a.click();
}

function importWords(e) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    words = JSON.parse(ev.target.result);
    saveWords(words);
    renderWordList();
    alert("インポート完了");
  };
  reader.readAsText(e.target.files[0]);
}