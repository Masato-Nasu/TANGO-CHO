// BANK_ENJA: English fortune sentences + Japanese paired translation.
// Structure: BANK_ENJA[level][category][tier] -> array of {en, ja}
// Levels: jhs (中学生), hs (高校生), adult (大人)

// --- Adult / High school bank (full) ---
const BANK_ADULT = {
  overall: {
    a: [
      { en: "Your timing is excellent today. If you act decisively, you can turn a small chance into a clear win.", ja: "今日はタイミングが良い日です。迷わず動けば、小さなチャンスを確かな成果に変えられます。" },
      { en: "A clean decision will unlock momentum. Choose one priority and execute it without hesitation.", ja: "決断を一つクリアにすると勢いが出ます。優先順位を一つ選び、迷わず実行しましょう。" },
      { en: "Your focus is sharp. Handle the most important item first, and everything else will follow smoothly.", ja: "集中力が冴えています。最重要項目を先に片付けると、他もスムーズに流れます。" },
      { en: "You can communicate with unusual clarity. A brief message or statement will have strong impact.", ja: "普段以上に明快に伝えられます。短い一言でも、十分に影響力があります。" },
      { en: "A practical plan works perfectly. Put it in writing and move step by step—results will be visible.", ja: "現実的な計画がうまく機能します。書き出して一歩ずつ進めると、成果が見えてきます。" },
      { en: "You are supported by a steady rhythm. Maintain your pace and finish what you started.", ja: "安定した流れに支えられています。ペースを保ち、着手したことを最後までやり切りましょう。" },
      { en: "Your judgment is reliable. If you choose the simplest option, it will outperform the complicated one.", ja: "判断が安定しています。複雑な案より、シンプルな案のほうが結果を出します。" },
      { en: "An opportunity appears in the middle of routine work. Notice it, and take initiative.", ja: "日常の作業の中に好機が潜んでいます。見逃さず、主体的に動いてみましょう。" },
      { en: "You can raise quality without extra effort. Tighten the basics—accuracy and speed will improve together.", ja: "余計な負荷を増やさずに質を上げられます。基本を締めると、精度とスピードが同時に上がります。" },
      { en: "Today rewards consistency. A small, repeated action will create a surprisingly strong outcome.", ja: "今日は継続が報われます。小さな行動の積み重ねが、想像以上に強い結果を生みます。" },
      { en: "You can recover lost time. Reduce distractions for one hour and complete a task you have avoided.", ja: "遅れを取り戻せます。1時間だけ雑音を減らし、先延ばししていた作業を完了させましょう。" },
      { en: "Your energy is balanced. If you protect your schedule, you will end the day feeling satisfied.", ja: "エネルギー配分が良好です。予定を守れば、納得感のある一日になります。" },
    ],
    b: [
      { en: "Progress is steady. If you organize your priorities, you will avoid unnecessary stress.", ja: "進み方は安定しています。優先順位を整理すれば、無駄なストレスを避けられます。" },
      { en: "Nothing is urgent, but details matter. Review your plan once and adjust gently.", ja: "緊急事態ではありませんが、細部が大事です。計画を一度見直し、軽く調整しましょう。" },
      { en: "Your pace is fine. Do not rush—consistent work will be more efficient than quick fixes.", ja: "ペースは十分です。焦らず、場当たりよりも着実な作業のほうが効率的です。" },
      { en: "Choose a realistic target. Completing one task fully is better than touching five tasks halfway.", ja: "現実的な目標を選びましょう。5つを半端に触るより、1つを完了させるほうが価値があります。" },
      { en: "Communication improves if you simplify. Use short sentences and confirm the key point.", ja: "伝達はシンプルにすると改善します。短文で、要点を確認しましょう。" },
      { en: "A calm approach works best. Protect your time and keep a small buffer in your schedule.", ja: "落ち着いた進め方が最適です。時間を守り、予定に少し余白を作りましょう。" },
      { en: "If you feel scattered, return to the basics. A checklist will restore control quickly.", ja: "散らばる感覚があれば基本へ戻りましょう。チェックリストで素早く立て直せます。" },
      { en: "Today favors maintenance. Improve one weak point and keep everything else stable.", ja: "今日は維持・整備向きです。弱点を一つだけ改善し、他は安定させましょう。" },
      { en: "You can gain trust through small actions. Respond on time and keep your promise.", ja: "小さな行動で信頼を積めます。返信を遅らせず、約束を守りましょう。" },
      { en: "Avoid extremes. A moderate decision will be safer and still effective.", ja: "極端は避けましょう。中庸な判断が安全で、十分に効果も出ます。" },
      { en: "If you hesitate, write it down. Seeing options on paper will clarify the next step.", ja: "迷ったら書き出しましょう。紙に出すだけで次の一手が明確になります。" },
      { en: "A small change in routine helps. Adjust one habit and measure the result.", ja: "ルーティンの小さな変更が効きます。習慣を一つ調整して、結果を確認しましょう。" },
    ],
    c: [
      { en: "Keep your plan simple today. Too many options will reduce accuracy and slow you down.", ja: "今日は計画をシンプルに。選択肢を増やしすぎると精度が落ち、スピードも下がります。" },
      { en: "Noise around you may increase. Protect your focus by limiting information and notifications.", ja: "周囲のノイズが増えそうです。情報や通知を絞って集中を守りましょう。" },
      { en: "Double-check before you commit. A small oversight can create a larger correction later.", ja: "確定する前に二重チェックを。小さな見落としが、後で大きな修正になります。" },
      { en: "Do not force a quick conclusion. If possible, postpone major decisions until tomorrow.", ja: "急いで結論を出さないでください。可能なら大きな決断は明日に回しましょう。" },
      { en: "Energy may drop unexpectedly. Reduce your workload and aim for a clean minimum.", ja: "エネルギーが急に落ちやすい日です。負荷を減らし、最小限をきれいにこなしましょう。" },
      { en: "Miscommunication is likely if you assume. Confirm facts and repeat the key details.", ja: "思い込みで進めると誤解が起きやすいです。事実を確認し、要点を復唱しましょう。" },
      { en: "Avoid unnecessary conflict. Choose neutral language and keep boundaries clear.", ja: "不要な衝突は避けましょう。中立的な言い方にして、境界線をはっきりさせてください。" },
      { en: "If something feels off, pause. A short reset will prevent a bigger mistake.", ja: "違和感があれば一度止まりましょう。短いリセットが大きなミスを防ぎます。" },
      { en: "Today is not for risky bets. Prefer reliability over excitement.", ja: "今日はリスクを取る日ではありません。刺激よりも確実さを選びましょう。" },
      { en: "Do one thing at a time. Multitasking will increase errors and reduce quality.", ja: "同時並行は避けて一つずつ。マルチタスクはエラーが増え、品質が下がります。" },
      { en: "Your schedule may get disrupted. Keep a buffer and prepare a backup plan.", ja: "予定が崩れやすい日です。余白を取り、代替案を用意しましょう。" },
      { en: "Treat today as maintenance. Clean up,整理, and prepare for the next move.", ja: "今日は整備日にしましょう。片付け・整理をして、次の一手に備えてください。" },
    ],
  },

  love: {
    a: [
      { en: "Your message lands beautifully today. Speak honestly and keep it simple.", ja: "今日は言葉が綺麗に届きます。正直に、そしてシンプルに伝えてみてください。" },
      { en: "A warm gesture will be remembered. Choose a small action that shows respect.", ja: "温かい行動が記憶に残ります。敬意が伝わる小さな行動を選びましょう。" },
      { en: "If you want to reconnect, today is ideal. Send one clear message and wait calmly.", ja: "距離を縮めたいなら今日は最適です。明確な一通を送り、落ち着いて待ちましょう。" },
      { en: "You can set a boundary without tension. A calm tone will protect both sides.", ja: "今日は緊張を生まずに境界線を示せます。落ち着いたトーンが双方を守ります。" },
      { en: "Trust grows through consistency. Keep your promise, even in small things.", ja: "信頼は一貫性で育ちます。小さなことでも約束を守りましょう。" },
      { en: "A sincere compliment works. Be specific about what you appreciate.", ja: "誠実な褒め言葉が効きます。何が良いのかを具体的に伝えてください。" },
      { en: "Timing favors conversation. Ask one thoughtful question and listen fully.", ja: "会話のタイミングが良い日です。思慮ある質問を一つして、最後まで聞きましょう。" },
      { en: "You can resolve a misunderstanding quickly. Clarify one detail and move on.", ja: "誤解は素早く解けます。1点だけ明確にして前へ進みましょう。" },
      { en: "Your presence feels reassuring. Stay steady, and the relationship becomes more stable.", ja: "あなたの存在が安心感になります。安定した態度が関係をより安定させます。" },
      { en: "A gentle initiative is rewarded. Suggest a plan that is easy to accept.", ja: "やさしい提案が報われます。相手が受け入れやすい計画を提示してみてください。" },
      { en: "If you are single, a natural connection may appear. Show up as yourself.", ja: "シングルなら自然な縁が現れそうです。背伸びせず、そのままの自分で。" },
      { en: "Today supports forgiveness. Release a small grudge and you will feel lighter.", ja: "今日は許しに追い風があります。小さなしこりを手放すと心が軽くなります。" },
    ],
    b: [
      { en: "Keep the tone gentle. A calm reply will prevent unnecessary tension.", ja: "トーンは穏やかに。落ち着いた返信が余計な緊張を防ぎます。" },
      { en: "Avoid guessing. If you are unsure, ask directly and confirm.", ja: "推測は避けましょう。曖昧なら直接聞いて確認を。" },
      { en: "Small care matters today. A simple check-in message is enough.", ja: "今日は小さな気遣いが効きます。軽い一言の連絡で十分です。" },
      { en: "Do not push for a conclusion. Let the conversation breathe.", ja: "結論を急がないでください。会話に余白を作りましょう。" },
      { en: "If emotions rise, slow down. Choose one point and speak clearly.", ja: "感情が上がったらスピードを落として。要点を一つに絞って明確に話しましょう。" },
      { en: "A misunderstanding may come from timing. Reply when you can focus.", ja: "誤解はタイミングから起きやすいです。集中できる時に返信しましょう。" },
      { en: "Respect your boundaries. Saying " + "" + "no" + "" + " politely is better than resenting later.", ja: "境界線を尊重してください。後で不満を溜めるより、丁寧に『NO』と言うほうが良いです。" },
      { en: "Today is good for maintenance. Keep things stable rather than dramatic.", ja: "今日は維持向きです。ドラマよりも安定を選びましょう。" },
      { en: "Listen more than you talk. Understanding improves with patience.", ja: "話すより聞くを多めに。忍耐が理解を深めます。" },
      { en: "Choose kindness, not perfection. A small mistake is not a big deal.", ja: "完璧より親切を。小さなミスは大問題ではありません。" },
      { en: "If you feel distant, return to basics: greet, confirm, and appreciate.", ja: "距離を感じたら基本へ：挨拶・確認・感謝。" },
      { en: "Keep your expectations realistic. This will protect your mood.", ja: "期待値は現実的に。それが気分を守ります。" },
    ],
    c: [
      { en: "Avoid sharp words today. Even a small comment can be taken too seriously.", ja: "今日は強い言葉を避けましょう。小さな一言でも重く受け取られがちです。" },
      { en: "Do not over-interpret silence. If you need clarity, ask once and stop.", ja: "沈黙を深読みしないでください。必要なら一度だけ聞き、そこで止めましょう。" },
      { en: "Emotions can swing. If you feel irritated, take space before replying.", ja: "感情が揺れやすい日です。イラっとしたら返信前に距離を取りましょう。" },
      { en: "Today is not ideal for ultimatums. Protect the relationship by lowering intensity.", ja: "今日は最後通牒は不向きです。強度を下げることが関係を守ります。" },
      { en: "Misunderstandings are likely. Confirm details and avoid assumptions.", ja: "誤解が起きやすいです。詳細を確認し、思い込みを避けてください。" },
      { en: "If a topic feels heavy, postpone it. Choose a lighter conversation.", ja: "話題が重いと感じたら延期を。軽い会話を選びましょう。" },
      { en: "Boundaries matter more than sympathy today. Keep your limits clear.", ja: "今日は共感より境界線が重要です。限界ラインを明確に。" },
      { en: "Avoid comparing. Focus on what is working, not what is missing.", ja: "比較は避けましょう。足りないものより、うまくいっている点に注目を。" },
      { en: "Do not chase certainty. Let things settle naturally.", ja: "確実さを追いすぎないで。自然に落ち着くのを待ちましょう。" },
      { en: "A short apology can prevent a long conflict. Keep it simple.", ja: "短い謝罪が長い衝突を防ぎます。シンプルに。" },
      { en: "If you feel drained, protect your energy. Say no to extra demands.", ja: "疲れを感じるならエネルギーを守って。追加の要求は断りましょう。" },
      { en: "Choose stability over excitement today. Quiet care is enough.", ja: "今日は刺激より安定を。静かな気遣いで十分です。" },
    ],
  },

  work: {
    a: [
      { en: "Your output can exceed expectations. Focus on quality, then deliver on time.", ja: "期待を上回る成果が出せます。品質に集中し、期限内に出しましょう。" },
      { en: "A negotiation goes in your favor if you prepare. Confirm your conditions and speak clearly.", ja: "準備すれば交渉は有利に進みます。条件を確認し、明確に話しましょう。" },
      { en: "You can solve a tricky problem quickly. Break it into steps and finish the first one now.", ja: "難しい問題も早く解けます。手順に分け、まず一歩目を今やりましょう。" },
      { en: "Today supports leadership. Take initiative and set the pace for others.", ja: "今日は主導権が取れます。率先して動き、周囲のペースを作りましょう。" },
      { en: "Your schedule aligns well. Use the window of focus to complete a high-impact task.", ja: "予定の噛み合わせが良い日です。集中できる時間帯に影響の大きい作業を完了させて。" },
      { en: "A clear document wins. Write a short summary and align the team.", ja: "短いドキュメントが効きます。要点をまとめ、チームの認識を揃えましょう。" },
      { en: "Feedback is constructive today. Ask for it, then refine your work immediately.", ja: "今日はフィードバックが建設的です。もらってすぐに修正へ反映しましょう。" },
      { en: "You can improve efficiency by simplifying. Remove one unnecessary step from your workflow.", ja: "シンプル化で効率が上がります。作業手順から不要な一手を削りましょう。" },
      { en: "Your decisions are trusted. Choose the practical option and commit.", ja: "判断が信頼されます。現実的な案を選び、腹を決めましょう。" },
      { en: "A meeting can become productive. Set an agenda and keep it short.", ja: "会議が有益になりやすい日です。議題を立て、短く終えましょう。" },
      { en: "Deadlines feel manageable. Prioritize, execute, and report progress.", ja: "締切は管理可能です。優先順位を付けて実行し、進捗を共有しましょう。" },
      { en: "Your concentration is strong. Protect it by turning off distractions.", ja: "集中力が強い日です。通知などを切って守りましょう。" },
    ],
    b: [
      { en: "Work moves forward steadily. Confirm the next step and keep your pace.", ja: "仕事は着実に進みます。次の一手を確認し、ペースを保ちましょう。" },
      { en: "Details matter more than speed. Review once before submitting.", ja: "スピードより細部が重要です。提出前に一度見直しましょう。" },
      { en: "Avoid multitasking. Completing one task will raise overall efficiency.", ja: "マルチタスクは避けましょう。1つ完了させると全体効率が上がります。" },
      { en: "If collaboration is slow, clarify responsibilities. One clear owner improves flow.", ja: "連携が遅いなら責任範囲を明確に。担当を1人決めると流れが良くなります。" },
      { en: "A calm message prevents confusion. Write short, confirm, and proceed.", ja: "落ち着いた連絡が混乱を防ぎます。短く書いて確認し、進めましょう。" },
      { en: "Today is good for maintenance tasks. Clean up files, notes, and open threads.", ja: "今日は整備作業に向きます。ファイル・メモ・未完了のやり取りを整理しましょう。" },
      { en: "If you feel stuck, ask one question. A small hint can unlock progress.", ja: "詰まったら質問を一つ。小さなヒントで前に進めます。" },
      { en: "Keep your standard consistent. Do not over-polish; finish and ship.", ja: "基準は一定に。磨きすぎず、終わらせて出しましょう。" },
      { en: "Measure the result. A quick check will prevent rework later.", ja: "結果を測りましょう。早い確認が後の手戻りを防ぎます。" },
      { en: "Stay flexible. A minor change in plan can improve the outcome.", ja: "柔軟に。小さな計画変更が結果を良くします。" },
      { en: "Choose clarity over volume. Fewer messages with clear meaning work best.", ja: "量より明確さを。少ない連絡でも意味がはっきりしているほうが良いです。" },
      { en: "Protect a focus block. One uninterrupted hour will be valuable.", ja: "集中時間を確保しましょう。中断のない1時間が価値になります。" },
    ],
    c: [
      { en: "Avoid rushing today. A small mistake can cost more time than you save.", ja: "今日は急がないで。小さなミスが節約以上の時間を奪います。" },
      { en: "Miscommunication is likely. Confirm requirements and repeat key details.", ja: "誤解が起きやすいです。要件を確認し、要点を繰り返しましょう。" },
      { en: "Do not take on extra tasks. Protect your capacity and finish the essentials.", ja: "追加の仕事を背負わないでください。キャパを守り、必須を終わらせましょう。" },
      { en: "If the timeline is tight, simplify the scope. Reduce features, keep quality.", ja: "スケジュールが厳しいならスコープを絞りましょう。機能を減らし、品質を守って。" },
      { en: "Today is not ideal for confrontation. Use neutral language and document decisions.", ja: "今日は対立は不向きです。中立的に話し、決定事項は記録しましょう。" },
      { en: "Expect interruptions. Build a buffer and protect the most important block.", ja: "割り込みが入りやすいです。余白を作り、最重要の時間帯を守りましょう。" },
      { en: "If you feel overloaded, reset. Close one loop, then stop.", ja: "過負荷ならリセットを。未完了を1つ閉じて、そこで止めましょう。" },
      { en: "Avoid optimistic estimates. Use conservative numbers and confirm resources.", ja: "楽観的な見積もりは避けて。保守的な数値で、リソースも確認しましょう。" },
      { en: "A delay may be safer than a flawed delivery. Prioritize reliability.", ja: "不完全な納品より延期のほうが安全です。確実さを優先しましょう。" },
      { en: "Keep records today. Notes will prevent confusion later.", ja: "今日は記録を残して。メモが後の混乱を防ぎます。" },
      { en: "If you must decide, choose the simplest option. Complexity increases risk.", ja: "決める必要があるなら最もシンプルな案を。複雑さはリスクを増やします。" },
      { en: "Protect your attention. Turn off notifications and work in short bursts.", ja: "注意力を守って。通知を切り、短い集中で進めましょう。" },
    ],
  },

  money: {
    a: [
      { en: "A smart choice saves money today. Review subscriptions and keep only what you use.", ja: "今日は賢い選択で節約できます。サブスクを見直し、使うものだけ残しましょう。" },
      { en: "You can negotiate or ask for a better deal. If you check conditions, you may win.", ja: "条件を確認すれば、交渉や割引が通りやすい日です。" },
      { en: "Your judgment is practical. Buy for value, not impulse, and you will feel satisfied.", ja: "判断が現実的です。衝動ではなく価値で買うと、納得できます。" },
      { en: "A small investment in quality pays off. Choose durable options.", ja: "品質への小さな投資が報われます。長く使えるものを選びましょう。" },
      { en: "Today supports budgeting. Set a clear limit and you will keep control easily.", ja: "今日は予算管理がうまくいきます。上限を決めると、簡単にコントロールできます。" },
      { en: "You can find a simple saving strategy. Automate one part and reduce friction.", ja: "シンプルな節約策が見つかります。1つ自動化して摩擦を減らしましょう。" },
      { en: "Unexpected support may arrive. Accept it with gratitude and keep records.", ja: "思わぬ援助が入りそうです。感謝して受け取り、記録も残しましょう。" },
      { en: "A clear plan prevents waste. Make a list before you purchase.", ja: "明確な計画が無駄を防ぎます。購入前にリストを作りましょう。" },
      { en: "Today is good for reviewing contracts. One check can prevent a future loss.", ja: "契約の見直しに良い日です。1回の確認が将来の損を防ぎます。" },
      { en: "You can increase efficiency: buy less, but buy better.", ja: "効率を上げられます。少なく買って、より良いものを選びましょう。" },
      { en: "If you sell something, timing is favorable. Present it clearly and respond quickly.", ja: "売るならタイミングが良いです。分かりやすく提示し、素早く対応しましょう。" },
      { en: "A calm decision improves your financial outcome. Avoid rush and choose wisely.", ja: "落ち着いた判断が金運を上げます。焦らず賢く選びましょう。" },
    ],
    b: [
      { en: "Keep spending moderate. A small adjustment is enough to stay on track.", ja: "支出は控えめに。小さな調整で軌道に乗ります。" },
      { en: "Avoid impulsive purchases. Wait 10 minutes and confirm if you still need it.", ja: "衝動買いは避けましょう。10分待って、本当に必要か確認を。" },
      { en: "Review your budget once. You will notice one easy place to reduce costs.", ja: "予算を一度見直すと、簡単に削れる箇所が1つ見つかります。" },
      { en: "Today is good for maintenance, not expansion. Keep things stable.", ja: "今日は拡大より維持の日です。安定を選びましょう。" },
      { en: "If you lend money, set conditions clearly. Clarity prevents stress.", ja: "お金を貸すなら条件を明確に。明確さがストレスを防ぎます。" },
      { en: "Choose value over appearance. Function will save you money long-term.", ja: "見た目より価値を。機能性は長期的に節約になります。" },
      { en: "A routine check helps. Track expenses for one day and adjust.", ja: "日次チェックが効きます。1日だけ支出を記録して調整しましょう。" },
      { en: "Avoid pessimism. Small, steady saving is effective.", ja: "悲観しすぎないで。小さな節約の継続が効きます。" },
      { en: "If you feel uncertain, delay. A postponed purchase is often the best purchase.", ja: "迷うなら延期を。買わないことが最良の買い物になることもあります。" },
      { en: "Keep a buffer. Even a small emergency fund reduces anxiety.", ja: "余裕を持ちましょう。小さな予備費でも不安が減ります。" },
      { en: "Check your receipts and subscriptions. One oversight is likely.", ja: "レシートやサブスクを確認。見落としが1つありそうです。" },
      { en: "Stay consistent. Avoid big swings in spending.", ja: "一貫性を保って。支出の大きな波は避けましょう。" },
    ],
    c: [
      { en: "Be cautious with money today. Avoid risky deals and keep everything documented.", ja: "今日は金銭面を慎重に。リスクのある話は避け、必ず記録を残しましょう。" },
      { en: "A hidden cost is possible. Read the fine print and confirm the total.", ja: "隠れコストがありそうです。細則を読み、総額を確認してください。" },
      { en: "Do not lend or borrow casually. Clear boundaries protect relationships.", ja: "気軽な貸し借りはしないで。境界線が関係を守ります。" },
      { en: "If you shop when tired, you may regret it. Postpone until you feel calm.", ja: "疲れて買うと後悔しがちです。落ち着いてからにしましょう。" },
      { en: "Avoid subscription traps. Cancel what you do not actively use.", ja: "サブスク沼に注意。積極的に使っていないものは解約を。" },
      { en: "Keep your budget strict today. Treat it like a contract with yourself.", ja: "今日は予算を厳守。自分との契約だと思って守りましょう。" },
      { en: "If someone pressures you, say no. A rushed decision can create loss.", ja: "急かされても断ってください。焦った判断は損につながります。" },
      { en: "Avoid expensive experiments. Choose reliable options you already trust.", ja: "高価な実験は避けて。既に信頼できる選択肢を。" },
      { en: "Recheck payments. A small mistake can happen easily today.", ja: "支払いを再確認。今日は小さなミスが起きやすいです。" },
      { en: "Keep purchases minimal. Maintenance is enough for now.", ja: "買い物は最小限に。今は維持で十分です。" },
      { en: "Do not mix emotion and money. Decide with numbers and facts.", ja: "感情とお金を混ぜないで。数字と事実で判断しましょう。" },
      { en: "If you must sign, read twice. Accuracy prevents regret.", ja: "署名が必要なら2回読む。正確さが後悔を防ぎます。" },
    ],
  },

  health: {
    a: [
      { en: "Your recovery is strong today. A short walk or light exercise will boost energy.", ja: "今日は回復力が高いです。短い散歩や軽い運動でエネルギーが上がります。" },
      { en: "Your body responds well to routine. Sleep a bit earlier and you will feel refreshed.", ja: "身体がルーティンに反応しやすい日です。少し早く寝るとスッキリします。" },
      { en: "Hydration helps more than usual. Drink water and your focus will improve.", ja: "今日は水分が特に効きます。水を飲むと集中も上がります。" },
      { en: "Posture and breathing matter. Fix them for two minutes and you will reset quickly.", ja: "姿勢と呼吸が重要です。2分整えるだけで素早くリセットできます。" },
      { en: "A clean meal supports you. Choose simple food and your mood becomes stable.", ja: "シンプルな食事が支えになります。簡単なものを選ぶと気分も安定します。" },
      { en: "Today supports training habits. Keep it light but consistent.", ja: "今日は運動習慣に追い風。軽くても継続を。" },
      { en: "You can improve efficiency by resting properly. One good break will raise your output.", ja: "休み方が効率を上げます。良い休憩が成果を押し上げます。" },
      { en: "Stress drops if you simplify. Reduce one obligation and feel the difference.", ja: "シンプルにするとストレスが下がります。義務を一つ減らして違いを感じてください。" },
      { en: "Your energy is balanced. Maintain a steady pace and avoid extremes.", ja: "エネルギーが整っています。極端を避け、一定のペースで。" },
      { en: "A small improvement is easy today. Adjust one habit and keep it.", ja: "小さな改善がしやすい日です。習慣を一つ調整して継続を。" },
      { en: "If you move your body early, the day becomes smoother.", ja: "早い時間に体を動かすと、一日がスムーズになります。" },
      { en: "Your mindset is calm. That alone supports your health.", ja: "心が落ち着いています。それ自体が健康を支えます。" },
    ],
    b: [
      { en: "Keep your routine stable. Small changes are fine, but avoid overdoing it.", ja: "ルーティンを安定させましょう。小さな変更はOKですが、やりすぎは避けて。" },
      { en: "If you feel tired, take a short break. Consistency matters more than intensity.", ja: "疲れたら短い休憩を。強度より継続が大事です。" },
      { en: "Sleep quality is the key. Reduce screen time before bed.", ja: "鍵は睡眠の質です。就寝前の画面時間を減らしましょう。" },
      { en: "A light stretch will help. Two minutes is enough.", ja: "軽いストレッチが効きます。2分で十分です。" },
      { en: "Avoid skipping meals. A simple meal keeps energy stable.", ja: "食事抜きは避けて。簡単な食事でエネルギーが安定します。" },
      { en: "Hydration and posture: check both once.", ja: "水分と姿勢、両方を一度チェック。" },
      { en: "Do not chase perfection. A reasonable routine is sustainable.", ja: "完璧を追わないで。無理のない習慣が続きます。" },
      { en: "If you feel tense, breathe slowly. A calm rhythm reduces stress.", ja: "緊張したらゆっくり呼吸。落ち着いたリズムがストレスを下げます。" },
      { en: "Today is good for maintenance. Clean up your environment and your mind will relax.", ja: "今日は整備向きです。環境を整えると心も緩みます。" },
      { en: "Keep a steady pace. Extreme effort will not pay off today.", ja: "一定のペースで。極端な頑張りは報われにくい日です。" },
      { en: "If you need motivation, start small. One minute counts.", ja: "やる気が要るなら小さく始めましょう。1分でも価値があります。" },
      { en: "Notice your body signals. Adjust before it becomes a problem.", ja: "身体のサインに気づいて。問題になる前に調整しましょう。" },
    ],
    c: [
      { en: "Your body may be sensitive today. Lower intensity and prioritize recovery.", ja: "今日は体が敏感になりやすいです。強度を下げ、回復を優先しましょう。" },
      { en: "Do not ignore fatigue. Sleep and hydration are more important than productivity.", ja: "疲れを無視しないで。生産性より睡眠と水分が重要です。" },
      { en: "Avoid caffeine overload. Keep stimulants moderate.", ja: "カフェインの摂りすぎに注意。刺激は控えめに。" },
      { en: "If stress increases, reduce obligations. Protect your schedule.", ja: "ストレスが増えるなら義務を減らして。予定を守りましょう。" },
      { en: "A small discomfort can grow. Address it early and keep things simple.", ja: "小さな不調が大きくなりやすいです。早めに対処し、シンプルに過ごして。" },
      { en: "Avoid intense training. A gentle walk is enough.", ja: "強い運動は避けて。やさしい散歩で十分です。" },
      { en: "Your focus may drop. Take breaks and avoid long sessions.", ja: "集中が落ちやすいです。休憩を挟み、長時間の作業は避けましょう。" },
      { en: "If you feel irritated, rest your eyes and breathe. Reset before you respond.", ja: "イライラしたら目を休めて呼吸を。反応する前にリセットを。" },
      { en: "Today is for maintenance. Clean,整理, and prepare for tomorrow.", ja: "今日は整備日。掃除・整理をして明日に備えましょう。" },
      { en: "Avoid extremes in food and sleep. Stability is the best medicine today.", ja: "食事も睡眠も極端は避けて。今日は安定が最良の薬です。" },
      { en: "Keep your body warm and protect recovery.", ja: "体を冷やさず、回復を守りましょう。" },
      { en: "If you feel heavy, simplify your day. Minimum effort, maximum care.", ja: "重さを感じたら一日をシンプルに。最小の負荷で、最大のケアを。" },
    ],
  },
};

