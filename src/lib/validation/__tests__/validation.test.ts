import {
  validateUserInput,
  validateDate,
  validateDiaryContent,
  ValidationResult,
} from '../validation';

describe('Validation', () => {
  describe('validateUserInput', () => {
    test('正常系: 有効なユーザー入力', () => {
      const result = validateUserInput('今日は良い天気だった');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('異常系: 空文字列', () => {
      const result = validateUserInput('');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('入力内容は1文字以上である必要があります');
    });

    test('異常系: スペースのみ', () => {
      const result = validateUserInput('   ');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('入力内容は1文字以上である必要があります');
    });

    test('正常系: 1文字', () => {
      const result = validateUserInput('あ');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('正常系: 長いテキスト', () => {
      const longText = 'あ'.repeat(10000);
      const result = validateUserInput(longText);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('異常系: null', () => {
      const result = validateUserInput(null as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('入力内容は文字列である必要があります');
    });

    test('異常系: undefined', () => {
      const result = validateUserInput(undefined as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('入力内容は文字列である必要があります');
    });
  });

  describe('validateDate', () => {
    test('正常系: 有効な日付文字列（YYYY-MM-DD）', () => {
      const result = validateDate('2025-10-20');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('異常系: 不正な形式', () => {
      const result = validateDate('2025/10/20');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('日付はYYYY-MM-DD形式である必要があります');
    });

    test('異常系: 無効な日付', () => {
      const result = validateDate('2025-02-30');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('有効な日付を指定してください');
    });

    test('異常系: 空文字列', () => {
      const result = validateDate('');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('日付は必須です');
    });

    test('異常系: null', () => {
      const result = validateDate(null as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('日付は必須です');
    });

    test('正常系: 過去の日付', () => {
      const result = validateDate('2020-01-01');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('正常系: 今日の日付', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = validateDate(today);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateDiaryContent', () => {
    test('正常系: 有効な日記内容', () => {
      const result = validateDiaryContent('今日は良い一日だった。');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('異常系: 空文字列', () => {
      const result = validateDiaryContent('');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('日記内容は1文字以上である必要があります');
    });

    test('異常系: スペースのみ', () => {
      const result = validateDiaryContent('   ');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('日記内容は1文字以上である必要があります');
    });

    test('正常系: 1文字', () => {
      const result = validateDiaryContent('あ');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('異常系: null', () => {
      const result = validateDiaryContent(null as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('日記内容は文字列である必要があります');
    });
  });
});
