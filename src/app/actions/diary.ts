'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ValidationError, DatabaseError, AuthenticationError } from '@/types/errors';
import type { ActionResult, DiaryCreateInput, DiaryUpdateInput } from '@/types';

/**
 * 新規日記を作成
 */
export async function createDiary(
  input: DiaryCreateInput
): Promise<ActionResult<{ diaryId: string }>> {
  try {
    // 認証チェック
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'ログインが必要です',
      };
    }

    // バリデーション
    if (!input.user_input || input.user_input.trim().length < 1) {
      return {
        success: false,
        error: 'ユーザー入力は1文字以上である必要があります',
      };
    }

    if (!input.content || input.content.trim().length < 1) {
      return {
        success: false,
        error: '日記の内容は1文字以上である必要があります',
      };
    }

    // 日付のフォーマット（YYYY-MM-DD）
    const dateString = input.date.toISOString().split('T')[0];

    // データベースに挿入
    const { data, error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        date: dateString,
        user_input: input.user_input.trim(),
        content: input.content.trim(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        error: 'データの保存に失敗しました。もう一度お試しください。',
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'データの保存に失敗しました',
      };
    }

    // キャッシュを再検証
    revalidatePath('/diaries');

    return {
      success: true,
      data: { diaryId: data.id },
    };
  } catch (error) {
    console.error('Error in createDiary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

/**
 * 既存の日記を更新
 */
export async function updateDiary(
  diaryId: string,
  input: DiaryUpdateInput
): Promise<ActionResult<void>> {
  try {
    // 認証チェック
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'ログインが必要です',
      };
    }

    // バリデーション
    if (!diaryId) {
      return {
        success: false,
        error: '日記IDが指定されていません',
      };
    }

    if (!input.content || input.content.trim().length < 1) {
      return {
        success: false,
        error: '日記の内容は1文字以上である必要があります',
      };
    }

    // 更新データの準備
    const updateData: Record<string, string> = {
      content: input.content.trim(),
    };

    if (input.user_input) {
      updateData.user_input = input.user_input.trim();
    }

    // データベースを更新（RLSにより所有者のみ更新可能）
    const { error } = await supabase
      .from('diaries')
      .update(updateData)
      .eq('id', diaryId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        error: 'データの更新に失敗しました。もう一度お試しください。',
      };
    }

    // キャッシュを再検証
    revalidatePath('/diaries');
    revalidatePath(`/diaries/${diaryId}`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error in updateDiary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

/**
 * 日記を削除
 */
export async function deleteDiary(diaryId: string): Promise<ActionResult<void>> {
  try {
    // 認証チェック
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'ログインが必要です',
      };
    }

    // バリデーション
    if (!diaryId) {
      return {
        success: false,
        error: '日記IDが指定されていません',
      };
    }

    // データベースから削除（RLSにより所有者のみ削除可能）
    const { error } = await supabase
      .from('diaries')
      .delete()
      .eq('id', diaryId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        error: 'データの削除に失敗しました。もう一度お試しください。',
      };
    }

    // キャッシュを再検証
    revalidatePath('/diaries');

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error in deleteDiary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    };
  }
}

/**
 * 日記IDで1件の日記を取得
 */
export async function getDiary(diaryId: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  const { data, error } = await supabase
    .from('diaries')
    .select('id, user_id, date, user_input, content, created_at, updated_at')
    .eq('id', diaryId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    throw new DatabaseError(`Failed to fetch diary: ${error.message}`);
  }

  if (!data) {
    throw new Error('Diary not found');
  }

  return {
    id: data.id,
    user_id: data.user_id,
    date: new Date(data.date),
    user_input: data.user_input,
    content: data.content,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
}

/**
 * 認証済みユーザーの全日記を取得
 */
export async function getDiaries() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  const { data, error } = await supabase
    .from('diaries')
    .select('id, user_id, date, user_input, content, created_at, updated_at')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) {
    throw new DatabaseError(`Failed to fetch diaries: ${error.message}`);
  }

  return (data || []).map((diary) => ({
    id: diary.id,
    user_id: diary.user_id,
    date: new Date(diary.date),
    user_input: diary.user_input,
    content: diary.content,
    created_at: new Date(diary.created_at),
    updated_at: new Date(diary.updated_at),
  }));
}
