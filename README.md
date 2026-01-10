TANGO-CHO（単語帳 × DeepL × 類義語 × 4択クイズ PWA）

英語を読んでいて分からない単語が出たら、コピペ → 翻訳 → 保存。
集めた単語を 「覚えてない / デフォルト / 覚えた」 の3カテゴリで管理し、あとから 4択クイズで復習できるPWAです。

さらに、類義語（同義語） も取得して一緒に覚えられます（必要なら類義語カードを自動追加）。

制作：Masato Nasu

🔗 Links

GitHub Pages（PWA）
https://masato-nasu.github.io/TANGO-CHO/

Hugging Face Spaces（API / DeepL中継）
https://huggingface.co/spaces/mazzGOGO/TANGO-CHO

API Base（例）：https://mazzgogo-tango-cho.hf.space

📸 Screenshots
	
| | |
|---|---|
| ![Screenshot 1](./screenshot1.png) | ![Screenshot 2](./screenshot2.png) |
| ![Screenshot 3](./screenshot3.png) | |
	
✨ Features
追加（翻訳＋手入力＋類義語）

英単語を入力

翻訳（HF Spaces → DeepL） で日本語訳を自動取得

日本語訳は 編集可能（手入力でもOK）

類義語 / 同義語 を取得（ボタン）

類義語を入力すると、保存時に 類義語カードを自動で別カード追加（重複は自動スキップ）

メモ・タグも保存可能

🔊 発音（Web Speech API）

単語帳（検索は1つに統合）

登録単語の一覧表示

カテゴリをワンタップで変更（覚えてない / デフォルト / 覚えた）

統合検索（英語 / 日本語訳 / メモ / タグ / 類義語 をまとめて検索）

タグ検索（統合検索で指定）

#travel のように #タグ で絞り込み

#travel #school のように複数指定で AND 絞り込み

編集：単語帳のカードを後から修正して「更新」

Import / Export（JSON）：バックアップ＆復元

クイズ（4択）

英→日 / 日→英 を切り替え

出題カテゴリ（全て / 覚えてない / デフォルト / 覚えた）

クイズ中にカテゴリ変更（覚えてないへ / 覚えたへ）を即反映

※ 4択の選択肢を作るため、出題カテゴリ内に 最低4単語が必要です。
足りない場合は「出題カテゴリ＝全て」にすると始めやすいです。

⚙️ 接続（HF Spaces / DeepL）

アプリ内の「⚙️ 接続設定」で以下を設定して保存します。

HF Spaces API Base：例）https://mazzgogo-tango-cho.hf.space

APP_TOKEN：Spaces側で設定している場合のみ（例：tangocho）

起こし（Spaceが寝る対策）

アプリが開いている間、6時間ごとに /health を叩いて起こします（HF_BASEが設定されている場合のみ）。
※ iOSの仕様上、アプリを完全に閉じている間は動きません。起動時／復帰時にも必要に応じて叩きます。

📲 PWAとしてインストール
iPhone（iOS）

Safariで https://masato-nasu.github.io/TANGO-CHO/
 を開く

共有 → ホーム画面に追加

Chromeやアプリ内ブラウザだと「PWAとして追加」にならず、
“ブックマークっぽい動作”になりやすいです。

Android / PC（Chrome/Edge）

URLを開く → メニューに 「アプリをインストール」 が出たらOK

📁 データについて

単語帳は 端末内（localStorage） に保存されます

端末を変えるとデータは引き継げません（同期なし）

ただし JSON Export / Import でバックアップ＆復元が可能です

🙏 Thanks

DeepL API

Hugging Face Spaces

GitHub Pages / PWA
