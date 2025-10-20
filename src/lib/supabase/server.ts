import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Server Component用のSupabaseクライアントを作成
 * cookies()を使用してサーバーサイドでの認証状態を管理
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAllはServer ComponentからServer Actionへの移行時に呼ばれる可能性がある
            // その場合はエラーを無視する（Next.jsの制約）
          }
        },
      },
    }
  );
}

/**
 * 現在認証されているユーザーを取得
 * 未認証の場合はnullを返す
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * 現在認証されているユーザーを取得（必須）
 * 未認証の場合はエラーをスロー
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: User must be authenticated');
  }
  return user;
}
