const STORAGE_KEY = "tangoChoWords";
const HF_BASE_KEY = "tangoChoHfBase";
const HF_TOKEN_KEY = "tangoChoAppToken";

let words = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// タブ切り替え
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-button, .tab-content').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active');
    if(btn.dataset.section === 'listSection') renderWordList();
  });
});

// 自動入力 (app.pyと通信)
async function fetchAutoFill() {
  const word = document.getElementById("word").value.trim();
  const hfBase = localStorage.getItem(HF_BASE_KEY);
  const token = localStorage.getItem(HF_TOKEN_KEY);
  if (!word || !hfBase) return alert("単語と設定を確認してね");

  const btn = document.getElementById("autoFillBtn");
  btn.textContent = "取得中...";
  btn.disabled = true;

  try {
    // 1. 翻訳
    const tRes = await fetch(`${hfBase}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ text: word })
    });
    const tData = await tRes.json();
    document.getElementById("meaning").value = tData.translated || "";

    // 2. 例文
    const eRes = await fetch(`${hfBase}/examples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ word: word, meaning: tData.translated })
    });
    const eData = await eRes.json();
    document.getElementById("example").value = eData.examples[0] || "";

  } catch (e) {
    alert("エラーが発生しました。URLやトークンを確認してください。");
  } finally {
    btn.textContent = "自動入力";
    btn.disabled = false;
  }
}

// 単語追加
function addWord() {
  const word = document.getElementById("word").value.trim();
  const meaning = document.getElementById("meaning").value.trim();
  const example = document.getElementById("example").value.trim();
  const tags = document.getElementById("tags").value.trim();

  if (!word || !meaning) return;

  words.push({
    id: Date.now(),
    word,
    meaning,
    example,
    tags,
    status: 'default',
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  document.getElementById("word").value = "";
  document.getElementById("meaning").value = "";
  document.getElementById("example").value = "";
  document.getElementById("tags").value = "";
  alert("追加したよ！");
}

// リスト表示
function renderWordList() {
  const listEl = document.getElementById("wordList");
  const query = document.getElementById("searchBar").value.toLowerCase();
  
  const filtered = words.filter(w => 
    w.word.toLowerCase().includes(query) || 
    w.meaning.toLowerCase().includes(query) ||
    w.tags.toLowerCase().includes(query)
  );

  listEl.innerHTML = filtered.map((w, i) => `
    <div class="card">
      <div style="display:flex; justify-content:space-between;">
        <strong>${w.word}</strong>
        <button onclick="deleteWord(${w.id})" class="small-btn danger">削除</button>
      </div>
      <div>${w.meaning}</div>
      ${w.example ? `<div style="font-size:0.85rem; color:#888; margin-top:5px; border-left:2px solid #00c896; padding-left:8px;">${w.example}</div>` : ''}
      <div style="margin-top:5px;">
        ${w.tags.split(' ').filter(t => t).map(t => `<span class="pill">#${t}</span>`).join('')}
      </div>
    </div>
  `).reverse().join('');
}

function deleteWord(id) {
  if(!confirm("消してもいい？")) return;
  words = words.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  renderWordList();
}

function saveSettings() {
  localStorage.setItem(HF_BASE_KEY, document.getElementById("hfBaseUrl").value.trim());
  localStorage.setItem(HF_TOKEN_KEY, document.getElementById("hfToken").value.trim());
  alert("設定を保存しました");
}

// 初期ロード
document.getElementById("hfBaseUrl").value = localStorage.getItem(HF_BASE_KEY) || "";
document.getElementById("searchBar").addEventListener('input', renderWordList);