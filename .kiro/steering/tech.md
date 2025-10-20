# Technology Stack

## Architecture

### Overall Design

AI自動日記生成アプリは、モダンなフルスタックWebアプリケーションとして設計されています。主要なアーキテクチャの特徴：

- **フロントエンド・バックエンド統合**: Next.js 15のApp Routerによるフルスタック開発
- **サーバーレスアーキテクチャ**: Vercelでのデプロイを想定した設計
- **BaaS（Backend as a Service）**: Supabaseによる認証・データベース管理
- **型安全性**: TypeScriptによる厳密な型チェック
- **ユーティリティファースト CSS**: Tailwind CSSによる高速スタイリング

### Application Architecture

```
┌─────────────────────────────────────────┐
│ Client (Browser)                        │
│  ├─ Next.js App Router (React)          │
│  ├─ Tailwind CSS                        │
│  └─ TypeScript                          │
└─────────────────────────────────────────┘
         ↓ HTTP/WebSocket
┌─────────────────────────────────────────┐
│ Next.js Server                          │
│  ├─ Server Components                   │
│  ├─ API Routes                          │
│  ├─ Server Actions                      │
│  └─ Middleware                          │
└─────────────────────────────────────────┘
         ↓ API
┌─────────────────────────────────────────┐
│ Supabase                                │
│  ├─ PostgreSQL Database                 │
│  ├─ Authentication                      │
│  ├─ Storage                             │
│  └─ Real-time Subscriptions             │
└─────────────────────────────────────────┘
         ↓ API
┌─────────────────────────────────────────┐
│ External AI Services                    │
│  └─ LLM API (Claude/OpenAI等)           │
└─────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Next.js 15**
  - App Router: 最新のファイルベースルーティング
  - Server Components: 初期ロード時のパフォーマンス最適化
  - Client Components: インタラクティブなUI
  - Server Actions: フォーム送信とデータ変更
  - 画像最適化: next/image による自動最適化

- **React 19** (Next.js 15に含まれる)
  - Hooks: useState, useEffect, カスタムフック
  - Suspense: ローディング状態の管理
  - Error Boundaries: エラーハンドリング

- **TypeScript**
  - バージョン: 5.x以上
  - 厳密な型チェック（strict mode）
  - インターフェース定義によるデータ構造の明確化
  - 型推論の活用

- **Tailwind CSS**
  - バージョン: 3.x以上
  - ユーティリティクラスによる高速スタイリング
  - レスポンシブデザイン（mobile-first）
  - ダークモード対応
  - カスタムテーマ設定

### Backend & Database

- **Supabase**
  - **PostgreSQL**: リレーショナルデータベース
    - ユーザー情報
    - 日記エントリー
    - タグ・カテゴリ
  - **Authentication**: ユーザー認証・認可
    - Email/Password認証
    - ソーシャルログイン（将来的に）
    - セッション管理
  - **Storage**: ファイルストレージ
    - ユーザーアバター
    - エクスポートされたファイル
  - **Real-time**: リアルタイム同期（将来的に）

### AI Integration

- **LLM API**
  - Claude API または OpenAI API
  - 日記テキストの自動生成
  - 感情分析
  - テキスト要約

### Development Tools

- **ESLint**
  - Next.js推奨設定
  - TypeScript対応ルール
  - React Hooks ルール
  - カスタムルール設定

- **Prettier**
  - コードフォーマッター
  - ESLintとの統合
  - 保存時の自動フォーマット

- **Git**
  - バージョン管理
  - ブランチ戦略: feature/fix/docs等
  - コミットメッセージ規約

## Development Environment

### Required Tools

1. **Node.js**
   - バージョン: 18.x以上（推奨: 20.x LTS）
   - パッケージマネージャー: npm または pnpm

2. **Git**
   - バージョン管理とコラボレーション

3. **エディタ/IDE**
   - VSCode（推奨）
   - 必須拡張機能:
     - ESLint
     - Prettier
     - Tailwind CSS IntelliSense
     - TypeScript Vue Plugin (Volar)

4. **Supabase CLI**（オプション）
   - ローカル開発環境のセットアップ
   - マイグレーション管理

### Environment Setup

```bash
# Node.js バージョン確認
node --version  # v18.0.0以上

# パッケージインストール
npm install

# Supabase プロジェクトの設定
# .env.local に環境変数を設定

