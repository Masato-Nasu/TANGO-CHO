const STORAGE_KEY = "tangoChoWords";
const HF_BASE_KEY = "tangoChoHfBase";

let words = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// 初期表示
document.getElementById('hfBaseUrl').value = localStorage.getItem(HF_BASE_KEY) || "";
renderWordList();

// リストの表示
function renderWordList() {
    const listEl = document.getElementById('wordList');
    listEl.innerHTML = words.map((w, i) => `
        <div class="card" style="border-left: 4px solid var(--accent);">
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <strong style="font-size:1.2rem; color:var(--accent);">${w.word}</strong>
                    <span style="margin-left:10px; color:#ccc;">${w.meaning}</span>
                </div>
                <button onclick="deleteWord(${i})" style="background:none; border:none; color:#ff4f4f; cursor:pointer;">削除</button>
            </div>
            ${w.example ? `<div style="margin-top:8px; font-size:0.9rem; color:#bbb; font-style:italic; background:#222; padding:8px; border-radius:8px;">💡 ${w.example}</div>` : ''}
            <div style="margin-top:8px;">
                ${(w.tags || "").split(',').filter(t => t).map(t => `<span class="pill" style="font-size:0.7rem; margin-right:4px;">#${t.trim()}</span>`).join('')}
            </div>
        </div>
    `).reverse().join('');
}

// 自動入力 (API連携)
async function fetchAutoFill() {
    const word = document.getElementById('word').value.trim();
    const hfBase = localStorage.getItem(HF_BASE_KEY);
    
    if (!word) return alert("単語を入力してね");
    if (!hfBase) return alert("設定でAPIのURLを保存してね");

    const btn = document.getElementById('autoFillBtn');
    btn.textContent = "作成中...";
    btn.disabled = true;

    try {
        // 1. 翻訳
        const tRes = await fetch(`${hfBase}/translate`, {
            method: 'POST',
            body: JSON.stringify({ text: word })
        });
        const tData = await tRes.json();
        const meaning = tData.translated;
        document.getElementById('meaning').value = meaning;

        // 2. 例文
        const eRes = await fetch(`${hfBase}/examples`, {
            method: 'POST',
            body: JSON.stringify({ word: word, meaning: meaning })
        });
        const eData = await eRes.json();
        if (eData.examples && eData.examples[0]) {
            document.getElementById('example').value = eData.examples[0];
        }
    } catch (e) {
        alert("APIに接続できなかったよ。URLを確認してね。");
    } finally {
        btn.textContent = "自動入力";
        btn.disabled = false;
    }
}

// 単語追加
function addWord() {
    const word = document.getElementById('word').value.trim();
    const meaning = document.getElementById('meaning').value.trim();
    const example = document.getElementById('example').value.trim();
    const tags = document.getElementById('tags').value.trim();

    if (!word || !meaning) return alert("単語と意味は必須だよ！");

    words.push({ word, meaning, example, tags, id: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    
    // クリア
    document.getElementById('word').value = "";
    document.getElementById('meaning').value = "";
    document.getElementById('example').value = "";
    document.getElementById('tags').value = "";
    
    renderWordList();
}

function deleteWord(index) {
    if(!confirm("本当に消していい？")) return;
    const actualIndex = words.length - 1 - index;
    words.splice(actualIndex, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    renderWordList();
}

function saveSettings() {
    const url = document.getElementById('hfBaseUrl').value.trim().replace(/\/$/, "");
    localStorage.setItem(HF_BASE_KEY, url);
    alert("保存しました！");
}