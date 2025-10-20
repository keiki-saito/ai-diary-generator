import {
  AppError,
  ValidationError,
  AuthenticationError,
  AIGenerationError,
  DatabaseError,
} from '../errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    test('正しいプロパティを持つ', () => {
      const error = new AppError('TEST_CODE', 'Test message', 400, 'User message');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe('TEST_CODE');
      expect(error.message).toBe('Test message');
      expect(error.statusCode).toBe(400);
      expect(error.userMessage).toBe('User message');
      expect(error.name).toBe('AppError');
    });
  });

  describe('ValidationError', () => {
    test('正しいステータスコードとメッセージを設定', () => {
      const error = new ValidationError(
        'Input validation failed',
        '入力が無効です'
      );

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe('Input validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.userMessage).toBe('入力が無効です');
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('AuthenticationError', () => {
    test('正しいステータスコードとデフォルトメッセージを設定', () => {
      const error = new AuthenticationError();

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
      expect(error.userMessage).toBe('ログインが必要です。');
      expect(error.name).toBe('AuthenticationError');
    });

    test('カスタムメッセージを設定できる', () => {
      const error = new AuthenticationError('Token expired');

      expect(error.message).toBe('Token expired');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('AIGenerationError', () => {
    test('正しいステータスコードとメッセージを設定', () => {
      const error = new AIGenerationError(
        'LLM API failed',
        '日記の生成に失敗しました'
      );

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(AIGenerationError);
      expect(error.code).toBe('AI_GENERATION_ERROR');
      expect(error.message).toBe('LLM API failed');
      expect(error.statusCode).toBe(500);
      expect(error.userMessage).toBe('日記の生成に失敗しました');
      expect(error.name).toBe('AIGenerationError');
    });
  });

  describe('DatabaseError', () => {
    test('正しいステータスコードとメッセージを設定', () => {
      const error = new DatabaseError('Connection timeout');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.message).toBe('Connection timeout');
      expect(error.statusCode).toBe(500);
      expect(error.userMessage).toBe(
        'データの保存に失敗しました。もう一度お試しください。'
      );
      expect(error.name).toBe('DatabaseError');
    });
  });
});