# 開発サーバー起動
npm run dev
```

## Common Commands

### Development

```bash
# 開発サーバー起動（localhost:3000）
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動（ビルド後）
npm start

# Linter実行
npm run lint

# Linter自動修正
npm run lint:fix

# 型チェック
npm run type-check
```

### Database (Supabase)

```bash
# Supabase ローカル環境起動
supabase start

# マイグレーション作成
supabase migration new <migration-name>

# マイグレーション適用
supabase db push

# データベースリセット
supabase db reset
```

### Git Workflow

```bash
# 機能開発ブランチ作成
git checkout -b feature/diary-editor

# 変更をコミット
git add .
git commit -m "feat: add diary editor component"

# リモートにプッシュ
git push origin feature/diary-editor
```

## Environment Variables

プロジェクトで使用する環境変数（`.env.local`に設定）：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI API
OPENAI_API_KEY=your-openai-api-key
# または
ANTHROPIC_API_KEY=your-anthropic-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**注意**: 環境変数ファイルは`.gitignore`に含め、Gitにコミットしないこと。

## Port Configuration

- **開発サーバー**: `3000` (Next.js)
- **Supabaseローカル**:
  - API: `54321`
  - DB: `54322`
  - Studio: `54323`

## Dependencies

### Core Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@supabase/supabase-js": "^2.x",
  "@supabase/auth-helpers-nextjs": "^0.x"
}
```

### UI & Styling

```json
{
  "tailwindcss": "^3.x",
  "autoprefixer": "^10.x",
  "postcss": "^8.x"
}
```

### Development Dependencies

```json
{
  "typescript": "^5.x",
  "@types/react": "^19.x",
  "@types/node": "^20.x",
  "eslint": "^8.x",
  "eslint-config-next": "^15.x",
  "prettier": "^3.x",
  "prettier-plugin-tailwindcss": "^0.5.x"
}
```

## Build & Deployment

### Build Process

1. **型チェック**: TypeScriptの型エラーチェック
2. **Lint**: ESLintによるコード品質チェック
3. **ビルド**: Next.jsの最適化ビルド
4. **静的アセット生成**: 画像最適化、CSS/JS圧縮

### Deployment Strategy

- **プラットフォーム**: Vercel（推奨）
- **自動デプロイ**: GitHubプッシュ時に自動ビルド・デプロイ
- **プレビューデプロイ**: プルリクエストごとにプレビュー環境生成
- **環境変数**: Vercelダッシュボードで設定

### Database Migrations

- Supabase Studioでスキーマ変更
- マイグレーションファイルをGitで管理
- 本番環境への適用前にステージング環境でテスト

## Testing Strategy

### Unit Testing (将来実装予定)

- **Jest**: JavaScriptテストフレームワーク
- **React Testing Library**: コンポーネントテスト
- **テストカバレッジ**: 80%以上を目標

### E2E Testing (将来実装予定)

- **Playwright**: エンドツーエンドテスト
- **主要フロー**: ログイン、日記作成、閲覧、エクスポート

### Manual Testing

- 各機能の動作確認
- レスポンシブデザインの検証
- ブラウザ互換性テスト（Chrome, Safari, Firefox）

## Performance Considerations

- **Code Splitting**: Next.jsの自動コード分割
- **Image Optimization**: next/imageによる自動最適化
- **Lazy Loading**: 動的インポートによる遅延ロード
- **Caching**: Server ComponentsとClient Componentsの適切な使い分け
- **Database Indexing**: 頻繁なクエリのインデックス作成

## Security Considerations

- **認証**: Supabase Authによる安全な認証
- **Row Level Security**: データベースレベルでのアクセス制御
- **環境変数**: 機密情報の安全な管理
- **XSS対策**: Reactの自動エスケープ
- **CSRF対策**: Next.jsのServer Actions
- **HTTPS**: 本番環境での強制HTTPS

## Development Methodology

このプロジェクトは**Kiro仕様駆動開発**を採用：

- **ステアリングドキュメント**: `.kiro/steering/`でプロジェクトコンテキスト管理
- **仕様管理**: `.kiro/specs/`で機能ごとの要件・設計・タスク管理
- **段階的開発**: Requirements → Design → Tasks → Implementation
- **品質保証**: 各フェーズでの承認とレビュー
