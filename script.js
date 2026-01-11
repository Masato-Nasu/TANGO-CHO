const STORAGE_KEY = "tangoChoWords";
const HF_BASE_KEY = "tangoChoHfBase";
const HF_TOKEN_KEY = "tangoChoAppToken";

let words = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

async function fetchAutoFill() {
  const word = document.getElementById("word").value.trim();
  const hfBase = localStorage.getItem(HF_BASE_KEY);
  const token = localStorage.getItem(HF_TOKEN_KEY);
  if (!word || !hfBase) return alert("設定を確認してください");

  const btn = document.getElementById("autoFillBtn");
  btn.textContent = "取得中...";
  btn.disabled = true;

  try {
    const tRes = await fetch(`${hfBase}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ text: word })
    });
    const tData = await tRes.json();
    const meaning = tData.translated || "";
    document.getElementById("meaning").value = meaning;

    const eRes = await fetch(`${hfBase}/examples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ word: word, meaning: meaning })
    });
    const eData = await eRes.json();
    document.getElementById("example").value = eData.examples[0] || "";
  } catch (e) {
    alert("通信エラーが発生しました");
  } finally {
    btn.textContent = "自動入力";
    btn.disabled = false;
  }
}

function addWord() {
  const word = document.getElementById("word").value.trim();
  const meaning = document.getElementById("meaning").value.trim();
  const example = document.getElementById("example").value.trim();
  const tags = document.getElementById("tags").value.trim();
  if (!word || !meaning) return;

  const newItem = { id: Date.now(), word, meaning, example, tags, status: 'default', createdAt: new Date().toISOString() };
  words.push(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  
  document.getElementById("word").value = "";
  document.getElementById("meaning").value = "";
  document.getElementById("example").value = "";
  renderWordList();
  alert("保存したよ！");
}

// renderWordList 内で例文を表示するよう <div> を追加
// クイズ機能、インポート/エクスポート、TTS等は元のコードをそのまま結合してください。