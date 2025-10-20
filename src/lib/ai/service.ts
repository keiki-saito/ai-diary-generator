import Anthropic from '@anthropic-ai/sdk';
import { generateDiaryPrompt } from './prompt';
import { AIGenerationError } from '@/types/errors';
import { logError, logInfo } from '@/lib/logger';
import type { GenerateDiaryOptions, GenerateDiaryResult } from '@/types';

/**
 * AI生成サービスクラス
 * LLM API（Claude API）との通信を抽象化
 */
export class AIGenerationService {
  private client: Anthropic;
  private readonly DEFAULT_MAX_TOKENS = 1000;
  private readonly DEFAULT_TEMPERATURE = 0.7;
  private readonly TIMEOUT_MS = 30000; // 30秒

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    this.client = new Anthropic({
      apiKey,
    });
  }

  /**
   * 日記を生成
   * @param options 生成オプション
   * @returns 生成された日記の内容とトークン使用量
   * @throws AIGenerationError 生成に失敗した場合
   */
  async generateDiary(options: GenerateDiaryOptions): Promise<GenerateDiaryResult> {
    const { userInput, date, maxTokens, temperature } = options;

    logInfo('Starting AI diary generation', {
      userInputLength: userInput.length,
      date: date.toISOString(),
    });

    // プロンプト生成
    const prompt = generateDiaryPrompt(userInput, date);

    try {
      // タイムアウト処理を含むAPI呼び出し
      const result = await this.callAPIWithTimeout(prompt, {
        maxTokens: maxTokens ?? this.DEFAULT_MAX_TOKENS,
        temperature: temperature ?? this.DEFAULT_TEMPERATURE,
      });

      return result;
    } catch (error) {
      if (error instanceof AIGenerationError) {
        logError(error as Error, { context: 'generateDiary' });
        throw error;
      }

      // その他のエラーをAIGenerationErrorでラップ
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const wrappedError = new AIGenerationError(
        `Failed to generate diary: ${errorMessage}`,
        '日記の生成に失敗しました。しばらく時間をおいてから再度お試しください。'
      );
      logError(wrappedError, { context: 'generateDiary', originalError: errorMessage });
      throw wrappedError;
    }
  }

  /**
   * タイムアウト付きでAPI呼び出し
   */
  private async callAPIWithTimeout(
    prompt: string,
    options: { maxTokens: number; temperature: number }
  ): Promise<GenerateDiaryResult> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new AIGenerationError(
            'API request timed out after 30 seconds',
            '日記の生成がタイムアウトしました。もう一度お試しください。'
          )
        );
      }, this.TIMEOUT_MS);
    });

    const apiPromise = this.callAPI(prompt, options);

    return Promise.race([apiPromise, timeoutPromise]);
  }

  /**
   * Claude APIを呼び出し
   */
  private async callAPI(
    prompt: string,
    options: { maxTokens: number; temperature: number }
  ): Promise<GenerateDiaryResult> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // レスポンスからテキストを抽出
      const content = response.content[0];
      if (content.type !== 'text') {
        throw new AIGenerationError(
          'Unexpected response type from Claude API',
          '日記の生成に失敗しました。もう一度お試しください。'
        );
      }

      const generatedText = content.text.trim();

      // 文字数チェック（500〜800文字の範囲）
      if (generatedText.length < 500) {
        throw new AIGenerationError(
          `Generated diary is too short: ${generatedText.length} characters`,
          '生成された日記が短すぎます。もう一度お試しください。'
        );
      }

      if (generatedText.length > 1000) {
        throw new AIGenerationError(
          `Generated diary is too long: ${generatedText.length} characters`,
          '生成された日記が長すぎます。もう一度お試しください。'
        );
      }

      return {
        content: generatedText,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      };
    } catch (error) {
      if (error instanceof AIGenerationError) {
        throw error;
      }

      // Anthropic SDKのエラーをハンドリング
      if (error instanceof Error) {
        // レート制限エラー
        if (error.message.includes('rate_limit')) {
          throw new AIGenerationError(
            'Rate limit exceeded',
            'APIの利用制限に達しました。しばらく時間をおいてから再度お試しください。'
          );
        }

        // 認証エラー
        if (error.message.includes('authentication') || error.message.includes('api_key')) {
          throw new AIGenerationError(
            'Authentication failed',
            'API認証に失敗しました。システム管理者にお問い合わせください。'
          );
        }
      }

      throw error;
    }
  }
}

// シングルトンインスタンス
let aiServiceInstance: AIGenerationService | null = null;

/**
 * AI生成サービスのシングルトンインスタンスを取得
 */
export function getAIService(): AIGenerationService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIGenerationService();
  }
  return aiServiceInstance;
}
