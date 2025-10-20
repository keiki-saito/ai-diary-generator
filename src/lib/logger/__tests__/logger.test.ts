import { logError, logInfo, logWarning } from '../logger';

// console.errorをモック
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  describe('logError', () => {
    test('エラーオブジェクトをコンソールに出力する', () => {
      const error = new Error('Test error');
      logError(error);

      expect(mockConsoleError).toHaveBeenCalledWith(
        '[ERROR]',
        expect.objectContaining({
          message: 'Test error',
          timestamp: expect.any(String),
        })
      );
    });

    test('コンテキスト情報を含めて出力できる', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'createDiary' };

      logError(error, context);

      expect(mockConsoleError).toHaveBeenCalledWith(
        '[ERROR]',
        expect.objectContaining({
          message: 'Test error',
          context,
          timestamp: expect.any(String),
        })
      );
    });

    test('スタックトレースを含む', () => {
      const error = new Error('Test error');
      logError(error);

      expect(mockConsoleError).toHaveBeenCalledWith(
        '[ERROR]',
        expect.objectContaining({
          stack: expect.any(String),
        })
      );
    });

    test('タイムスタンプがISO 8601形式である', () => {
      const error = new Error('Test error');
      logError(error);

      const loggedData = mockConsoleError.mock.calls[0][1];
      expect(loggedData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('logInfo', () => {
    test('情報メッセージをコンソールに出力する', () => {
      logInfo('Test info message');

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[INFO]',
        expect.objectContaining({
          message: 'Test info message',
          timestamp: expect.any(String),
        })
      );
    });

    test('コンテキスト情報を含めて出力できる', () => {
      const context = { feature: 'ai-generation' };
      logInfo('AI generation started', context);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[INFO]',
        expect.objectContaining({
          message: 'AI generation started',
          context,
        })
      );
    });
  });

  describe('logWarning', () => {
    test('警告メッセージをコンソールに出力する', () => {
      logWarning('Test warning');

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[WARNING]',
        expect.objectContaining({
          message: 'Test warning',
          timestamp: expect.any(String),
        })
      );
    });
  });
});
