# Supabase設定ガイド

このドキュメントでは、AI日記生成アプリで必要なSupabaseの設定について説明します。

## 1. メール確認の設定

### ローカル開発環境（Supabase Local）

ローカル開発環境では、メール送信は実際には行われず、Inbucketでメールを確認できます。

1. **Supabaseをローカルで起動**
   ```bash
   supabase start
   ```

2. **Inbucketでメールを確認**
   - ブラウザで `http://localhost:54324` を開く
   - サインアップ後に送信された確認メールを確認
   - メール内のリンクをクリック

### 本番環境（Supabase Cloud）

#### ステップ1: リダイレクトURLの設定

1. **Supabase Dashboardにアクセス**
   - https://app.supabase.com にログイン
   - 対象プロジェクトを選択

2. **認証設定を開く**
   - 左メニューから「Authentication」をクリック
   - 「URL Configuration」を選択

3. **リダイレクトURLを追加**

   **Site URL:**
   ```
   https://your-app.vercel.app
   ```

   **Redirect URLs:**
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

   ※ ローカル開発用のURLも追加しておくと便利です

#### ステップ2: メールテンプレートの確認（オプション）

1. **Email Templatesを開く**
   - Authentication > Email Templates

2. **Confirm signup テンプレートを確認**

   デフォルトでは以下のようなテンプレートが使用されます：
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your user:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
   ```

   `{{ .ConfirmationURL }}` に自動的にコールバックURLが含まれます。

3. **カスタマイズ（必要に応じて）**

   日本語化する場合：
   ```html
   <h2>アカウントの確認</h2>
   <p>以下のリンクをクリックしてメールアドレスを確認してください：</p>
   <p><a href="{{ .ConfirmationURL }}">メールアドレスを確認</a></p>
   <p>このメールに心当たりがない場合は、無視してください。</p>
   ```

#### ステップ3: メールプロバイダーの設定（オプション）

デフォルトでは、Supabaseの無料メールサービスが使用されます（1日あたり制限あり）。
本格的な運用には、独自のメールプロバイダーを設定することを推奨します。

1. **SMTP設定を開く**
   - Project Settings > Auth > SMTP Settings

2. **SMTP情報を入力**

   例：SendGridを使用する場合
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: your-sendgrid-api-key
   Sender email: noreply@yourdomain.com
   Sender name: AI日記アプリ
   ```

## 2. 確認メールフローの動作確認

### ローカル開発

1. サインアップフォームで新規登録
2. `http://localhost:54324` でInbucketを開く
3. 確認メールを開く
4. 「Confirm your mail」リンクをクリック
5. `http://localhost:3000/auth/callback` にリダイレクト
6. 自動的に `/diaries` にリダイレクトされログイン状態になる

### 本番環境

1. サインアップフォームで新規登録
2. 登録したメールアドレスの受信箱を確認
3. Supabaseからの確認メールを開く
4. 「メールアドレスを確認」リンクをクリック
5. `https://your-app.vercel.app/auth/callback` にリダイレクト
6. 自動的に `/diaries` にリダイレクトされログイン状態になる

## 3. トラブルシューティング

### メールが届かない

1. **迷惑メールフォルダを確認**
   - GmailやOutlookでは迷惑メールに振り分けられることがあります

2. **Supabase Dashboardでログを確認**
   - Project Logs > Auth Logs で送信履歴を確認

3. **メール送信制限を確認**
   - 無料プランでは1日あたりの送信数に制限があります
   - Project Settings > Usage で確認

### リダイレクトが失敗する

1. **リダイレクトURLの設定を確認**
   - Authentication > URL Configuration で正しく設定されているか確認

2. **コールバックURLのスペルミスを確認**
   - `/auth/callback` が正しいパスになっているか確認

3. **ブラウザのコンソールでエラーを確認**
   - F12でデベロッパーツールを開き、エラーメッセージを確認

### 確認後もログインできない

1. **メール確認が完了しているか確認**
   - Supabase Dashboard > Authentication > Users でユーザーのステータスを確認
   - `email_confirmed_at` に日時が入っていればOK

2. **ブラウザのCookieを確認**
   - デベロッパーツール > Application > Cookies で `sb-access-token` が存在するか確認

3. **セッションをリフレッシュ**
   - 一度ログアウトしてから再度ログイン

## 4. セキュリティ上の注意点

### リダイレクトURLの制限

- ワイルドカード `**` は便利ですが、セキュリティリスクがあります
- 可能であれば、特定のパスのみを許可するようにしてください

**推奨:**
```
https://your-app.vercel.app/auth/callback
```

**非推奨（広すぎる）:**
```
https://your-app.vercel.app/**
```

### メール送信元の設定

- 独自ドメインからメールを送信する場合は、SPF/DKIMレコードを設定
- なりすましメールと判定されないようにする

## 5. 関連ドキュメント

- [Supabase Auth公式ドキュメント](https://supabase.com/docs/guides/auth)
- [メールテンプレートのカスタマイズ](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP設定ガイド](https://supabase.com/docs/guides/auth/auth-smtp)
