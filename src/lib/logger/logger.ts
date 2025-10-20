/**
 * アプリケーション全体で使用するロギングユーティリティ
 */

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  message: string;
  timestamp: string;
  stack?: string;
  context?: LogContext;
}

/**
 * エラーをログに記録
 * @param error エラーオブジェクト
 * @param context 追加のコンテキスト情報
 */
export function logError(error: Error, context?: LogContext): void {
  const logEntry: LogEntry = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  };

  if (context) {
    logEntry.context = context;
  }

  console.error('[ERROR]', logEntry);

  // 本番環境では外部ログサービスに送信
  if (process.env.NODE_ENV === 'production') {
    // TODO: Sentry, LogRocket, Datadog等への送信実装
    // Sentry.captureException(error, { extra: context });
  }
}

/**
 * 情報ログを記録
 * @param message ログメッセージ
 * @param context 追加のコンテキスト情報
 */
export function logInfo(message: string, context?: LogContext): void {
  const logEntry: LogEntry = {
    message,
    timestamp: new Date().toISOString(),
  };

  if (context) {
    logEntry.context = context;
  }

  console.log('[INFO]', logEntry);
}

/**
 * 警告ログを記録
 * @param message 警告メッセージ
 * @param context 追加のコンテキスト情報
 */
export function logWarning(message: string, context?: LogContext): void {
  const logEntry: LogEntry = {
    message,
    timestamp: new Date().toISOString(),
  };

  if (context) {
    logEntry.context = context;
  }

  console.warn('[WARNING]', logEntry);
}
