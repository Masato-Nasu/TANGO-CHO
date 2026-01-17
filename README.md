# TANGO-CHO（単語帳 × DeepL × 類義語 × 4択クイズ PWA） v3.7.11

英語を読んでいて分からない単語が出たら、**（Webで見つける）→ アプリに持ち込む → 翻訳 → 保存**。  
集めた単語を **「覚えてない / デフォルト / 覚えた」** の3カテゴリで管理し、あとから **4択クイズ**で復習できるPWAです。

さらに、**類義語（同義語）**も取得して一緒に覚えられます（必要なら **類義語カードを自動追加**）。

制作：Masato Nasu

---

## Links

- **GitHub Pages（PWA）**  
  https://masato-nasu.github.io/TANGO-CHO/
- **Hugging Face Spaces（API / DeepL中継）**  
  https://huggingface.co/spaces/mazzGOGO/TANGO-CHO
- **API Base（例）**  
  https://mazzgogo-tango-cho.hf.space

---

## Screenshots

`./screenshot1.png`〜`./screenshot4.png` をリポジトリ直下に置いてください。

| | |
|---|---|
| ![Screenshot 1](./screenshot1.png) | ![Screenshot 2](./screenshot2.png) |
| ![Screenshot 3](./screenshot3.png) | ![Screenshot 4](./screenshot4.png) |

---

## 初期設定（接続設定）

翻訳（DeepL）と類義語取得は **Hugging Face Spaces 経由**で行います。

1. アプリの「追加」タブ内にある **接続設定（HF Spaces）** を開く  
2. **HF Spaces API Base** に Spaces のURLを入力して保存  
   - 例：`https://mazzgogo-tango-cho.hf.space`
3. Spaces側でトークン認証している場合のみ **APP_TOKEN** を入力して保存  
   - 使っていない場合は空でOK

※ DeepLキー（DEEPL_KEY）は **Spaces側のSecrets** に設定します（PWA側には不要）。

---

## Web上で見つけた英単語を登録する（重要）

このアプリには、環境差に強い順に以下の導線があります。

### 方法1：コピー → 貼り付け（iPhone/Android共通・最も確実）

1. Webページ上で英単語を選択して **コピー**
2. TANGO-CHO を開く → 「追加」タブ
3. **英単語欄に貼り付け**
4. **翻訳（DeepL）** → **保存**

※ 文章ごとコピーされる場合は、英単語欄を単語だけに整えてから翻訳してください。

---

### 方法2：Android（共有 → TANGO-CHO）※Share Target

Android（Chrome）では、共有メニューからPWAへ渡す導線が使えます。

1. Androidで TANGO-CHO を **PWAとしてインストール**
2. Webで英単語を選択 → **共有**
3. 共有先に **TANGO-CHO** が表示されるので選ぶ
4. TANGO-CHO が開き、**追加タブの英単語欄に自動入力**されます  
   → 翻訳（DeepL）→ 保存

#### 共有先にTANGO-CHOが出ないとき（Android）
Share Target は「インストール時のmanifest」を参照して登録されるため、更新後に反映されないことがあります。
- いったん **PWAをアンインストール** → 再度サイトを開いて **再インストール**  
が最も確実です。

---

### 方法3：iPhone（ショートカットで「共有→TANGO-CHO起動」）※おすすめ

iOSはShare Targetが安定しないため、ショートカットで `?word=` を作って開く方式が実用的です。  
Safariで英単語を選択 → 共有 → ショートカット、で TANGO-CHO を起動し、追加欄に単語を入れます。

#### まず動作確認（手動）
Safariで下のURLを開き、追加欄に `subscription` が入ればOKです。  
`https://masato-nasu.github.io/TANGO-CHO/index.html?word=subscription`

#### ショートカットA：共有シートから送る（本命）
1. **ショートカット**アプリ → 右上 **＋** → 新規ショートカット
2. アクションを追加（上から順に）
   - **一致するテキストを取得（正規表現）**  
     - 入力：ショートカット入力  
     - パターン：`([A-Za-z][A-Za-z'-]{0,49})`  
     - 取得：最初の一致
   - （任意）**小文字に変換**
   - **URLエンコード**
   - **URL**（以下を作成）  
     `https://masato-nasu.github.io/TANGO-CHO/index.html?word=` +（エンコード済みテキスト）
   - **URLを開く**
