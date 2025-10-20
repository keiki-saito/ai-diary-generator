import { AIGenerationService } from '../service';
import { AIGenerationError } from '@/types/errors';
import Anthropic from '@anthropic-ai/sdk';

// Anthropic SDKをモック
jest.mock('@anthropic-ai/sdk');

describe('AIGenerationService', () => {
  let service: AIGenerationService;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();

    // Anthropicクライアントのモック
    mockCreate = jest.fn();
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => ({
      messages: {
        create: mockCreate,
      },
    } as unknown as Anthropic));

    service = new AIGenerationService();
  });

  describe('generateDiary', () => {
    test('正常系: LLM APIから日記を生成できる', async () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: '今日は素晴らしい一日だった。朝から天気が良く、公園で散歩を楽しんだ。新緑の香りが心地よく、リフレッシュすることができた。午後は友人とカフェで過ごし、楽しい時間を過ごすことができた。充実した一日に感謝している。'.repeat(5), // 500文字以上
          },
        ],
        usage: {
          input_tokens: 100,
          output_tokens: 200,
        },
      };

      mockCreate.mockResolvedValue(mockResponse);

      const result = await service.generateDiary({
        userInput: '天気が良かった',
        date: new Date('2025-10-20'),
      });

      expect(result.content).toBeTruthy();
      expect(result.content.length).toBeGreaterThanOrEqual(500);
      expect(result.content.length).toBeLessThanOrEqual(1000);
      expect(result.tokensUsed).toBe(300);
    });

    test('異常系: 生成された日記が短すぎる場合エラー', async () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: '短いテキスト', // 500文字未満
          },
        ],
        usage: {
          input_tokens: 100,
          output_tokens: 50,
        },
      };

      mockCreate.mockResolvedValue(mockResponse);

      await expect(
        service.generateDiary({
          userInput: '天気が良かった',
          date: new Date('2025-10-20'),
        })
      ).rejects.toThrow(AIGenerationError);

      await expect(
        service.generateDiary({
          userInput: '天気が良かった',
          date: new Date('2025-10-20'),
        })
      ).rejects.toThrow('Generated diary is too short');
    });

    test('異常系: 生成された日記が長すぎる場合エラー', async () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: 'あ'.repeat(1500), // 1000文字超過
          },
        ],
        usage: {
          input_tokens: 100,
          output_tokens: 500,
        },
      };

      mockCreate.mockResolvedValue(mockResponse);

      await expect(
        service.generateDiary({
          userInput: '天気が良かった',
          date: new Date('2025-10-20'),
        })
      ).rejects.toThrow(AIGenerationError);

      await expect(
        service.generateDiary({
          userInput: '天気が良かった',
          date: new Date('2025-10-20'),
        })
      ).rejects.toThrow('Generated diary is too long');
    });

    test('異常系: LLM APIがテキスト以外のレスポンスを返した場合', async () => {
      const mockResponse = {
        content: [
          {
            type: 'image', // テキスト以外
            source: {},
          },
        ],
        usage: {
          input_tokens: 100,
          output_tokens: 0,
        },
      };

      mockCreate.mockResolvedValue(mockResponse);

      await expect(
        service.generateDiary({
          userInput: '天気が良かった',
          date: new Date('2025-10-20'),
        })
      ).rejects.toThrow(AIGenerationError);
    });

    test('異常系: タイムアウトエラー', async () => {
      // 30秒以上かかるモック
      mockCreate.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ content: [], usage: {} }), 31000);
          })
      );

      await expect(
        service.generateDiary({
          userInput: '天気が良かった',
          date: new Date('2025-10-20'),
        })
      ).rejects.toThrow('timed out');
    }, 35000); // Jest timeout extended

    test('異常系: レートリミットエラー', async () => {
      const error = new Error('rate_limit exceeded');
      mockCreate.mockRejectedValue(error);

      await expect(
        service.generateDiary({
          userInput: '天気が良かった',
          date: new Date('2025-10-20'),
        })
      ).rejects.toThrow('Rate limit exceeded');
    });

    test('異常系: 認証エラー', async () => {
      const error = new Error('authentication failed: invalid api_key');
      mockCreate.mockRejectedValue(error);

      await expect(
        service.generateDiary({
          userInput: '天気が良かった',
          date: new Date('2025-10-20'),
        })
      ).rejects.toThrow('Authentication failed');
    });

    test('カスタムパラメータ（maxTokens, temperature）が使用される', async () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: '今日は素晴らしい一日だった。'.repeat(50), // 500文字以上
          },
        ],
        usage: {
          input_tokens: 100,
          output_tokens: 200,
        },
      };

      mockCreate.mockResolvedValue(mockResponse);

      await service.generateDiary({
        userInput: '天気が良かった',
        date: new Date('2025-10-20'),
        maxTokens: 1500,
        temperature: 0.9,
      });

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          max_tokens: 1500,
          temperature: 0.9,
        })
      );
    });
  });
});
