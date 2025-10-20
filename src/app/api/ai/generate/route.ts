import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getAIService } from '@/lib/ai';
import { ValidationError, AIGenerationError, AuthenticationError } from '@/types/errors';
import type { GenerateRequest, GenerateResponse, GenerateErrorResponse } from '@/types';

/**
 * AI日記生成APIエンドポイント
 * POST /api/ai/generate
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'ログインが必要です',
        code: 'UNAUTHORIZED',
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // リクエストボディの取得
    let body: GenerateRequest;
    try {
      body = await request.json();
    } catch {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'リクエストボディが不正です',
        code: 'INVALID_INPUT',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // バリデーション
    const validationError = validateRequest(body);
    if (validationError) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: validationError,
        code: 'INVALID_INPUT',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 日付をDateオブジェクトに変換
    const date = new Date(body.date);

    // AI生成サービスを使用して日記を生成
    const aiService = getAIService();
    const result = await aiService.generateDiary({
      userInput: body.userInput,
      date,
    });

    // 成功レスポンス
    const successResponse: GenerateResponse = {
      success: true,
      content: result.content,
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error('Error in AI generation API:', error);

    // エラータイプに応じたレスポンス
    if (error instanceof ValidationError) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: error.userMessage,
        code: 'INVALID_INPUT',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (error instanceof AuthenticationError) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: error.userMessage,
        code: 'UNAUTHORIZED',
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    if (error instanceof AIGenerationError) {
      // タイムアウトエラー
      if (error.message.includes('timeout')) {
        const errorResponse: GenerateErrorResponse = {
          success: false,
          error: error.userMessage,
          code: 'TIMEOUT',
        };
        return NextResponse.json(errorResponse, { status: 504 });
      }

      // レート制限エラー
      if (error.message.includes('rate_limit') || error.message.includes('Rate limit')) {
        const errorResponse: GenerateErrorResponse = {
          success: false,
          error: error.userMessage,
          code: 'RATE_LIMIT',
        };
        return NextResponse.json(errorResponse, { status: 429 });
      }

      // その他のAI生成エラー
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: error.userMessage,
        code: 'AI_ERROR',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // 予期しないエラー
    const errorResponse: GenerateErrorResponse = {
      success: false,
      error: '予期しないエラーが発生しました。もう一度お試しください。',
      code: 'AI_ERROR',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * リクエストボディのバリデーション
 * @returns エラーメッセージ、またはバリデーション成功時はnull
 */
function validateRequest(body: GenerateRequest): string | null {
  // userInputの存在チェック
  if (!body.userInput || typeof body.userInput !== 'string') {
    return 'userInputは必須です';
  }

  // userInputの文字数チェック（1文字以上）
  if (body.userInput.trim().length < 1) {
    return 'userInputは1文字以上である必要があります';
  }

  // dateの存在チェック
  if (!body.date || typeof body.date !== 'string') {
    return 'dateは必須です';
  }

  // dateの形式チェック（ISO 8601形式: YYYY-MM-DD）
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(body.date)) {
    return 'dateはYYYY-MM-DD形式である必要があります';
  }

  // 有効な日付かチェック
  const date = new Date(body.date);
  if (isNaN(date.getTime())) {
    return 'dateが有効な日付ではありません';
  }

  return null;
}
