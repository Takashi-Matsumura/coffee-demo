# ☕ Office Coffee Compass

ローカルAIが、あなたとチームに合うコーヒーを「占う」ささやかな Web デモです。

3つの質問にタップで答えるだけで、AIが今日のあなたにぴったりの一杯や、
あなたのチームに似合うオフィスコーヒー像をその場で言葉にしてくれます。

> このアプリは **AIによるコーヒー占い** として作られた展示用のデモです。
> 提案される豆名・抽出方法・診断結果はモデルが生成したフィクションで、
> 実在の商品やサービスを示すものではありません。

## 特徴

- 🧠 **ローカルAIで完結**：すべての推論をローカルマシン上の [llama.cpp](https://github.com/ggerganov/llama.cpp) で行います。クラウドAPIは一切使いません。
- ⚡ **ストリーミング表示**：AIが言葉を紡いでいく様子をそのまま画面に流します。
- 🎯 **タップだけで完結**：3問・各4択。会場で誰でも30秒〜2分で体験できる設計です。
- 🌱 **2つの占いモード**：
  - 「今日のあなたに、この一杯」（個人向け）
  - 「あなたのチーム、何型？」（チーム向け）

## 技術スタック

| レイヤ | 採用 |
|---|---|
| フレームワーク | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS v4 |
| 言語 | TypeScript |
| LLM ランタイム | [llama.cpp](https://github.com/ggerganov/llama.cpp) サーバ（OpenAI 互換 API） |
| 推奨モデル | Gemma 系の Instruction-tuned モデル（GGUF 量子化） |

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. ローカルLLMサーバを起動する

別ターミナルで [llama.cpp](https://github.com/ggerganov/llama.cpp) サーバを起動しておきます。

```bash
# 例: gemma の GGUF モデルを :8080 で起動
llama-server -m ./models/gemma-XX.gguf --host 127.0.0.1 --port 8080
```

> 検証時に使用したモデルは Gemma 系の 4B 量子化（Q4_K_M）です。
> Apple Silicon 搭載 Mac であればミドルクラス以上のマシンでストレスなく動作します。

### 3. 環境変数（任意）

未指定時は `http://127.0.0.1:8080` の OpenAI 互換 API に接続します。
別ホスト・別ポートで動かす場合のみ、`.env.local` で上書きしてください。

```env
# .env.local
LLAMA_API_URL=http://127.0.0.1:8080/v1/chat/completions
LLAMA_MODEL=gemma
```

### 4. 開発サーバを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

LLMサーバが起動していない場合でも、フォールバックの固定文がストリーミング表示されるので、UIだけの確認も可能です。

## 使い方

1. トップで「個人診断」か「チーム診断」を選びます
2. 3つの質問にタップで回答します
3. AIが結果カードに「占い」を綴ります

「もう一度診断する」でいつでもやり直せます。

## ディレクトリ構成

```
app/
├── page.tsx                       # トップ（モード選択）
├── layout.tsx                     # ルートレイアウト
├── globals.css                    # Tailwind v4 テーマ
├── api/diagnose/route.ts          # LLM プロキシ (POST)
└── diagnose/
    ├── layout.tsx
    ├── personal/page.tsx          # 個人診断ウィザード
    ├── team/page.tsx              # チーム診断ウィザード
    └── _components/
        ├── Wizard.tsx
        └── ResultCard.tsx
lib/
├── llm.ts                         # llama.cpp ストリーミング呼び出し
├── prompts.ts                     # システムプロンプト
└── types.ts                       # 回答スキーマ
```

## カスタマイズのヒント

- **質問の差し替え**：`app/diagnose/personal/page.tsx` および `team/page.tsx` 内の `steps` を編集
- **占いトーンの調整**：`lib/prompts.ts` のシステムプロンプトを書き換え
- **モデルの切り替え**：起動する llama.cpp のモデルを差し替え、必要なら `LLAMA_MODEL` を変更

## ライセンス

このリポジトリの著作物は MIT License で公開しています。
モデルおよび llama.cpp のライセンスはそれぞれのプロジェクトの規約に従ってください。
