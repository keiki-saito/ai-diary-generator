'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionResult } from '@/types';

/**
 * メールアドレスとパスワードでサインアップ
 */
export async function signUp(
  email: string,
  password: string
): Promise<ActionResult<{ email: string }>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'ユーザーの作成に失敗しました',
      };
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
      data: { email: data.user.email ?? email },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

/**
 * メールアドレスとパスワードでログイン
 */
export async function signIn(
  email: string,
  password: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/', 'layout');
    redirect('/diaries');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

/**
 * ログアウト
 */
export async function signOut(): Promise<ActionResult<void>> {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/', 'layout');
    redirect('/login');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

/**
 * パスワードリセットメールを送信
 */
export async function resetPassword(email: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}
