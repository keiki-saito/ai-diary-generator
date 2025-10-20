// AI生成関連の型定義

/**
 * AI生成APIリクエストの型定義
 */
export interface GenerateRequest {
  userInput: string; // 50文字以上
  date: string; // ISO 8601形式（YYYY-MM-DD）
}

/**
 * AI生成API成功レスポンスの型定義
 */
export interface GenerateResponse {
  success: true;
  content: string; // 生成された日記文章（500〜800文字）
}

/**
 * エラーコードの型定義
 */
export type ErrorCode =
  | 'INVALID_INPUT'
  | 'UNAUTHORIZED'
  | 'RATE_LIMIT'
  | 'AI_ERROR'
  | 'TIMEOUT';

/**
 * AI生成APIエラーレスポンスの型定義
 */
export interface GenerateErrorResponse {
  success: false;
  error: string; // エラーメッセージ
  code: ErrorCode;
}

/**
 * AI生成状態の型定義（Client Componentで使用）
 */
export interface AIGenerationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  content: string | null;
  error: string | null;
}

/**
 * AI生成オプションの型定義
 */
export interface GenerateDiaryOptions {
  userInput: string;
  date: Date;
  maxTokens?: number; // デフォルト: 1000
  temperature?: number; // デフォルト: 0.7
}

/**
 * AI生成結果の型定義
 */
export interface GenerateDiaryResult {
  content: string;
  tokensUsed: number;
}
