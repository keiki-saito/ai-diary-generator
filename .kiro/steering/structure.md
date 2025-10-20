# Project Structure

## Root Directory Organization

```
my-new-project/
├── .claude/                 # Claude Code設定
│   └── commands/           # カスタムスラッシュコマンド
│       └── kiro/          # Kiro開発ワークフローコマンド
├── .kiro/                  # Kiro仕様駆動開発
│   ├── steering/          # ステアリングドキュメント
│   └── specs/             # 機能仕様（機能ごとにサブディレクトリ）
├── src/                    # アプリケーションソースコード
│   ├── app/               # Next.js App Router
│   ├── components/        # Reactコンポーネント
│   ├── lib/               # ユーティリティ・ヘルパー
│   ├── types/             # TypeScript型定義
│   └── styles/            # グローバルスタイル
├── public/                 # 静的ファイル
├── supabase/               # Supabase設定とマイグレーション
├── .env.local              # 環境変数（Gitにコミットしない）
├── .gitignore              # Git除外設定
├── CLAUDE.md               # Claude Codeプロジェクト設定
├── next.config.js          # Next.js設定
├── package.json            # NPM依存関係
├── tailwind.config.ts      # Tailwind CSS設定
├── tsconfig.json           # TypeScript設定
└── README.md               # プロジェクトドキュメント
```

## Subdirectory Structures

### `.claude/commands/kiro/` - Kiroワークフローコマンド

```
.claude/commands/kiro/
├── steering.md              # ステアリング管理コマンド
├── steering-custom.md       # カスタムステアリング作成
├── spec-init.md            # 仕様初期化
├── spec-requirements.md    # 要件定義生成
├── spec-design.md          # 技術設計作成
├── spec-tasks.md           # タスク分解
├── spec-impl.md            # タスク実装
├── spec-status.md          # 進捗確認
├── validate-gap.md         # 実装ギャップ分析
└── validate-design.md      # 設計品質レビュー
```

### `.kiro/` - Kiro仕様駆動開発ディレクトリ

```
.kiro/
├── steering/               # プロジェクト全体のコンテキスト
│   ├── product.md         # プロダクト概要
│   ├── tech.md            # 技術スタック
│   ├── structure.md       # プロジェクト構造（このファイル）
│   └── [custom].md        # カスタムステアリング（オプション）
└── specs/                 # 機能仕様
    └── [feature-name]/    # 機能ごとのディレクトリ
        ├── requirements.md # 要件定義
        ├── design.md      # 技術設計
        └── tasks.md       # 実装タスク
```

### `src/app/` - Next.js App Router

```
src/app/
├── (auth)/                 # 認証関連ルート（グループ）
│   ├── login/
│   │   └── page.tsx       # ログインページ
│   └── signup/
│       └── page.tsx       # サインアップページ
├── (dashboard)/            # ダッシュボード（認証後）
│   ├── diary/
│   │   ├── page.tsx       # 日記一覧
│   │   ├── [id]/
│   │   │   └── page.tsx   # 日記詳細
│   │   └── new/
│   │       └── page.tsx   # 新規日記作成
│   └── settings/
│       └── page.tsx       # 設定ページ
├── api/                    # API Routes
│   ├── diary/
│   │   └── route.ts       # 日記CRUD API
│   └── ai/
│       └── generate/
│           └── route.ts   # AI生成API
├── layout.tsx              # ルートレイアウト
├── page.tsx                # トップページ
├── loading.tsx             # ローディングUI
└── error.tsx               # エラーUI
```

**ルートグループの説明**:
- `(auth)`: 認証関連ページをグループ化（URLには影響しない）
- `(dashboard)`: 認証後のダッシュボードページ

### `src/components/` - Reactコンポーネント

```
src/components/
├── ui/                     # 汎用UIコンポーネント
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── Spinner.tsx
├── diary/                  # 日記関連コンポーネント
│   ├── DiaryEditor.tsx    # 日記エディタ
│   ├── DiaryList.tsx      # 日記一覧
│   ├── DiaryCard.tsx      # 日記カード
│   └── AIGenerateButton.tsx # AI生成ボタン
├── auth/                   # 認証関連コンポーネント
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── AuthProvider.tsx   # 認証コンテキスト
└── layout/                 # レイアウトコンポーネント
    ├── Header.tsx
    ├── Sidebar.tsx
    └── Footer.tsx
```

### `src/lib/` - ライブラリとユーティリティ

```
src/lib/
├── supabase/               # Supabase関連
│   ├── client.ts          # クライアントサイド
│   ├── server.ts          # サーバーサイド
│   └── middleware.ts      # ミドルウェア
├── ai/                     # AI統合
│   ├── client.ts          # AI APIクライアント
│   └── prompts.ts         # プロンプトテンプレート
├── utils/                  # ユーティリティ関数
│   ├── date.ts            # 日付処理
│   ├── validation.ts      # バリデーション
│   └── format.ts          # フォーマット
└── hooks/                  # カスタムフック
    ├── useDiary.ts        # 日記操作
    ├── useAuth.ts         # 認証
    └── useAI.ts           # AI生成
```

### `src/types/` - TypeScript型定義

```
src/types/
├── database.ts             # Supabase Database型
├── diary.ts                # 日記関連型
├── user.ts                 # ユーザー関連型
└── ai.ts                   # AI関連型
```

### `supabase/` - Supabase設定

```
supabase/
├── migrations/             # データベースマイグレーション
│   └── 20240101_initial.sql
├── seed.sql                # 初期データ
└── config.toml             # Supabase設定
```

## Code Organization Patterns

### コンポーネント構成原則

