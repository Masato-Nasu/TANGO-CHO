# TANGO-CHO（単語帳 × DeepL × 類義語 × 4択クイズ PWA）

英語を読んでいて分からない単語が出たら、**（選択 or コピペ）→ 翻訳 → 保存**。  
集めた単語を **「覚えてない / デフォルト / 覚えた」** の3カテゴリで管理し、あとから **4択クイズ**で復習できるPWAです。

さらに、**類義語（同義語）**も取得して一緒に覚えられます（必要なら **類義語カードを自動追加**）。

制作：Masato Nasu

---

## 🔗 Links

- **GitHub Pages（PWA）**  
  https://masato-nasu.github.io/TANGO-CHO/
- **Hugging Face Spaces（API / DeepL中継）**  
  https://huggingface.co/spaces/mazzGOGO/TANGO-CHO
- **API Base（例）**  
  https://mazzgogo-tango-cho.hf.space

---

## 📸 Screenshots

> `screenshot1.png`〜`screenshot4.png` をリポジトリ直下に置いてください。

| | |
|---|---|
| ![Screenshot 1](./screenshot1.png) | ![Screenshot 2](./screenshot2.png) |
| ![Screenshot 3](./screenshot3.png) | ![Screenshot 4](./screenshot4.png) |

---

## ✨ Features

### 1) 追加（翻訳 + 手入力 + 類義語）
- 英単語を入力
- 翻訳（HF Spaces → DeepL）で日本語訳を自動取得
- 日本語訳は編集可能（手入力でもOK）
- 類義語 / 同義語を取得（ボタン）
- 類義語を入力すると、保存時に **類義語カードを自動で別カード追加**（重複は自動スキップ）
- メモ・タグも保存可能

### 2) 単語帳（検索は1つに統合）
- 登録単語の一覧表示
- カテゴリをワンタップで変更（覚えてない / デフォルト / 覚えた）
- **並び替え**：時系列 / A→Z（アルファベット順）
- 統合検索（英語 / 日本語訳 / メモ / タグ / 類義語 をまとめて検索）
- タグ検索（統合検索で指定）
  - `#travel` のように `#タグ` で絞り込み
  - `#travel #school` のように複数指定で **AND 絞り込み**
- 編集：単語帳のカードを後から修正して「更新」

### 3) クイズ（4択）—「一巡するまで同じ単語が出ない」
- 英→日 / 日→英 を切り替え
- 出題カテゴリ（全て / 覚えてない / デフォルト / 覚えた）
- クイズ中にカテゴリ変更（覚えてないへ / 覚えたへ）を即反映
- 正解/不正解は効果音でフィードバック（正解：ピンポン / 不正解：ブブー）
- **重要：一度出題された単語は、同じ出題プール（カテゴリ）を“全部出し切る”まで再出題されません**  
  → 200語あっても「出ない単語が残る」問題を防ぎます
- さらに **覚えてない > デフォルト > 覚えた** の順で“早めに出やすい”重み付け（ただし一巡内で重複はしません）

> ※ 4択の選択肢を作るため、出題カテゴリ内に **最低4単語**が必要です。  
> 足りない場合は「出題カテゴリ＝全て」にすると始めやすいです。

### 4) 🔊 発音（Web Speech API）
- 英語発音は **英語ボイスを優先**して読み上げます（iPhone/iOS対策を含む）

### 5) 🌐 Webで見つけた英単語を「そのまま追加」する（外部ブラウザ連携）
Web上で英単語を見つけたら、**選択 → 共有 → TANGO-CHO** で、アプリの「追加」画面に直接持っていけます。  
（※ iPhone / Android で導線が異なります）

---

## 📲 PWAとしてインストール

### iPhone（iOS）
1. Safariで https://masato-nasu.github.io/TANGO-CHO/ を開く
2. 共有 → ホーム画面に追加

> Chromeやアプリ内ブラウザだと「PWAとして追加」にならず、  
> “ブックマークっぽい動作”になりやすいです。

### Android / PC（Chrome/Edge）
- URLを開く → メニューに「アプリをインストール」が出たらOK

---

## 🔁 外部ブラウザから単語を送る（iPhone / Android）

### ✅ Android（推奨：Share Target / 共有で送る）
前提：TANGO-CHO を **PWAとしてインストール済み**であること。

1. Chromeで英単語を **長押し選択**
2. 選択メニューの **「共有」**
3. 共有先から **「TANGO-CHO」** を選ぶ
4. アプリが起動し、**「追加」タブの英単語欄に自動入力**されます

#### Androidで「共有先にTANGO-CHOが出ない」時
- `manifest.json` を更新した後は、OS側の共有先登録が更新されない場合があります。  
  **いったんPWAをアンインストール → 再インストール**してください（これが最も確実です）。
- それでも出ない場合は、Chromeのサイトデータ削除後に再インストールを試してください。

---

### ✅ iPhone（現実的な方法：ショートカット or ブックマークレット）
iOSは、Androidのような “PWAへのShare Target” が安定しません。  
そのため **「URLに単語を付けて起動する」方式**を使います。

#### 方法A：iOSショートカット（おすすめ）
1. 「ショートカット」アプリで新規作成
2. **共有シートで受け取る**（テキスト）をON
3. アクション：
   - 「URLをエンコード」
   - 「URLを開く」  
     `https://masato-nasu.github.io/TANGO-CHO/index.html?word=（エンコード済みテキスト）`
4. Safariで単語を選択 → 共有 → そのショートカットを実行  
→ アプリが開き、追加フォームに入ります

#### 方法B：ブックマークレット（Safariのブックマークに登録）
- Safariで任意ページを開き、ブックマークに以下を登録して使います  
- 使い方：英単語を選択 → ブックマークレット実行 → TANGO-CHO起動＆入力

（ブックマークレット例）
`javascript:(()=>{const s=(window.getSelection&&String(window.getSelection()))||'';const t=encodeURIComponent(s.trim());if(!t)return;location.href='https://masato-nasu.github.io/TANGO-CHO/index.html?word='+t;})();`

---

### 直リンク（iPhone/Android共通の保険）
共有が使えない場合でも、以下のように **URLパラメータで単語を渡せます**。

- `index.html?word=subscription`
- `index.html?text=subscription`

例：
https://masato-nasu.github.io/TANGO-CHO/index.html?word=subscription

---

## 📁 データについて

- 単語帳は **端末内（localStorage）** に保存されます
- 端末を変えるとデータは引き継げません（同期なし）
- ただし **JSON Export / Import** でバックアップ＆復元が可能です

---

## ⚙️ 接続設定（HF Spaces）

「翻訳（DeepL）」と「類義語取得」は、HF Spaces 側のAPIを使用します。

- HF Spaces API Base（例）  
  `https://mazzgogo-tango-cho.hf.space`
- APP_TOKEN は Spaces 側で設定している場合のみ入力（未設定なら空でOK）
- DeepLキーは **SpacesのSecrets（DEEPL_KEY）** に入れます  
  → PWA側には不要です

---

## キーについて

- このアプリには入力が必要なキーがあります。必要な方はご連絡ください。

---

## 🙏 Thanks

- DeepL API
- Hugging Face Spaces
- GitHub Pages / PWA
