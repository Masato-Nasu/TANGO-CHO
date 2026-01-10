# TANGO-CHO（単語帳 × DeepL × 4択クイズ PWA）

英語を読んでいて分からない単語が出たら、**コピペ→翻訳→保存**。  
集めた単語を **「覚えてない / デフォルト / 覚えた」** の3カテゴリで管理し、あとから **4択クイズ**で復習できるPWAです。

- 制作：sai & co（Masato Nasu）

---

## 🔗 Links

- GitHub Pages（PWA）：https://masato-nasu.github.io/TANGO-CHO/
- Hugging Face Spaces（API）：https://huggingface.co/spaces/mazzGOGO/TANGO-CHO  
  （PWAが叩くAPI Base例：`https://mazzgogo-tango-cho.hf.space`）

---

## 📸 Screenshot

![TANGO-CHO Screenshot](./screenshot1.png)

## ✨ Features

### 追加（検索＋手入力を1画面で）
- 英単語を入力
- **翻訳（HF Spaces → DeepL）** ボタンで日本語訳を自動取得
- 日本語訳は **編集可能**（＝手入力も同じ画面で完結）
- 例文・メモ・タグも保存可能
- 🔊 発音（Web Speech API）

### 単語帳
- 登録単語の一覧表示
- カテゴリをワンタップで変更（覚えてない / デフォルト / 覚えた）
- フィルタ（カテゴリ別）
- JSONエクスポート（バックアップ用）

### クイズ（4択）
- **英→日 / 日→英** を切り替え
- 出題カテゴリ（全て / 覚えてない / デフォルト / 覚えた）
- クイズ中に「覚えてないへ / 覚えたへ」を即変更

> ※ 4択の選択肢を作るため、出題カテゴリ内に **最低4単語**が必要です。  
> 足りない場合は「出題カテゴリ＝全て」にすると始めやすいです。

---

## 🧩 構成（Host / Server）

### Host（GitHub Pages / PWA）
- フロント：純HTML/CSS/JS
- データ保存：端末の `localStorage`
- PWA：manifest + service worker（オフラインキャッシュ）

### Server（Hugging Face Spaces）
- FastAPI：`/health`, `/translate`
- DeepL APIへ中継（キーはSpacesのSecretsに保持）
- APP_TOKEN（任意）で簡易保護（ヘッダで検証）

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

#### 動作確認
- Health
  - `GET https://<your-space>.hf.space/health`
  - 期待：`{"ok": true}`

- Translate（APP_TOKENあり例）
  - `POST https://<your-space>.hf.space/translate`
  - Header：`X-App-Token: tangocho`
  - Body：`{"text":"curious","target_lang":"JA"}`

---

### 2) Host：GitHub Pages（PWA）
このリポジトリをGitHub Pagesで公開します。

#### 公開設定（例）
- GitHub → Settings → Pages
- Source：Deploy from a branch
- Branch：`main` / Folder：`/(root)` もしくは運用に合わせて設定

#### PWA側の接続設定
アプリ内「⚙️ 接続設定」で以下を設定して保存します。

- **HF Spaces API Base**  
  お問い合わせください
- **APP_TOKEN**（Spacesで設定した場合のみ）  
  お問い合わせください

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
- ただし **JSONエクスポート**でバックアップ可能です

---

## 📝 License
TBD（必要ならMITなどに変更してください）

---

## 🙏 Thanks
- DeepL API
- Hugging Face Spaces
- GitHub Pages / PWA
