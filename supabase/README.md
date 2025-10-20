# Supabase セットアップガイド

## ローカル開発環境のセットアップ

### 1. Supabase CLIのインストール

```bash
# macOS
brew install supabase/tap/supabase

# その他のプラットフォーム
# https://supabase.com/docs/guides/cli を参照
```

### 2. ローカルSupabaseの起動

```bash
supabase start
```

このコマンドは以下を起動します：
- PostgreSQL データベース (ポート: 54322)
- Supabase API (ポート: 54321)
- Supabase Studio (ポート: 54323)
- その他のSupabaseサービス

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```bash
# ローカル開発環境の場合
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase startコマンドの出力から取得>

# 本番環境の場合
NEXT_PUBLIC_SUPABASE_URL=<Supabaseプロジェクトのurl>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabaseプロジェクトのanon key>
```

### 4. マイグレーションの適用

```bash
# ローカル環境にマイグレーションを適用
supabase db reset
```

### 5. Supabase Studioへのアクセス

ブラウザで `http://localhost:54323` にアクセスして、Supabase Studioを開きます。

## 本番環境のセットアップ

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com) にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定からURLとAPIキーを取得

### 2. マイグレーションの適用

```bash
# Supabaseプロジェクトにリンク
supabase link --project-ref <your-project-ref>

# マイグレーションを本番環境に適用
supabase db push
```

### 3. 環境変数の設定

Vercelまたはデプロイ先のプラットフォームで以下の環境変数を設定：

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## データベーススキーマ

### diaries テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY | 日記のID |
| user_id | UUID | FOREIGN KEY (auth.users) | ユーザーID |
| date | DATE | NOT NULL | 日記の日付 |
| user_input | TEXT | NOT NULL, CHECK(length >= 50) | ユーザーの入力テキスト |
| content | TEXT | NOT NULL, CHECK(length >= 1) | 生成された日記内容 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 更新日時 |

### RLS (Row Level Security) ポリシー

- ユーザーは自分の日記のみを閲覧・作成・更新・削除可能
- 認証されていないユーザーは日記にアクセスできない

## トラブルシューティング

### ローカル環境でSupabaseが起動しない

```bash
# Dockerが起動しているか確認
docker ps

# Supabaseを停止して再起動
supabase stop
supabase start
```

### マイグレーションが失敗する

```bash
# データベースをリセット
supabase db reset

# または、特定のマイグレーションを適用
supabase migration up
```
