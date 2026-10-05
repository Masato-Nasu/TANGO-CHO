
(function(){
  "use strict";

  const BANK_KEY = "tangoChoPart5BankV1";
  const STATS_KEY = "tangoChoPart5StatsV1";
  const MAX_BANK = 320;

  const state = {
    questions: [],
    index: 0,
    correct: 0,
    answered: false,
    startedAt: 0,
    questionStartedAt: 0,
    mode: "mix",
    pool: "priority",
    count: 5,
  };

  function byId(id){ return document.getElementById(id); }

  function esc(s){
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function shuffle(arr){
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }

  function normalizeTerm(s){
    return String(s || "").trim().toLowerCase();
  }

  function loadBank(){
    try{
      const x = JSON.parse(localStorage.getItem(BANK_KEY) || "[]");
      return Array.isArray(x) ? x : [];
    }catch(_){ return []; }
  }

  function saveBank(bank){
    try{
      localStorage.setItem(BANK_KEY, JSON.stringify((bank || []).slice(-MAX_BANK)));
    }catch(_){}
  }

  function loadStats(){
    try{
      const x = JSON.parse(localStorage.getItem(STATS_KEY) || "{}");
      return x && typeof x === "object" ? x : {};
    }catch(_){ return {}; }
  }

  function saveStats(stats){
    try{ localStorage.setItem(STATS_KEY, JSON.stringify(stats || {})); }catch(_){}
  }

  function recordResult(q, ok, ms){
    const stats = loadStats();
    const key = q.wordId || ("term:" + normalizeTerm(q.targetWord));
    const cur = stats[key] || {
      word: q.targetWord || "",
      attempts: 0,
      correct: 0,
      totalMs: 0,
      lastAt: ""
    };
    cur.word = q.targetWord || cur.word || "";
    cur.attempts += 1;
    if (ok) cur.correct += 1;
    cur.totalMs += Math.max(0, Number(ms) || 0);
    cur.lastAt = new Date().toISOString();
    stats[key] = cur;
    saveStats(stats);
  }

  function setMsg(text, type){
    const el = byId("part5Msg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "msg" + (type ? " " + type : "");
  }

  function updateScore(){
    const el = byId("part5ScorePill");
    if (el) el.textContent = state.correct + " / " + state.index;
  }

  function statusRank(st){
    if (st === "forgot") return 0;
    if (st === "fuzzy") return 1;
    if (st === "default") return 2;
    return 3;
  }

  function usableWords(){
    if (typeof loadWords !== "function") return [];
    const all = loadWords();
    const seen = new Set();
    const out = [];
    for (const w of all){
      if (!w || !w.word || !w.meaning) continue;
      const k = normalizeTerm(w.word);
      if (!k || seen.has(k)) continue;
      seen.add(k);
      out.push(w);
    }
    return out;
  }

  function selectWords(count, pool){
    const all = usableWords();
    let base = [];
    if (pool === "forgot") base = all.filter(function(w){ return w.status === "forgot"; });
    else if (pool === "fuzzy") base = all.filter(function(w){ return w.status === "fuzzy"; });
    else if (pool === "learned") base = all.filter(function(w){ return w.status === "learned"; });
    else if (pool === "priority") {
      const pri = shuffle(all.filter(function(w){ return w.status === "forgot" || w.status === "fuzzy"; }));
      const rest = shuffle(all.filter(function(w){ return w.status !== "forgot" && w.status !== "fuzzy"; }))
        .sort(function(a,b){ return statusRank(a.status) - statusRank(b.status); });
      base = pri.concat(rest);
    } else {
      base = shuffle(all);
    }
    if (pool !== "priority") base = shuffle(base);
    return base.slice(0, Math.min(count, base.length));
  }

  function validQuestion(q){
    if (!q || typeof q !== "object") return false;
    if (!String(q.sentence || "").includes("____")) return false;
    if (!Array.isArray(q.choices) || q.choices.length !== 4) return false;
    if (q.choices.some(function(x){ return !String(x || "").trim(); })) return false;
    const uniq = new Set(q.choices.map(function(x){ return normalizeTerm(x); }));
    if (uniq.size !== 4) return false;
    const c = Number(q.correct);
    if (!Number.isInteger(c) || c < 0 || c > 3) return false;
    if (!String(q.targetWord || "").trim()) return false;
    return true;
  }

  function hydrateQuestion(q, selectedMap, mode){
    const key = normalizeTerm(q.targetWord);
    const w = selectedMap.get(key);
    const out = {
      targetWord: String(q.targetWord || "").trim(),
      wordId: w ? w.id : (q.wordId || ""),
      type: q.type === "form" ? "form" : "vocab",
      sentence: String(q.sentence || "").trim(),
      choices: Array.isArray(q.choices) ? q.choices.map(function(x){ return String(x || "").trim(); }) : [],
      correct: Number(q.correct),
      explanation: String(q.explanation || "").trim(),
      mode: mode,
      createdAt: q.createdAt || new Date().toISOString()
    };
    return out;
  }

  function cachedFor(words, mode){
    const bank = loadBank();
    const used = new Set();
    const out = [];
    for (const w of words){
      const key = normalizeTerm(w.word);
      const candidates = bank.filter(function(q){
        if (normalizeTerm(q.targetWord) !== key) return false;
        if (mode === "mix") return true;
        return q.type === mode;
      });
      if (!candidates.length) continue;
      const q = candidates[Math.floor(Math.random() * candidates.length)];
      const sig = q.sentence + "|" + q.choices.join("|");
      if (used.has(sig)) continue;
      used.add(sig);
      out.push(Object.assign({}, q, {wordId:w.id}));
    }
    return out;
  }

  async function generateBatch(words, mode){
    if (typeof callOpenAiJson !== "function") throw new Error("AI機能を読み込めませんでした。");
    const list = words.map(function(w, i){
      const pos = Array.isArray(w.posCandidates) && w.posCandidates.length ? w.posCandidates.join("/") : "-";
      return (i + 1) + ". " + w.word + " | " + w.meaning + " | POS:" + pos;
    }).join("\n");

    const result = await callOpenAiJson({
      instruction:
        "You create accurate TOEIC Listening & Reading Part 5 sentence-completion questions for advanced Japanese learners. " +
        "Return only valid JSON. Every question must have exactly one clearly correct answer. Avoid obscure grammar tricks and avoid copyrighted test questions.",
      input:
        "Create exactly " + words.length + " original TOEIC-style Part 5 questions, using each supplied target term exactly once.\n" +
        "Mode: " + mode + ". 'vocab' means vocabulary/usage. 'form' means word form/part of speech. " +
        "'mix' means a balanced mix of vocabulary and word-form questions. If a word-form question would be unnatural, use vocab.\n" +
        "Sentence must contain exactly one blank written as ____. Keep the sentence natural business/everyday English.\n" +
        "Return this JSON shape exactly: {\"questions\":[{\"targetWord\":\"...\",\"type\":\"vocab|form\",\"sentence\":\"... ____ ...\",\"choices\":[\"A\",\"B\",\"C\",\"D\"],\"correct\":0,\"explanation\":\"短い日本語解説\"}]}.\n" +
        "correct is the zero-based index 0-3. Keep explanation under 55 Japanese characters. " +
        "For vocab mode, the correct option should normally be the supplied target term itself. " +
        "For form mode, the correct option may be a derived/inflected form from the same word family.\n\nTargets:\n" + list,
      maxOutputTokens: Math.min(5000, 700 + words.length * 380)
    });

    const arr = Array.isArray(result && result.questions) ? result.questions : [];
    const selectedMap = new Map(words.map(function(w){ return [normalizeTerm(w.word), w]; }));
    const out = [];
    for (const raw of arr){
      const q = hydrateQuestion(raw, selectedMap, mode);
      if (!selectedMap.has(normalizeTerm(q.targetWord))) continue;
      if (!validQuestion(q)) continue;
      out.push(q);
    }
    return out;
  }

  async function prepareQuestions(words, mode){
    const cached = cachedFor(words, mode);
    const have = new Set(cached.map(function(q){ return normalizeTerm(q.targetWord); }));
    const missing = words.filter(function(w){ return !have.has(normalizeTerm(w.word)); });
    const generated = [];

    for (let i = 0; i < missing.length; i += 10){
      const batch = missing.slice(i, i + 10);
      setMsg("PART 5問題を準備中… " + Math.min(i + batch.length, missing.length) + " / " + missing.length, "");
      const g = await generateBatch(batch, mode);
      generated.push.apply(generated, g);
    }

    if (generated.length){
      const bank = loadBank();
      saveBank(bank.concat(generated));
    }

    const combined = cached.concat(generated);
    const byTerm = new Map();
    for (const q of combined){
      const k = normalizeTerm(q.targetWord);
      if (!byTerm.has(k)) byTerm.set(k, q);
    }

    const ordered = [];
    for (const w of words){
      const q = byTerm.get(normalizeTerm(w.word));
      if (q) ordered.push(Object.assign({}, q, {wordId:w.id}));
    }
    return shuffle(ordered);
  }

  function renderIdle(){
    const area = byId("part5Area");
    if (!area) return;
    area.innerHTML =
      '<p class="note">単語帳の語を使って、TOEIC Part 5形式で練習します。5語・10語・30語を何度でも選べます。</p>';
    updateScore();
  }

  function renderQuestion(){
    const area = byId("part5Area");
    if (!area) return;
    if (!state.questions.length) return renderIdle();
    if (state.index >= state.questions.length) return renderResult();

    const q = state.questions[state.index];
    state.answered = false;
    state.questionStartedAt = performance.now();

    const n = state.index + 1;
    const total = state.questions.length;
    const typeLabel = q.type === "form" ? "WORD FORM" : "VOCAB";

    let html = '';
    html += '<div class="part5-head"><span class="part5-kicker">' + typeLabel + '</span><span class="part5-progress">' + n + ' / ' + total + '</span></div>';
    html += '<p class="part5-sentence">' + esc(q.sentence) + '</p>';
    html += '<div class="part5-choices">';
    q.choices.forEach(function(choice, i){
      html += '<button class="part5-choice" type="button" data-i="' + i + '"><span class="part5-letter">' + String.fromCharCode(65+i) + '</span><span>' + esc(choice) + '</span></button>';
    });
    html += '</div>';
    html += '<div id="part5Feedback" class="part5-feedback" aria-live="polite"></div>';
    html += '<button id="part5NextBtn" class="primary-btn full-width part5-next" type="button" style="display:none">' + (n === total ? '結果を見る' : '次へ') + '</button>';

    area.innerHTML = html;

    area.querySelectorAll(".part5-choice").forEach(function(btn){
      btn.addEventListener("click", function(){
        answer(Number(btn.getAttribute("data-i")));
      });
    });
    const next = byId("part5NextBtn");
    if (next) next.addEventListener("click", function(){
      state.index += 1;
      updateScore();
      renderQuestion();
    });
  }

  function answer(chosen){
    if (state.answered) return;
    const q = state.questions[state.index];
    if (!q) return;
    state.answered = true;

    const ok = chosen === q.correct;
    const elapsed = performance.now() - state.questionStartedAt;
    if (ok) state.correct += 1;
    state.index += 0;
    recordResult(q, ok, elapsed);

    try{
      if (ok && typeof sfxCorrect === "function") sfxCorrect();
      if (!ok && typeof sfxWrong === "function") sfxWrong();
    }catch(_){}

    const buttons = Array.from(document.querySelectorAll("#part5Area .part5-choice"));
    buttons.forEach(function(b, i){
      b.disabled = true;
      if (i === q.correct) b.classList.add("correct");
      if (i === chosen && i !== q.correct) b.classList.add("wrong");
    });

    const fb = byId("part5Feedback");
    if (fb){
      const sec = Math.max(0.1, elapsed / 1000).toFixed(1);
      const correctText = q.choices[q.correct] || "";
      fb.className = "part5-feedback " + (ok ? "ok" : "err");
      fb.innerHTML =
        '<strong>' + (ok ? '正解' : '不正解') + '</strong>' +
        '<span>正解: ' + esc(correctText) + '</span>' +
        (q.explanation ? '<span>' + esc(q.explanation) + '</span>' : '') +
        '<span class="part5-time">' + sec + '秒</span>';
    }

    const next = byId("part5NextBtn");
    if (next) next.style.display = "block";
    const score = byId("part5ScorePill");
    if (score) score.textContent = state.correct + " / " + (state.index + 1);
  }

  function renderResult(){
    const area = byId("part5Area");
    if (!area) return;
    const total = state.questions.length;
    const pct = total ? Math.round(state.correct / total * 100) : 0;
    const elapsed = Math.max(1, performance.now() - state.startedAt);
    const avg = total ? (elapsed / total / 1000).toFixed(1) : "0.0";

    const stats = loadStats();
    const sessionKeys = new Set(state.questions.map(function(q){ return q.wordId || ("term:" + normalizeTerm(q.targetWord)); }));
    const weak = Object.keys(stats)
      .filter(function(k){ return sessionKeys.has(k); })
      .map(function(k){ return stats[k]; })
      .filter(function(x){ return x && x.attempts; })
      .sort(function(a,b){
        const ar = a.correct / a.attempts;
        const br = b.correct / b.attempts;
        if (ar !== br) return ar - br;
        return (b.totalMs / b.attempts) - (a.totalMs / a.attempts);
      })
      .slice(0,5);

    let weakHtml = "";
    if (weak.length){
      weakHtml = '<div class="part5-weak"><div class="part5-result-label">要復習</div>' +
        weak.map(function(x){
          const r = Math.round(x.correct / x.attempts * 100);
          const sec = (x.totalMs / x.attempts / 1000).toFixed(1);
          return '<div class="part5-weak-row"><b>' + esc(x.word) + '</b><span>' + r + '% · ' + sec + '秒</span></div>';
        }).join("") + '</div>';
    }

    area.innerHTML =
      '<div class="part5-result">' +
        '<div class="part5-result-score">' + state.correct + ' / ' + total + '</div>' +
        '<div class="part5-result-meta">正答率 ' + pct + '% · 平均 ' + avg + '秒</div>' +
        weakHtml +
        '<button id="part5AgainBtn" class="primary-btn full-width" type="button">もう一度</button>' +
      '</div>';

    const again = byId("part5AgainBtn");
    if (again) again.addEventListener("click", start);
    const score = byId("part5ScorePill");
    if (score) score.textContent = state.correct + " / " + total;
  }

  async function start(){
    const startBtn = byId("part5StartBtn");
    const count = Math.max(1, parseInt((byId("part5Count") || {}).value || "5", 10));
    const mode = (byId("part5Mode") || {}).value || "mix";
    const pool = (byId("part5Pool") || {}).value || "priority";

    const words = selectWords(count, pool);
    if (!words.length){
      setMsg("この条件で出題できる単語がありません。", "err");
      return;
    }
    if (words.length < count){
      setMsg("対象語が " + words.length + "語のため、その数で出題します。", "");
    } else {
      setMsg("", "");
    }

    state.mode = mode;
    state.pool = pool;
    state.count = words.length;
    state.correct = 0;
    state.index = 0;
    state.questions = [];
    state.startedAt = performance.now();
    updateScore();

    if (startBtn){
      startBtn.disabled = true;
      startBtn.textContent = "準備中…";
    }

    try{
      const qs = await prepareQuestions(words, mode);
      if (!qs.length) throw new Error("問題を作成できませんでした。もう一度お試しください。");
      state.questions = qs.slice(0, words.length);
      state.startedAt = performance.now();
      setMsg("", "");
      renderQuestion();
    }catch(e){
      setMsg(String(e && e.message ? e.message : e), "err");
      renderIdle();
    }finally{
      if (startBtn){
        startBtn.disabled = false;
        startBtn.textContent = "スタート";
      }
    }
  }

  function setup(){
    const startBtn = byId("part5StartBtn");
    if (!startBtn) return;
    startBtn.addEventListener("click", start);

    const countEl = byId("part5Count");
    if (countEl){
      countEl.addEventListener("change", function(){
        const label = byId("part5CountLabel");
        if (label) label.textContent = countEl.value + "語";
      });
    }

    renderIdle();
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
