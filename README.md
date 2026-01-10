# TANGO-CHO（単語帳 × DeepL × 類義語 × 4択クイズ PWA）

英語を読んでいて分からない単語が出たら、**コピペ → 翻訳 → 保存**。  
集めた単語を **「覚えてない / デフォルト / 覚えた」** の3カテゴリで管理し、あとから **4択クイズ**で復習できるPWAです。

さらに、**類義語（同義語）** も取得して一緒に覚えられます（必要なら類義語カードを自動追加）。

- 制作：sai & co（Masato Nasu）

---

## 🔗 Links

- GitHub Pages（PWA）  
  https://masato-nasu.github.io/TANGO-CHO/

- Hugging Face Spaces（API / DeepL中継）  
  https://huggingface.co/spaces/mazzGOGO/TANGO-CHO  
  API Base（例）：`https://mazzgogo-tango-cho.hf.space`

---

## 📸 Screenshots

| | |
|---|---|
| ![Screenshot 1](./screenshot1.png) | ![Screenshot 2](./screenshot2.png) |
| ![Screenshot 3](./screenshot3.png) | |

---

## ✨ Features

### 追加（翻訳＋手入力＋類義語）
- 英単語を入力
- **翻訳（HF Spaces → DeepL）** で日本語訳を自動取得
- 日本語訳は **編集可能**（手入力でもOK）
- **類義語 / 同義語** を取得（自動 or ボタン）
- 類義語を入力すると、保存時に **類義語カードを自動で別カード追加**（重複は自動スキップ）
- 例文・メモ・タグも保存可能
- 🔊 発音（Web Speech API）

### 単語帳
- 登録単語の一覧表示
- カテゴリをワンタップで変更（覚えてない / デフォルト / 覚えた）
- フィルタ（カテゴリ別）
- **編集**：単語帳のカードを後から修正して「更新」
- **Import / Export（JSON）**：バックアップ＆復元

### クイズ（4択）
- **英→日 / 日→英** を切り替え
- 出題カテゴリ（全て / 覚えてない / デフォルト / 覚えた）
- クイズ中にカテゴリ変更（覚えてないへ / 覚えたへ）を即反映

> ※ 4択の選択肢を作るため、出題カテゴリ内に **最低4単語**が必要です。  
> 足りない場合は「出題カテゴリ＝全て」にすると始めやすいです。

---

## 🧩 構成（Host / Server）

### Host（GitHub Pages / PWA）
- フロント：純HTML/CSS/JS（軽量）
- データ保存：端末の `localStorage`
- PWA：manifest + service worker（オフラインキャッシュ）

### Server（Hugging Face Spaces）
- FastAPI（例）：
  - `GET /health`
  - `POST /translate`（DeepLへ中継）
  - `POST /synonyms`（類義語取得）
- DeepL APIキーは Spaces の **Secrets** に保持
- `APP_TOKEN`（任意）で簡易保護（ヘッダ `X-App-Token` を検証）

---

## 🚀 セットアップ（推奨手順）

### 1) Server：Hugging Face Spaces（DeepL翻訳API）
Spacesにサーバー側コードを置き、Secretsを設定します。

#### ✅ 必須 Secrets
- `DEEPL_KEY`：DeepL APIキー（必須）

#### 任意 Secrets
- `DEEPL_ENDPOINT`：DeepLのエンドポイント  
  - Free：`https://api-free.deepl.com/v2/translate`  
  - Pro：`https://api.deepl.com/v2/translate`
- `APP_TOKEN`：任意（例：`tangocho`）  
  設定した場合、PWAはリクエストヘッダ `X-App-Token` を送る必要があります。

#### 動作確認（例）
- Health  
  `GET https://mazzgogo-tango-cho.hf.space/health`  
  期待：`{"ok": true}`

- Translate（APP_TOKENあり例）  
  `POST https://mazzgogo-tango-cho.hf.space/translate`  
  Header：`X-App-Token: tangocho`  
  Body：`{"text":"curious","target_lang":"JA"}`

- Synonyms（APP_TOKENあり例）  
  `POST https://mazzgogo-tango-cho.hf.space/synonyms`  
  Header：`X-App-Token: tangocho`  
  Body：`{"text":"curious","max":8}`

---

### 2) Host：GitHub Pages（PWA）
このリポジトリをGitHub Pagesで公開します。

#### 公開設定（例）
- GitHub → Settings → Pages
- Source：Deploy from a branch
- Branch：`main` / Folder：`/(root)`

#### PWA側の接続設定（⚙️ 接続設定）
アプリ内「⚙️ 接続設定」で以下を設定します（自動保存されます）。

- **HF Spaces API Base**  
  `https://mazzgogo-tango-cho.hf.space`
- **APP_TOKEN**（Spacesで設定した場合のみ）  
  `tangocho`

---

## 📲 PWAとしてインストール

### iPhone（iOS）
- **Safariで** https://masato-nasu.github.io/TANGO-CHO/ を開く  
- 共有 → **ホーム画面に追加**

> Chromeやアプリ内ブラウザだと「PWAとして追加」にならず、  
> “ブックマークっぽい動作”になりやすいです。

### Android / PC（Chrome/Edge）
- URLを開く → メニューに **「アプリをインストール」** が出たらOK

---

## 📁 データについて
- 単語帳は **端末内（localStorage）** に保存されます
- 端末を変えるとデータは引き継げません（同期なし）
- ただし **JSON Export / Import** でバックアップ＆復元が可能です

---

## 📝 License
TBD（必要ならMITなどに変更してください）

---

## 🙏 Thanks
- DeepL API
- Hugging Face Spaces
- GitHub Pages / PWA
