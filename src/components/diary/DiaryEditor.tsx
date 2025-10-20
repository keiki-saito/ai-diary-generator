'use client';

import { useState, useEffect } from 'react';
import { Input, Textarea, Button, Spinner, Card } from '@/components/ui';
import type { AIGenerationState } from '@/types';

export interface DiaryEditorProps {
  initialDate?: Date;
  initialUserInput?: string;
  initialContent?: string;
  onSave?: (data: { date: Date; userInput: string; content: string }) => void;
  readOnly?: boolean;
}

export default function DiaryEditor({
  initialDate,
  initialUserInput = '',
  initialContent = '',
  onSave,
  readOnly = false,
}: DiaryEditorProps) {
  // フォーム状態
  const [date, setDate] = useState<string>('');
  const [userInput, setUserInput] = useState<string>(initialUserInput);
  const [content, setContent] = useState<string>(initialContent);

  // クライアントサイドでのみ日付を初期化（Hydration エラー回避）
  useEffect(() => {
    const dateToUse = initialDate || new Date();
    setDate(dateToUse.toISOString().split('T')[0]);
  }, [initialDate]);

  // AI生成状態
  const [aiState, setAiState] = useState<AIGenerationState>({
    status: 'idle',
    content: null,
    error: null,
  });

  // 処理時間カウント
  const [processingTime, setProcessingTime] = useState<number>(0);

  // 文字数カウント
  const userInputLength = userInput.trim().length;
  const isUserInputValid = userInputLength > 0;

  /**
   * AI生成を実行
   */
  const handleGenerate = async () => {
    if (!isUserInputValid) return;

    setAiState({
      status: 'loading',
      content: null,
      error: null,
    });
    setProcessingTime(0);

    // 15秒カウンター開始
    const timer = setInterval(() => {
      setProcessingTime((prev) => prev + 1);
    }, 1000);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput.trim(),
          date,
        }),
      });

      clearInterval(timer);

      const data = await response.json();

      if (!response.ok || !data.success) {
        setAiState({
          status: 'error',
          content: null,
          error: data.error || '日記の生成に失敗しました',
        });
        return;
      }

      setAiState({
        status: 'success',
        content: data.content,
        error: null,
      });
    } catch (error) {
      clearInterval(timer);
      setAiState({
        status: 'error',
        content: null,
        error: '通信エラーが発生しました。もう一度お試しください。',
      });
    }
  };

  /**
   * 生成された日記を採用
   */
  const handleAdopt = () => {
    if (aiState.content) {
      setContent(aiState.content);
      setAiState({
        status: 'idle',
        content: null,
        error: null,
      });
    }
  };

  /**
   * 再生成
   */
  const handleRegenerate = () => {
    handleGenerate();
  };

  /**
   * 保存
   */
  const handleSave = () => {
    if (onSave) {
      onSave({
        date: new Date(date),
        userInput,
        content,
      });
    }
  };

  // 保存可能かチェック
  const canSave = content.trim().length > 0 && userInput.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* 日付選択 */}
      <Input
        type="date"
        label="日付"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={readOnly}
      />

      {/* ユーザー入力エリア */}
      <Textarea
        label="今日の出来事や感情"
        placeholder="今日あった出来事や感じたことを簡潔に入力してください。AIがこの内容を元に日記を生成します。"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={5}
        disabled={readOnly}
        showCharCount
      />

      {/* AI生成ボタン */}
      {!readOnly && (
        <div>
          <Button
            onClick={handleGenerate}
            disabled={!isUserInputValid || aiState.status === 'loading'}
            isLoading={aiState.status === 'loading'}
          >
            {aiState.status === 'loading'
              ? processingTime >= 15
                ? `処理中... (${processingTime}秒)`
                : 'AI生成中...'
              : 'AI生成'}
          </Button>
        </div>
      )}

      {/* AI生成結果プレビュー */}
      {aiState.status === 'success' && aiState.content && (
        <Card className="bg-blue-50 border border-blue-200">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                生成された日記
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {aiState.content}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleAdopt} variant="primary">
                採用
              </Button>
              <Button onClick={handleRegenerate} variant="secondary">
                再生成
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* エラー表示 */}
      {aiState.status === 'error' && aiState.error && (
        <Card className="bg-red-50 border border-red-200">
          <div className="flex items-start space-x-3">
            <svg
              className="h-5 w-5 text-red-400 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                エラーが発生しました
              </h3>
              <p className="mt-1 text-sm text-red-700">{aiState.error}</p>
              <div className="mt-3">
                <Button onClick={handleRegenerate} variant="secondary" size="sm">
                  再試行
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 日記本文エディタ */}
      <Textarea
        label="日記本文"
        placeholder="AI生成した日記がここに表示されます。手動で編集することもできます。"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={15}
        disabled={readOnly}
        showCharCount
      />

      {/* 保存ボタン */}
      {!readOnly && onSave && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!canSave} size="lg">
            保存
          </Button>
        </div>
      )}
    </div>
  );
}
