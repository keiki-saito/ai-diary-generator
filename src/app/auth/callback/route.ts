import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * メール確認後のコールバックエンドポイント
 * Supabaseからのリダイレクトを処理し、トークンを交換する
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/diaries';

  console.log('[Auth Callback] Request URL:', requestUrl.href);
  console.log('[Auth Callback] Code present:', !!code);
  console.log('[Auth Callback] Next path:', next);

  if (code) {
    try {
      const supabase = await createServerClient();

      // 認証コードをセッショントークンに交換
      console.log('[Auth Callback] Exchanging code for session...');
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('[Auth Callback] Error exchanging code:', error);
        // エラーページにリダイレクト
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=confirmation_failed`
        );
      }

      console.log('[Auth Callback] Session created successfully:', {
        userId: data.user?.id,
        email: data.user?.email,
      });

      // 成功時は指定されたページまたはダッシュボードにリダイレクト
      const redirectUrl = `${requestUrl.origin}${next}`;
      console.log('[Auth Callback] Redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl);
    } catch (error) {
      console.error('[Auth Callback] Unexpected error:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=unexpected_error`
      );
    }
  }

  // codeがない場合はログインページにリダイレクト
  console.log('[Auth Callback] No code present, redirecting to login');
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
