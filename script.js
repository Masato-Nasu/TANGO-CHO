const STORAGE_KEY = "tangoChoWords";
const HF_BASE_KEY = "tangoChoHfBase";
const HF_TOKEN_KEY = "tangoChoAppToken";

let words = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// 初期表示
renderList();

// リスト表示
function renderList() {
    const listEl = document.getElementById('wordList');
    if(!listEl) return;
    listEl.innerHTML = words.map((w, i) => `
        <div class="card">
            <strong>${w.word}</strong>: ${w.meaning}<br>
            <small style="color:#888">${w.example || ""}</small>
            <div style="margin-top:5px">
                <button onclick="deleteWord(${i})">削除</button>
            </div>
        </div>
    `).join('');
}

// 自動入力（ここがメインの修正点）
async function fetchAutoFill() {
    const word = document.getElementById('word').value.trim();
    const hfBase = localStorage.getItem(HF_BASE_KEY);
    if (!word || !hfBase) return alert("単語と設定(URL)を確認してね");

    const btn = document.getElementById('autoFillBtn');
    btn.textContent = "AI考え中...";
    
    try {
        // 1. 翻訳
        const tRes = await fetch(`${hfBase}/translate`, {
            method: 'POST',
            body: JSON.stringify({ text: word })
        });
        const tData = await tRes.json();
        const meaning = tData.translated;
        document.getElementById('meaning').value = meaning;

        // 2. 自然な例文
        const eRes = await fetch(`${hfBase}/examples`, {
            method: 'POST',
            body: JSON.stringify({ word: word, meaning: meaning })
        });
        const eData = await eRes.json();
        document.getElementById('example').value = eData.examples[0];

    } catch (e) {
        alert("エラーが起きたよ");
    } finally {
        btn.textContent = "自動入力";
    }
}

function addWord() {
    const word = document.getElementById('word').value.trim();
    const meaning = document.getElementById('meaning').value.trim();
    const example = document.getElementById('example').value.trim();
    if (!word || !meaning) return;

    words.push({ word, meaning, example, id: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    renderList();
    
    // 入力欄をクリア
    document.getElementById('word').value = "";
    document.getElementById('meaning').value = "";
    document.getElementById('example').value = "";
}

function deleteWord(index) {
    words.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    renderList();
}

// 設定保存
function saveSettings() {
    const url = document.getElementById('hfBaseUrl').value.trim();
    localStorage.setItem(HF_BASE_KEY, url);
    alert("保存したよ！");
}