3. 上部の **(i) / 詳細** → **共有シートに表示** をON  
   - 受け入れる種類：**テキスト**
4. 名前を付ける：例）**TANGO-CHOに送る** → 完了

**使い方**：Safariで英単語を選択 → **共有** → **TANGO-CHOに送る**  
→ アプリ起動＆追加欄に自動入力 → 翻訳 → 保存

#### ショートカットB：クリップボードから送る（保険）
Safariで「選択→共有」が出ない場合でも止まらない、最強の保険です。

1. 新規ショートカット
2. 先頭に **クリップボードから取得**
3. 以降はショートカットAと同じ（抽出→エンコード→URL→開く）
4. 名前：例）**クリップボード→TANGO-CHO**

**使い方**：Webで単語をコピー → ショートカットを実行 → アプリ起動 → 翻訳 → 保存

---

### 方法4：URLパラメータで単語を渡して起動（iPhone/Android共通・裏導線）

アプリURLの末尾に `?word=` を付けると、起動時に単語を受け取って「追加」欄に自動入力します。

例：  
`https://masato-nasu.github.io/TANGO-CHO/index.html?word=subscription`

※ スペースや記号が含まれる場合はURLエンコードが必要です（ショートカット等で自動化できます）。

---

## Features

### 追加（翻訳 + 手入力 + 類義語）
- 英単語を入力（または貼り付け）
- 翻訳（HF Spaces → DeepL）で日本語訳を自動取得
- 日本語訳は編集可能（手入力でもOK）
- 類義語 / 同義語を取得（ボタン）
- 類義語を入力して保存すると、**類義語カードを自動で別カード追加**
  - 重複は自動スキップ
- メモ・タグも保存可能

---

### 単語帳
- 登録単語の一覧表示
- カテゴリ切替（覚えてない / デフォルト / 覚えた）
- 並び替え（時系列 / ABC）
- 検索（英語 / 日本語 / メモ / タグ / 類義語）
- JSON Export / Import（バックアップ＆復元）

---

### クイズ（4択）
- 英→日 / 日→英 の切替
- 出題カテゴリ（全て / 覚えてない / デフォルト / 覚えた）
- ✅ 一度出た単語は **全単語を一巡するまで再出題されません**（取りこぼし防止）
- ✅ 出題カテゴリが「全て」の場合は  
  **覚えてない > デフォルト > 覚えた** の順に早めに出やすい重み付け（比率 **5:3:1**）
- クイズ中にカテゴリ変更（覚えてないへ / 覚えたへ）を即反映
- 正解/不正解は効果音でフィードバック（正解：ピンポン / 不正解：ブブー）

※ 4択の選択肢を作るため、出題カテゴリ内に **最低4単語**が必要です。

---

### 発音（Web Speech API）
- 英語発音は **英語ボイスを優先**して読み上げます（iPhone/iOS対策を含む）

---

## PWAとしてインストール

### iPhone（iOS）
1. Safariで https://masato-nasu.github.io/TANGO-CHO/ を開く
2. 共有 → ホーム画面に追加

### Android / PC（Chrome/Edge）
- URLを開く → メニューの「アプリをインストール」

---

## データについて
- 単語帳は **端末内（localStorage）** に保存されます
- 端末を変えると引き継げません（同期なし）
- **JSON Export / Import** によるバックアップが可能です

---

## よくあるトラブル（PWA更新が反映されない）
PWAはService Workerのキャッシュで、古い版が残ることがあります。
- Android：PWAをアンインストール→再インストールが最短
- iPhone：ホーム画面から削除→Safariのサイトデータ削除→再追加が確実

---

## Key / Token
- HF Spaces URL（必須）
- APP_TOKEN（Spaces側で必要な場合のみ）

---

## Thanks
- DeepL API
- Hugging Face Spaces
- GitHub Pages / PWA
