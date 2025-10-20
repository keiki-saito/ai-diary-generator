// エラー関連の型定義

/**
 * アプリケーション共通のエラークラス
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public userMessage: string
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * バリデーションエラー（400 Bad Request）
 */
export class ValidationError extends AppError {
  constructor(message: string, userMessage: string) {
    super('VALIDATION_ERROR', message, 400, userMessage);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * 認証エラー（401 Unauthorized）
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('AUTHENTICATION_ERROR', message, 401, 'ログインが必要です。');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * AI生成エラー（500 Internal Server Error）
 */
export class AIGenerationError extends AppError {
  constructor(message: string, userMessage: string) {
    super('AI_GENERATION_ERROR', message, 500, userMessage);
    this.name = 'AIGenerationError';
    Object.setPrototypeOf(this, AIGenerationError.prototype);
  }
}

/**
 * データベースエラー（500 Internal Server Error）
 */
export class DatabaseError extends AppError {
  constructor(message: string) {
    super(
      'DATABASE_ERROR',
      message,
      500,
      'データの保存に失敗しました。もう一度お試しください。'
    );
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
