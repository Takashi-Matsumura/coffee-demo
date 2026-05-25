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
- 🌱 **占い体験 ×4 モード**：
  - 「今日のあなたに、この一杯」（個人向け）
  - 「あなたのチーム、何型？」（チーム向け）
  - 「部署ごとの、コーヒー処方箋」（部署向け）
  - 「会議に効く、コーヒー設計」（会議シーン向け）
- 🏢 **業務体験 ×2 モード（オフィス連携の擬似デモ）**：
  - **社員モード** — 架空社員でログイン → AI 診断 → 注文 → 福利厚生ポリシーで会社負担／自己負担を自動計算
  - **総務モード** — 部署別ダッシュボード、ピーク時間帯ヒートマップ、ローカル LLM による「今月の傾向」要約、経費精算・Slack・BI への送信モック

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

### 占い体験（4 モード）

1. トップから 4 つの占いカードのいずれかを選びます
2. 3 つの質問にタップで回答します
3. AI が結果カードに「占い」を綴ります

### 業務体験（社員モード）

1. トップから「社員モード」を開いて、架空社員 1 名を選びます
2. そのままの導線で個人診断を行います
3. 結果カードの **「この一杯を注文する」** から注文確定画面へ
4. 福利厚生ポリシーに基づき、会社負担／自己負担が自動算出されます
5. 完了画面で経費精算・Slack 連携（モック）を試せます

### 業務体験（総務モード）

1. トップから「総務ダッシュボード」を開きます
2. 当月の総杯数・会社負担額・部署別・ピーク時間帯を俯瞰
3. **ローカル LLM** が「今月の傾向 / 気付き / 次月への提案」を要約します
4. CSV／Slack／経費精算 SaaS への送信（すべてモック）を試せます

「もう一度診断する」「ゲストを切替」でいつでもやり直せます。

## 環境変数

| 変数 | 用途 | 既定 |
|---|---|---|
| `LLAMA_API_URL` | llama.cpp の OpenAI 互換 API エンドポイント | `http://127.0.0.1:8080/v1/chat/completions` |
| `LLAMA_MODEL` | モデル名 | `gemma` |
| `OCC_DEMO_MONTH` | ダッシュボードの集計対象月（`YYYY-MM`） | システム日付 |

## ディレクトリ構成

```
app/
├── page.tsx                            # トップ（占い 4 ＋ 業務 2 のセクション）
├── layout.tsx                          # ルートレイアウト + 社員コンテキストバー
├── globals.css                         # Tailwind v4 テーマ
├── _components/
│   ├── EmployeeContextBar.tsx
│   └── IntegrationBadges.tsx
├── diagnose/                           # 占い体験
│   ├── personal | team | department | meeting / page.tsx
│   └── _components/{Wizard,ResultCard}.tsx
├── employee/                           # 業務体験：社員モード
│   ├── page.tsx                        # 社員選択リスト
│   ├── [id]/page.tsx                   # 選択社員サマリ
│   └── _components/EmployeeCard.tsx
├── order/                              # 業務体験：注文フロー
│   ├── new/page.tsx                    # 推奨メニュー Top3 + 注文確定
│   └── done/page.tsx                   # 注文完了 + モック連携
├── admin/                              # 業務体験：総務ダッシュボード
│   ├── page.tsx
│   └── _components/{SummaryCards,DepartmentBarChart,HourlyHeatmap,TopMenus,InsightSection,IntegrationActions}.tsx
└── api/
    ├── diagnose/route.ts               # 占い LLM プロキシ
    ├── orders/route.ts                 # 注文確定 + 一覧
    ├── admin/insight/route.ts          # ダッシュボード AI 要約
    └── integrations/mock/route.ts      # 連携モック

data/                                   # 架空データ
├── employees.json
├── menu.json
├── policy.json
└── seed-orders.json                    # scripts/gen-seed-orders.mjs で生成

lib/
├── llm.ts | prompts.ts | types.ts
├── employees.ts | menu.ts | policy.ts
├── orders.ts                           # globalThis 経由のインメモリストア
├── aggregate.ts                        # seed + session → AdminSummary
├── integrations.ts                     # 連携バッジのメタ辞書
└── employee-session.ts                 # localStorage ラッパー

scripts/
└── gen-seed-orders.mjs                 # 決定論的にシード注文を生成
```

## カスタマイズのヒント

- **質問の差し替え**：`app/diagnose/*/page.tsx` 内の `steps` を編集
- **占いトーンの調整**：`lib/prompts.ts` のシステムプロンプトを書き換え
- **社員データの追加**：`data/employees.json` を編集
- **メニューラインナップの変更**：`data/menu.json` を編集
- **福利厚生ポリシーの調整**：`data/policy.json` を編集
- **シードを再生成**：`node scripts/gen-seed-orders.mjs`
- **集計対象月の固定**：`OCC_DEMO_MONTH=2026-05 npm run dev`
- **モデルの切り替え**：起動する llama.cpp のモデルを差し替え、必要なら `LLAMA_MODEL` を変更

## 注意

- 社員・メニュー・料金・福利厚生ルール・連携先（経費精算 SaaS / Slack 等）はすべて **架空** です。実在の組織・サービスとは無関係です。
- 「経費精算 SaaS に送信」「Slack に通知」などのアクションは外部に実送信しません（200 を返すだけのモック）。
- セッション中の注文は `globalThis` 上のインメモリストアに保存され、サーバ再起動で消えます（シードデータは残ります）。

## ライセンス

このリポジトリの著作物は MIT License で公開しています。
モデルおよび llama.cpp のライセンスはそれぞれのプロジェクトの規約に従ってください。