1. **Server Components優先**
   - デフォルトはServer Components
   - インタラクションが必要な場合のみClient Components（'use client'）

2. **コンポーネントの責務分離**
   - **Presentational Components**: UIのみを担当（`src/components/ui/`）
   - **Container Components**: ロジックとデータフェッチ（`src/app/`内）
   - **Feature Components**: 特定機能のコンポーネント（`src/components/diary/`等）

3. **コンポーネントファイル構成**
   ```tsx
   // src/components/diary/DiaryCard.tsx

   // 型定義
   interface DiaryCardProps {
     diary: Diary;
     onDelete?: (id: string) => void;
   }

   // コンポーネント
   export function DiaryCard({ diary, onDelete }: DiaryCardProps) {
     // 実装
   }
   ```

### データフェッチパターン

1. **Server Components でのデータフェッチ**
   ```tsx
   // src/app/diary/page.tsx
   import { createServerClient } from '@/lib/supabase/server';

   export default async function DiaryPage() {
     const supabase = createServerClient();
     const { data: diaries } = await supabase
       .from('diaries')
       .select('*');

     return <DiaryList diaries={diaries} />;
   }
   ```

2. **Client Components でのデータフェッチ**
   ```tsx
   // src/components/diary/DiaryEditor.tsx
   'use client';

   import { useDiary } from '@/lib/hooks/useDiary';

   export function DiaryEditor() {
     const { create, isLoading } = useDiary();
     // 実装
   }
   ```

### API Routes パターン

```typescript
// src/app/api/diary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('diaries').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  // 実装
}
```

## File Naming Conventions

### ファイル名規則

- **コンポーネント**: PascalCase（例: `DiaryCard.tsx`）
- **ユーティリティ**: camelCase（例: `formatDate.ts`）
- **型定義**: camelCase（例: `diary.ts`）
- **API Routes**: lowercase（例: `route.ts`）
- **Next.js特殊ファイル**: lowercase（例: `page.tsx`, `layout.tsx`, `loading.tsx`）

### ディレクトリ名規則

- **機能別**: lowercase（例: `diary/`, `auth/`）
- **UIコンポーネント**: lowercase（例: `ui/`）
- **Next.jsルート**: lowercase、ルートグループは`()`で囲む（例: `(auth)/`, `(dashboard)/`）

## Import Organization

### インポート順序

```typescript
// 1. React/Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. 外部ライブラリ
import { createClient } from '@supabase/supabase-js';

// 3. 内部ライブラリ（@/で始まるエイリアス）
import { Button } from '@/components/ui/Button';
import { useDiary } from '@/lib/hooks/useDiary';
import { Diary } from '@/types/diary';

// 4. 相対インポート
import { formatDate } from './utils';

// 5. スタイル
import './styles.css';
```

### パスエイリアス

`tsconfig.json`で`@/`エイリアスを設定：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

使用例：
```typescript
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
```

## Key Architectural Principles

### 1. 型安全性の徹底

- すべての関数に明示的な型注釈
- `any`型の使用を避ける
- Supabase Database型の自動生成と活用

```typescript
// Good
function createDiary(data: DiaryCreateInput): Promise<Diary> {
  // 実装
}

// Bad
function createDiary(data: any): Promise<any> {
  // 実装
}
```

### 2. Server Components と Client Components の明確な分離

- **Server Components**（デフォルト）:
  - データフェッチ
  - 認証チェック
  - 静的コンテンツ

- **Client Components**（'use client'）:
  - ユーザーインタラクション
  - ブラウザAPI使用
  - 状態管理

### 3. データアクセスレイヤーの抽象化

Supabaseへの直接アクセスを避け、カスタムフックやヘルパー関数を経由：

```typescript
// src/lib/hooks/useDiary.ts
export function useDiary() {
  const create = async (data: DiaryCreateInput) => {
    // Supabase操作
  };

  const update = async (id: string, data: DiaryUpdateInput) => {
    // Supabase操作
  };

  return { create, update };
}
```

### 4. エラーハンドリングの統一

```typescript
try {
  const result = await apiCall();
  return { data: result, error: null };
} catch (error) {
  console.error('Error:', error);
  return { data: null, error: error.message };
}
```

### 5. 環境変数の型安全な管理

```typescript
// src/lib/env.ts
export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  ai: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
  },
} as const;
```

### 6. テスタビリティの考慮

- ロジックとUIの分離
- 依存性注入の活用
- Pure Functionsの優先

### 7. パフォーマンス最適化

- Dynamic Importによるコード分割
- `next/image`による画像最適化
- Server Componentsでのデータフェッチ
- メモ化（`useMemo`, `useCallback`）の適切な使用

## Development Workflow Integration

### Kiro仕様駆動開発との統合

このプロジェクト構造は、Kiro開発ワークフローと統合されています：

1. **仕様作成**: `.kiro/specs/[feature-name]/`に要件・設計・タスクを配置
2. **ステアリング参照**: AIが`.kiro/steering/`を常時参照し、一貫した実装を生成
3. **段階的実装**: タスクごとに対応するファイルを作成・更新
4. **品質保証**: 各フェーズでのレビューと検証

### 新機能追加時の構造展開

例: 「タグ機能」を追加する場合

```
1. 仕様作成: .kiro/specs/tags/
2. 型定義: src/types/tag.ts
3. データベース: supabase/migrations/add_tags.sql
4. コンポーネント: src/components/tag/
5. API: src/app/api/tags/
6. フック: src/lib/hooks/useTag.ts
7. ページ統合: src/app/(dashboard)/diary/[id]/page.tsx
```

この構造により、機能の追加・変更が体系的かつ予測可能になります。
