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

  if (code) {
    try {
      const supabase = await createServerClient();

      // 認証コードをセッショントークンに交換
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Error exchanging code for session:', error);
        // エラーページにリダイレクト
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=confirmation_failed`
        );
      }

      // 成功時は指定されたページまたはダッシュボードにリダイレクト
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } catch (error) {
      console.error('Unexpected error in callback:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=unexpected_error`
      );
    }
  }

  // codeがない場合はログインページにリダイレクト
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
