import { generateDiaryPrompt } from '../prompt';

describe('generateDiaryPrompt', () => {
  describe('プロンプト生成', () => {
    test('ユーザー入力と日付から正しいプロンプトを生成する', () => {
      const userInput = '今日は天気が良かったので、公園で散歩をした。';
      const date = new Date('2025-10-20');

      const prompt = generateDiaryPrompt(userInput, date);

      // プロンプトにユーザー入力が含まれていること
      expect(prompt).toContain(userInput);

      // プロンプトに日付情報が含まれていること
      expect(prompt).toContain('2025');
      expect(prompt).toContain('10');
      expect(prompt).toContain('20');

      // プロンプトに必須要素の指示が含まれていること
      expect(prompt).toContain('日記');
      expect(prompt).toContain('生成');
    });

    test('日付が日本語形式でフォーマットされる', () => {
      const userInput = 'テスト入力';
      const date = new Date('2025-01-01');

      const prompt = generateDiaryPrompt(userInput, date);

      // 日本語の日付フォーマットが含まれること
      expect(prompt).toMatch(/2025年/);
      expect(prompt).toMatch(/1月/);
    });

    test('文字数指定（500-800文字）が含まれる', () => {
      const userInput = 'テスト入力';
      const date = new Date('2025-10-20');

      const prompt = generateDiaryPrompt(userInput, date);

      expect(prompt).toContain('500');
      expect(prompt).toContain('800');
    });

    test('プロンプトに必須の生成条件が含まれる', () => {
      const userInput = 'テスト入力';
      const date = new Date('2025-10-20');

      const prompt = generateDiaryPrompt(userInput, date);

      // 生成条件が含まれていること
      expect(prompt).toContain('自然');
      expect(prompt).toContain('一人称');
      expect(prompt).toContain('段落');
    });
  });

  describe('エッジケース', () => {
    test('空のユーザー入力でもプロンプトが生成される', () => {
      const userInput = '';
      const date = new Date('2025-10-20');

      const prompt = generateDiaryPrompt(userInput, date);

      expect(prompt).toBeTruthy();
      expect(prompt.length).toBeGreaterThan(0);
    });

    test('長いユーザー入力も正しく処理される', () => {
      const userInput = 'あ'.repeat(1000);
      const date = new Date('2025-10-20');

      const prompt = generateDiaryPrompt(userInput, date);

      expect(prompt).toContain(userInput);
    });

    test('特殊文字を含むユーザー入力も正しく処理される', () => {
      const userInput = '今日は「特別な日」だった！\\n改行もあり。';
      const date = new Date('2025-10-20');

      const prompt = generateDiaryPrompt(userInput, date);

      expect(prompt).toContain(userInput);
    });
  });
});