// --- Junior high school bank (simpler) ---
const BANK_JHS = {
  "overall": {
    "a": [
      {
        "en": "Today is a good day to start. Do one small thing first.",
        "ja": "今日は始めるのに良い日。まず小さな一歩から。"
      },
      {
        "en": "Your plan works well. Keep it simple and move on.",
        "ja": "計画はうまくいきます。シンプルに進めてOK。"
      },
      {
        "en": "If you focus on one goal, you can finish faster.",
        "ja": "目標を一つに絞ると早く終わります。"
      },
      {
        "en": "A kind message helps. Say it in short words.",
        "ja": "短い一言が助けになります。やさしく伝えて。"
      },
      {
        "en": "Good timing is on your side. Try now.",
        "ja": "タイミングが良い日。今やってみて。"
      },
      {
        "en": "You can do more than you think. Start with the easiest task.",
        "ja": "思ったより進められます。簡単なものから。"
      },
      {
        "en": "Small wins build confidence. Check one item off your list.",
        "ja": "小さな達成で自信が出ます。ひとつ片付けよう。"
      },
      {
        "en": "Your focus is strong today. Turn off distractions for a while.",
        "ja": "集中しやすい日。少しだけ邪魔を切って。"
      },
      {
        "en": "Ask for help if needed. People will respond kindly.",
        "ja": "必要なら助けを求めて。優しく返ってきます。"
      },
      {
        "en": "Keep your pace. Steady work brings good results.",
        "ja": "今のペースでOK。コツコツが成果に。"
      }
    ],
    "b": [
      {
        "en": "Go step by step. No need to rush.",
        "ja": "一歩ずつで大丈夫。急がなくてOK。"
      },
      {
        "en": "Do the basics first. That will clear your mind.",
        "ja": "基本を先にやると頭がスッキリします。"
      },
      {
        "en": "If you feel busy, write a short list.",
        "ja": "忙しいなら短いリストを書いて。"
      },
      {
        "en": "Check details once. Then keep moving.",
        "ja": "細部を一度確認したら、そのまま進めて。"
      },
      {
        "en": "Keep your promises small and realistic today.",
        "ja": "約束は無理のない範囲で。"
      },
      {
        "en": "Take a short break. It will help your focus.",
        "ja": "短い休憩で集中が戻ります。"
      },
      {
        "en": "Talk less, do more. Simple action works.",
        "ja": "言いすぎず、行動を。シンプルが効きます。"
      },
      {
        "en": "If you are unsure, ask one clear question.",
        "ja": "迷ったら、はっきり一つ聞いてみて。"
      },
      {
        "en": "Keep things tidy. A clean space helps.",
        "ja": "少し整えると楽になります。"
      },
      {
        "en": "Finish one thing before starting another.",
        "ja": "次へ行く前に、ひとつ終わらせよう。"
      }
    ],
    "c": [
      {
        "en": "Keep your day light. Do only what is needed.",
        "ja": "今日は軽めに。必要なことだけでOK。"
      },
      {
        "en": "If you feel tired, slow down and breathe.",
        "ja": "疲れたらペースを落として深呼吸。"
      },
      {
        "en": "Avoid big decisions today. Wait a little.",
        "ja": "大きな決断は避けて。少し待つと良いです。"
      },
      {
        "en": "Do not overbook. Leave extra time.",
        "ja": "予定を詰めすぎないで。余裕を作って。"
      },
      {
        "en": "Double-check simple mistakes.",
        "ja": "うっかりミスに注意。確認を。"
      },
      {
        "en": "If you feel upset, pause before you reply.",
        "ja": "イラっとしたら返事の前に一呼吸。"
      },
      {
        "en": "Choose the safe option.",
        "ja": "安全側の選択が吉。"
      },
      {
        "en": "Rest is important today.",
        "ja": "今日は休むことが大事。"
      },
      {
        "en": "Keep choices few. Less is better.",
        "ja": "選択肢は少なく。少ないほど楽。"
      },
      {
        "en": "End the day early if you can. Recovery first.",
        "ja": "可能なら早めに切り上げて。回復が先。"
      }
    ]
  },
  "love": {
    "a": [
      {
        "en": "A small hello brings a warm mood.",
        "ja": "小さな挨拶で空気が温かくなります。"
      },
      {
        "en": "Be honest and simple. It will be understood.",
        "ja": "正直に、シンプルに。伝わります。"
      },
      {
        "en": "Send a short message. Timing is good.",
        "ja": "短い連絡が吉。タイミングが良い日です。"
      },
      {
        "en": "Listen first. That shows care.",
        "ja": "まず聞くこと。それが思いやりになります。"
      },
      {
        "en": "A kind word can fix the mood fast.",
        "ja": "やさしい一言で雰囲気がすぐ戻ります。"
      },
      {
        "en": "Smile and relax. Your charm shows naturally.",
        "ja": "笑ってリラックス。自然に魅力が出ます。"
      },
      {
        "en": "Make a small plan together. Simple is best.",
        "ja": "小さな予定を立てて。シンプルが一番。"
      },
      {
        "en": "Say thanks. It will deepen trust.",
        "ja": "ありがとうを言うと信頼が深まります。"
      },
      {
        "en": "Ask, don’t guess. It avoids confusion.",
        "ja": "想像より質問。誤解を避けられます。"
      },
      {
        "en": "Warm feelings grow with small actions.",
        "ja": "小さな行動で温かさが育ちます。"
      }
    ],
    "b": [
      {
        "en": "Keep your tone gentle. That is enough.",
        "ja": "口調をやさしく。それだけで十分。"
      },
      {
        "en": "Give a little space if needed.",
        "ja": "必要なら少し距離を。"
      },
      {
        "en": "Do not overthink silence.",
        "ja": "沈黙を考えすぎないで。"
      },
      {
        "en": "Choose simple words over long talks.",
        "ja": "長話より短い言葉が効きます。"
      },
      {
        "en": "If you feel unsure, wait before you decide.",
        "ja": "迷うなら決めるのは少し後で。"
      },
      {
        "en": "Avoid comparing. Focus on your own bond.",
        "ja": "比べないで。自分の関係を大切に。"
      },
      {
        "en": "A small apology helps when needed.",
        "ja": "必要なら小さく謝ると良いです。"
      },
      {
        "en": "Reply calmly, even if you feel stressed.",
        "ja": "焦っても落ち着いて返事を。"
      },
      {
        "en": "Warmth beats speed.",
        "ja": "速さより温かさ。"
      },
      {
        "en": "Keep expectations light today.",
        "ja": "期待を軽くすると楽です。"
      }
    ],
    "c": [
      {
        "en": "Avoid hard topics today. Keep it light.",
        "ja": "重い話題は避けて。軽くいきましょう。"
      },
      {
        "en": "Do not test people. Ask directly.",
        "ja": "試さないで。直接聞いて。"
      },
      {
        "en": "If you feel hurt, take distance first.",
        "ja": "傷ついたらまず距離を。"
      },
      {
        "en": "Wait for facts, not guesses.",
        "ja": "想像より事実を待って。"
      },
      {
        "en": "A gentle “no” is okay.",
        "ja": "やさしい「いいえ」で大丈夫。"
      },
      {
        "en": "Choose calm places. Noise can make it worse.",
        "ja": "落ち着く場所を。騒がしいと悪化しやすいです。"
      },
      {
        "en": "Do not rush to close the issue.",
        "ja": "結論を急がないで。"
      },
      {
        "en": "Take care of yourself first.",
        "ja": "まず自分を整えて。"
      },
      {
        "en": "Let the mood settle. Time helps.",
        "ja": "気分が落ち着くのを待って。時間が助けます。"
      },
      {
        "en": "Keep messages short if emotions are strong.",
        "ja": "感情が強いなら短い連絡に。"
      }
    ]
  },
  "work": {
    "a": [
      {
        "en": "You can finish tasks well today. Start with one priority.",
        "ja": "今日は作業が進みます。優先を一つ決めて。"
      },
      {
        "en": "A short talk can solve a problem. Ask clearly.",
        "ja": "短い相談で解決しそう。はっきり聞いて。"
      },
      {
        "en": "Your work feels smooth if you follow your plan.",
        "ja": "計画どおりに進めるとスムーズです。"
      },
      {
        "en": "Small steps bring big progress.",
        "ja": "小さな一歩が大きな前進に。"
      },
      {
        "en": "Keep your desk tidy. It helps focus.",
        "ja": "机を少し整えると集中できます。"
      },
      {
        "en": "Do the hardest part first. Then it gets easy.",
        "ja": "一番大変な所を先に。あとは楽になります。"
      },
      {
        "en": "Write “done” rules. It helps you finish.",
        "ja": "終わりのルールを書くと終わらせやすいです。"
      },
      {
        "en": "Reply on time. Trust grows.",
        "ja": "返信を早めに。信頼が増えます。"
      },
      {
        "en": "Use simple notes. It prevents mistakes.",
        "ja": "簡単なメモでミスを防げます。"
      },
      {
        "en": "You can do quality work without extra effort.",
        "ja": "無理せず質を上げられます。"
      }
    ],
    "b": [
      {
        "en": "Steady work is best today. Do not change plans too much.",
        "ja": "今日は手堅く。やり方を変えすぎないで。"
      },
      {
        "en": "Split the task into small parts.",
        "ja": "作業を小さく分けると楽です。"
      },
      {
        "en": "Set a short timer and focus on one thing.",
        "ja": "短いタイマーで一つに集中。"
      },
      {
        "en": "Check your work once before you send it.",
        "ja": "送る前に一度確認。"
      },
      {
        "en": "Take breaks on purpose.",
        "ja": "休憩は意図的に。"
      },
      {
        "en": "Use bullet points. Keep messages clear.",
        "ja": "箇条書きで明快に。"
      },
      {
        "en": "If pressure rises, return to simple tasks.",
        "ja": "プレッシャーなら簡単な作業へ。"
      },
      {
        "en": "Finish one thing first.",
        "ja": "まず一つ終わらせる。"
      },
      {
        "en": "Ask for clarification if needed.",
        "ja": "必要なら確認を取って。"
      },
      {
        "en": "Keep the schedule realistic.",
        "ja": "予定は現実的に。"
      }
    ],
    "c": [
      {
        "en": "Do not pack your schedule. Keep it light.",
        "ja": "予定を詰めないで。軽めが吉。"
      },
      {
        "en": "Work in short sessions.",
        "ja": "短い区切りで作業を。"
      },
      {
        "en": "Avoid big decisions today.",
        "ja": "大きな決断は避けて。"
      },
      {
        "en": "Fix one thing at a time.",
        "ja": "修正は一つずつ。"
      },
      {
        "en": "If you feel tired, do maintenance tasks.",
        "ja": "疲れたら保守タスクでOK。"
      },
      {
        "en": "Rushing makes more work later.",
        "ja": "急ぐと後で増えます。"
      },
      {
        "en": "Keep replies short if you are stressed.",
        "ja": "ストレスがあるなら返事は短く。"
      },
      {
        "en": "Stop early if you can. Recovery matters.",
        "ja": "可能なら早めに切り上げて。"
      },
      {
        "en": "Protect your focus from noise.",
        "ja": "雑音から集中を守って。"
      },
      {
        "en": "Simplify the plan. Less is better.",
        "ja": "計画を簡単に。少ないほど良い。"
      }
    ]
  },
  "money": {
    "a": [
      {
        "en": "Good day to save a little. Small savings feel good.",
        "ja": "少し貯めるのに良い日。小さな節約が効きます。"
      },
      {
        "en": "Buy what you need, not what you feel.",
        "ja": "気分より必要で選ぶと吉。"
      },
      {
        "en": "Check one regular cost. You may find a win.",
        "ja": "定期支出を一つ見直すと良さそう。"
      },
      {
        "en": "Compare calmly and choose the best value.",
        "ja": "落ち着いて比較すると良い選択に。"
      },
      {
        "en": "A simple budget plan works.",
        "ja": "シンプルな予算でOK。"
      },
      {
        "en": "Keep your limit first. Then choose.",
        "ja": "上限を先に決めてから選びましょう。"
      },
      {
        "en": "Organize receipts. You will see patterns.",
        "ja": "レシート整理で傾向が見えます。"
      },
      {
        "en": "Small comfort spending is fine if planned.",
        "ja": "計画的なら小さなご褒美はOK。"
      },
      {
        "en": "Avoid impulse. Take one minute before paying.",
        "ja": "衝動に注意。払う前に1分待って。"
      },
      {
        "en": "Practical choices bring relief.",
        "ja": "実用で選ぶと安心します。"
      }
    ],
    "b": [
      {
        "en": "Pause before you buy. Waiting helps.",
        "ja": "買う前に一度止まって。待つと良いです。"
      },
      {
        "en": "Keep spending moderate today.",
        "ja": "今日はほどほどの出費に。"
      },
      {
        "en": "Do not shop when tired.",
        "ja": "疲れている時の買い物は避けて。"
      },
      {
        "en": "Small maintenance costs are okay.",
        "ja": "小さなメンテ費はOK。"
      },
      {
        "en": "Choose essentials first.",
        "ja": "まず必需品を。"
      },
      {
        "en": "If unsure, ask someone you trust.",
        "ja": "迷ったら信頼できる人に相談。"
      },
      {
        "en": "Avoid too many options.",
        "ja": "選択肢を増やしすぎないで。"
      },
      {
        "en": "Plan one small saving action.",
        "ja": "小さな節約を一つ。"
      },
      {
        "en": "Re-check deals that feel too urgent.",
        "ja": "急かすセールは再確認。"
      },
      {
        "en": "Balance is better than extremes.",
        "ja": "極端よりバランスが吉。"
      }
    ],
    "c": [
      {
        "en": "Avoid big purchases today.",
        "ja": "今日は大きな買い物は避けて。"
      },
      {
        "en": "Do not fix stress with shopping.",
        "ja": "ストレスを買い物で埋めないで。"
      },
      {
        "en": "Check numbers twice.",
        "ja": "数字は二度確認。"
      },
      {
        "en": "Keep choices few and safe.",
        "ja": "選択は少なく安全に。"
      },
      {
        "en": "Avoid lending or borrowing.",
        "ja": "貸し借りは控えめに。"
      },
      {
        "en": "Eat and rest before deciding.",
        "ja": "決める前に食事と休息を。"
      },
      {
        "en": "If you feel pressure, step back.",
        "ja": "急かされたら一歩引いて。"
      },
      {
        "en": "Postpone decisions if possible.",
        "ja": "可能なら判断を先送り。"
      },
      {
        "en": "Protect your money cushion.",
        "ja": "余裕資金を守って。"
      },
      {
        "en": "Recovery first; money decisions get better after rest.",
        "ja": "まず回復。休むと判断も良くなります。"
      }
    ]
  },
  "health": {
    "a": [
      {
        "en": "A short walk refreshes you.",
        "ja": "短い散歩でリフレッシュ。"
      },
      {
        "en": "Drink water often. It helps your body.",
        "ja": "こまめに水分を。体が楽です。"
      },
      {
        "en": "Stretch your neck and shoulders.",
        "ja": "首と肩を伸ばして。"
      },
      {
        "en": "Warmth helps today. Try a hot drink.",
        "ja": "温めが効く日。温かい飲み物が◎。"
      },
      {
        "en": "Simple meals feel best.",
        "ja": "シンプルな食事が合います。"
      },
      {
        "en": "Sleep will be better with a calm night.",
        "ja": "落ち着いた夜で睡眠が良くなります。"
      },
      {
        "en": "Open a window and change the air.",
        "ja": "換気で気分が変わります。"
      },
      {
        "en": "Keep good posture. Small fixes help.",
        "ja": "姿勢を整えると楽になります。"
      },
      {
        "en": "Breathe slowly for one minute.",
        "ja": "1分ゆっくり呼吸して。"
      },
      {
        "en": "Light movement keeps you steady.",
        "ja": "軽い運動で安定します。"
      }
    ],
    "b": [
      {
        "en": "Do not push too hard today.",
        "ja": "無理しすぎないで。"
      },
      {
        "en": "Take short breaks often.",
        "ja": "短い休憩をこまめに。"
      },
      {
        "en": "Watch temperature changes.",
        "ja": "寒暖差に注意。"
      },
      {
        "en": "Avoid late caffeine.",
        "ja": "遅い時間のカフェインは控えめに。"
      },
      {
        "en": "Gentle food is better than heavy meals.",
        "ja": "重い食事よりやさしい食事が吉。"
      },
      {
        "en": "Reduce screen time if you feel restless.",
        "ja": "そわそわするなら画面から少し離れて。"
      },
      {
        "en": "A regular bedtime helps.",
        "ja": "寝る時間をそろえると良いです。"
      },
      {
        "en": "Slow walking helps calm your mind.",
        "ja": "ゆっくり歩くと心も落ち着きます。"
      },
      {
        "en": "Stretch a little before sleep.",
        "ja": "寝る前に少しストレッチ。"
      },
      {
        "en": "Keep water nearby.",
        "ja": "水分を近くに置いて。"
      }
    ],
    "c": [
      {
        "en": "Rest is the best choice today.",
        "ja": "今日は休むのが一番。"
      },
      {
        "en": "Keep your schedule light.",
        "ja": "予定は軽めに。"
      },
      {
        "en": "Avoid intense exercise. Stretch gently.",
        "ja": "激しい運動は避けて。軽く伸ばして。"
      },
      {
        "en": "If you feel bad, reduce noise and light.",
        "ja": "つらいなら音と光を落として。"
      },
      {
        "en": "Do not skip meals.",
        "ja": "食事抜きは避けて。"
      },
      {
        "en": "Warm tea and slow breathing help.",
        "ja": "温かいお茶とゆっくり呼吸が助けます。"
      },
      {
        "en": "Protect your neck and feet from cold.",
        "ja": "首と足元の冷えに注意。"
      },
      {
        "en": "Go to bed earlier if possible.",
        "ja": "可能なら早寝を。"
      },
      {
        "en": "Be kind to yourself.",
        "ja": "自分にやさしく。"
      },
      {
        "en": "Recovery first; tomorrow will be easier.",
        "ja": "回復が先。明日が楽になります。"
      }
    ]
  }
};

// Public bank
const BANK_ENJA = {
  jhs: BANK_JHS,
  adult: BANK_ADULT,
};
// For now, use the same bank for hs as adult (v1). You can later tune HS separately.
BANK_ENJA.hs = BANK_ENJA.adult;
