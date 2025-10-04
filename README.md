# Total Match Game

グリッドから **ちょうど N 個** の数字を選び、合計をターゲットに一致させるパズル。

## デモ

公開URL:https://seiya-matsuoka.github.io/total-match-game/

[![Deploy to GitHub Pages](https://github.com/seiya-matsuoka/total-match-game/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/seiya-matsuoka/total-match-game/actions/workflows/deploy.yml)

## スクリーンショット

![screenshot]

## セットアップ

```bash
npm i
npm run dev
```

## ルール

- NxN グリッド（3×3 / 4×4 / 5×5）
- 指定された 枚数（3 / 4 / 5）だけ選択し、合計をターゲットに一致させる
- 不正解時の挙動は「問題継続」 or 「問題切替」から選択可
- 制限時間内の正解数を競う。設定ごとにハイスコアを保存

## 操作

- マウス: クリックで選択/解除、ホバーでハイライト
- キーボード: 矢印キーで移動、Enter / Space で選択/解除
- 設定で「マウス / キーボード」を切り替え可能

## 設定

- グリッド: 3×3 / 4×4 / 5×5
- 選択するマス数: 3 / 4 / 5（グリッドに応じて自動制約）
- ターゲット最大: 3×3 → 20/25/30、4×4 → +35、5×5 → +40
- 不正解時: 問題継続 / 問題切替
- 保存済み設定: 最大4件まで保存（重複は保存不可）
- 記録: 設定ごとにハイスコア保存（localStorage）

## 画面構成

- 左サイドバー: ターゲット、残り時間、スコア、ハイスコア
- 盤面: 数字グリッド（選択/フォーカス/ホバーの視覚表現）
- ステータス行: 合計 / 選択数 / 操作モード、説明・リセット
- 設定画面: 各種設定・プリセット保存/適用/削除
- タイムアップ: スコア表示、再挑戦ボタン、設定へ戻る

## 技術スタック

- React (Vite) + TypeScript
- Tailwind CSS
- ESLint + Prettier
- sonner（トースト通知）

## ディレクトリ構成

```bash
コードをコピーする
src/
├─ components/
│ ├─ Grid.tsx # 盤面の表示とセルのインタラクション
│ ├─ Sidebar.tsx # ターゲット/残り時間/スコア/ハイスコア
│ ├─ Settings.tsx # 設定UIと保存済みプリセット
│ └─ HowTo.tsx # 説明画面
├─ game/
│ ├─ generateRound.ts # 盤面生成（解が存在するラウンドを構築）
│ ├─ config.ts # GameConfig 型、保存/読込、ハイスコア管理
│ └─ types.ts # Round 等のドメイン型
├─ ui/
│ └─ tokens.ts # ピル/ボタン等のUIトークン（クラス）
├─ main.tsx, App.tsx
└─ index.css
```

## スクリプト

- `dev` 開発サーバ
- `build` 本番ビルド
- `preview` ビルドのプレビュー

## 設計メモ

- 状態: App.tsx がゲーム状態（isRunning/ended、score、timeLeft、選択中、フォーカスなど）を集中管理
- 盤面生成: generateRound が NxN／picksCount／targetMax の制約を満たすラウンドを構築
- 保存: 設定（最後の使用値）とハイスコア、保存済み設定は localStorage

## デプロイ（GitHub Pages）

- `vite.config.js` の `base` を `'/color-picker-palette/'` に設定
- GitHub Actions（`deploy.yml`）が `main` への push で自動デプロイ
