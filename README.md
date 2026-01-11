# Gray-Scott Visualizer (Minimal Fade-In)

音楽に合わせて生成される **Gray-Scott 反応拡散パターン** をリアルタイムに可視化する Web アプリです。  
📱 **PWA対応 (iPhone / Android / PC 全対応確認済み)** — スマホやPCにインストールしてアプリのように使えます！

---

## 特長
- 🎶 **音楽入力対応** — ローカルの音楽ファイルを読み込み、音の特徴量に反応  
- 🌊 **リアルタイム生成** — Gray-Scott 反応拡散モデルでパターンが進化  
- 🖼️ **インタラクティブ** — クリックでフィード／キル値にフラッシュ効果  
- 📱 **PWA対応** — GitHub Pagesから直接インストール可能  
- 🌙 **Wake Lock対応** — 画面が暗転せず連続再生できる（Android/Chrome）。  
   → 実質 **バックグラウンド再生に近い体験** が可能！  
- 🎧 **Media Session対応** — 通知バー・ロック画面・イヤホンボタンから操作可能。電話着信時もOS側で自動制御され安心

---

## インストール方法（PWA）
1. デモページを開く  
   👉 [https://masato-nasu.github.io/Gray-Scott-Visualizer/](https://masato-nasu.github.io/Gray-Scott-Visualizer/)  
2. **PC (Chrome/Edge)**：URLバー右端の「インストール」アイコンをクリック  
3. **Android (Chrome)**：メニュー「…」→「インストール」または「ホーム画面に追加」  
4. **iOS (Safari)**：共有ボタン →「ホーム画面に追加」  

---

## 制約について（重要）
- PWAの仕様上、**完全なバックグラウンド再生は不可**  
- ただし Wake Lock により **画面ON状態なら暗転せず音楽継続可能**  
- 端末ロックや他アプリを開いた場合は再生停止します  

---

## スクリーンショット
![Gray-Scott Visualizer Screenshot](./screenshot.png)

---

## デモページ
https://masato-nasu.github.io/Gray-Scott-Visualizer/

---

## 使い方
1. 「SELECT MUSIC FOLDER / FILES」から音楽ファイルをまとめて読み込み  
   - **PC**：フォルダを選択（サブフォルダ内も再帰的に読み込み）  
   - **Android**：フォルダ相当のディレクトリ選択が可能  
   - **iPhone/iPad**：ファイルアプリから複数曲を選択（フォルダ的に扱える体験）  
2. **PLAY** で再生開始  
3. **PAUSE / NEXT / PREVIOUS** で操作可能  
4. キャンバスをクリックするとパターンが一時的に変調  

---

## 開発環境
- HTML / CSS / JavaScript  
- [Meyda](https://meyda.js.org/) (音声特徴量抽出ライブラリ)  

---

## ライセンス
MIT License

# Gray-Scott Visualizer (Minimal Fade-In)

A **real-time Gray-Scott reaction-diffusion visualizer** that responds to music.  
📱 **PWA Support (Tested on iPhone / Android / PC)** — Works like an app on your device!

---

## Features
- 🎶 **Music Input** — Load local audio files and react to audio features  
- 🌊 **Real-Time Generation** — Dynamic Gray-Scott reaction-diffusion patterns  
- 🖼️ **Interactive** — Click the canvas to trigger flash effects  
- 📱 **PWA Support** — Installable directly from GitHub Pages  
- 🌙 **Wake Lock** — Prevents screen dimming; keeps music and visuals running (Android/Chrome).  
   → Provides an **almost background playback experience**  
- 🎧 **Media Session** — Control playback via notifications, lock screen, or headset buttons. Integrates smoothly with phone calls

---

## Installation (PWA)
1. Open the demo page  
   👉 [https://masato-nasu.github.io/Gray-Scott-Visualizer/](https://masato-nasu.github.io/Gray-Scott-Visualizer/)  
2. **PC (Chrome/Edge)**: Click the “Install” icon in the URL bar  
3. **Android (Chrome)**: Menu “⋮” → “Install” or “Add to Home screen”  
4. **iOS (Safari)**: Share → “Add to Home Screen”  

---

## Limitations
- As a PWA, **full background playback is not supported**  
- With Wake Lock enabled, playback continues as long as the screen stays ON  
- Playback stops when the device is locked or another app is brought to the foreground  

---

## Screenshot
![Gray-Scott Visualizer Screenshot](./screenshot.png)

---

## Demo Page
https://masato-nasu.github.io/Gray-Scott-Visualizer/

---

## Usage
1. Select music using **SELECT MUSIC FOLDER / FILES**  
   - **PC**: Choose a folder (recursive load of subfolders)  
   - **Android**: Select a directory  
   - **iPhone/iPad**: Choose multiple files from the Files app (similar to folder selection)  
2. Press **PLAY** to start playback  
3. Use **PAUSE / NEXT / PREVIOUS** for controls  
4. Click the canvas to apply temporary flash effects  

---

## Tech Stack
- HTML / CSS / JavaScript  
- [Meyda](https://meyda.js.org/) (Audio feature extraction library)  

---

## License
MIT License
