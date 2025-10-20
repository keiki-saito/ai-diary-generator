# AI日記生成アプリ

AIがあなたの日記を自動生成するNext.js製Webアプリケーション

## 機能

- **AI日記生成**: 簡潔なメモからAI（Claude 3.5 Sonnet）が自然な日記を生成
- **ユーザー認証**: Supabase Authによる安全な認証システム
- **日記管理**: 日記の作成、閲覧、編集、削除（CRUD操作）
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **セキュアなデータ管理**: Row Level Security（RLS）による厳格なアクセス制御

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5.x (strict mode)
- **スタイリング**: Tailwind CSS 3.x
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **AI**: Anthropic Claude API (Claude 3.5 Sonnet)
- **デプロイ**: Vercel推奨

## 前提条件

- Node.js 18.x以上
- npm または yarn
- Supabaseアカウント
- Anthropic APIキー

## セットアップ

### 1. リポジトリのクローンと依存関係のインストール

\`\`\`bash
git clone <repository-url>
cd my-new-project
npm install
\`\`\`

### 2. 環境変数の設定

\`.env.local\`ファイルを作成し、以下の環境変数を設定：

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic AI
ANTHROPIC_API_KEY=your-anthropic-api-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Supabaseデータベースのセットアップ

Supabase CLIを使用してマイグレーションを実行：

\`\`\`bash
# Supabase CLIのインストール（初回のみ）
npm install -g supabase

# Supabaseプロジェクトにログイン
supabase login

# Supabaseプロジェクトとリンク
supabase link --project-ref your-project-ref

# マイグレーションを実行
supabase db push
\`\`\`

または、Supabase Studioで\`supabase/migrations/20250101000000_create_diaries_table.sql\`の内容を手動で実行。

### 4. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで http://localhost:3000 を開く

## プロジェクト構造

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions
│   ├── api/               # API Routes
│   ├── diaries/           # 日記関連ページ
│   ├── login/             # ログインページ
│   └── signup/            # サインアップページ
├── components/            # Reactコンポーネント
│   ├── ui/               # 汎用UIコンポーネント
│   ├── diary/            # 日記関連コンポーネント
│   └── layout/           # レイアウトコンポーネント
├── lib/                  # ライブラリとユーティリティ
│   ├── ai/              # AI生成関連
│   ├── supabase/        # Supabaseクライアント
│   └── utils/           # ユーティリティ関数
└── types/               # TypeScript型定義
\`\`\`

## 使い方

1. **サインアップ/ログイン**: メールアドレスとパスワードでアカウント作成
2. **日記作成**: 「新規作成」ボタンをクリック
3. **メモ入力**: その日の出来事や感情を50文字以上入力
4. **AI生成**: 「AI生成」ボタンでAIが日記を自動生成
5. **編集と保存**: 生成された日記を確認・編集して保存
6. **閲覧**: 日記一覧から過去の日記を閲覧

## セキュリティ機能

- **認証**: Supabase Authによる安全な認証
  - クライアント側で直接認証を実行（パスワードが平文でサーバーに送信されない）
  - HTTPS経由でSupabaseに直接送信される
- **Row Level Security**: データベースレベルでのアクセス制御
- **XSS対策**: DOMPurifyによるHTMLサニタイズ
- **CSRF対策**: SameSite Cookie属性の設定
- **環境変数管理**: 機密情報を環境変数で管理

## パフォーマンス

- **Server Components**: 初期ロードの高速化
- **型安全性**: TypeScript strict modeで型エラーを防止
- **最適化されたクエリ**: データベースインデックスの活用
- **レスポンシブデザイン**: モバイルファーストのアプローチ

## ライセンス

MIT

## 作者

AI Diary Generator Team
