# TANGO-CHO（単語帳 × DeepL × 類義語 × 4択クイズ PWA）

英語を読んでいて分からない単語が出たら、**コピペ → 翻訳 → 保存**。  
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

### 追加（翻訳 + 手入力 + 類義語）
- 英単語を入力
- 翻訳（HF Spaces → DeepL）で日本語訳を自動取得
- 日本語訳は編集可能（手入力でもOK）
- 類義語 / 同義語を取得（ボタン）
- 類義語を入力すると、保存時に **類義語カードを自動で別カード追加**（重複は自動スキップ）
- メモ・タグも保存可能

### 単語帳（検索は1つに統合）
- 登録単語の一覧表示
- カテゴリをワンタップで変更（覚えてない / デフォルト / 覚えた）
- 統合検索（英語 / 日本語訳 / メモ / タグ / 類義語 をまとめて検索）
- タグ検索（統合検索で指定）
  - `#travel` のように `#タグ` で絞り込み
  - `#travel #school` のように複数指定で **AND 絞り込み**
- 編集：単語帳のカードを後から修正して「更新」

### クイズ（4択）
- 英→日 / 日→英 を切り替え
- 出題カテゴリ（全て / 覚えてない / デフォルト / 覚えた）
- クイズ中にカテゴリ変更（覚えてないへ / 覚えたへ）を即反映
- 正解/不正解は効果音でフィードバック（正解：ピンポン / 不正解：ブブー）

> ※ 4択の選択肢を作るため、出題カテゴリ内に **最低4単語**が必要です。  
> 足りない場合は「出題カテゴリ＝全て」にすると始めやすいです。

### 🔊 発音（Web Speech API）
- 英語発音は **英語ボイスを優先**して読み上げます（iPhone/iOS対策を含む）

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

## 📁 データについて

- 単語帳は **端末内（localStorage）** に保存されます
- 端末を変えるとデータは引き継げません（同期なし）
- ただし **JSON Export / Import** でバックアップ＆復元が可能です

---

## キーについて

- このアプリには入力が必要なキーがあります。
  必要な方はご連絡ください。
  
---

## 🙏 Thanks

- DeepL API
- Hugging Face Spaces
- GitHub Pages / PWA


---

## Web上の英単語を、このアプリの「追加」に一発で持ってくる（iPhone向け）

このPWAは、外部から渡されたテキスト（選択した単語など）を受け取り、**追加画面の英単語欄に自動入力**できます。

### 1) 共有（Web Share Target）
- Safariで単語を選択 → 共有 → **TANGO-CHO**（または「TANGO-CHO Share」）を選ぶ
- 共有されたテキストから英単語を抽出して、追加画面に入ります

> iOSはShare Targetの表示が環境差があります。出てこない場合は次の方法が確実です。

### 2) iOSショートカット（確実）
Safariで単語を選択 → 共有 → ショートカット実行 → TANGO-CHOが開いて入力されます。

ショートカットの最後は「URLを開く」で、次のように渡します：

```text
https://<あなたの公開URL>/index.html?word=[ショートカット入力]
```

### 3) ブックマークレット（最短）
Safariのブックマークに、次を登録して使えます（共有が不安定な場合の保険）。

```javascript
javascript:(()=>{const t=window.getSelection?String(getSelection()):'';location.href='https://<あなたの公開URL>/index.html?word='+encodeURIComponent(t.trim());})();
```
