import { getDiary, deleteDiary } from '@/app/actions/diary';
import { Button, Card } from '@/components/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DeleteButton from './DeleteButton';

export default async function DiaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let diary;

  try {
    diary = await getDiary(id);
  } catch (error) {
    // 日記が見つからない、または認証エラー
    redirect('/diaries');
  }

  const formattedDate = diary.date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link
            href="/diaries"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            一覧に戻る
          </Link>
        </div>

        <Card>
          {/* 日付とアクションボタン */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <time className="text-2xl font-bold text-gray-900">
                {formattedDate}
              </time>
              <p className="text-sm text-gray-500 mt-1">
                作成日: {diary.created_at.toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href={`/diaries/${id}/edit`}>
                <Button variant="secondary">編集</Button>
              </Link>
              <DeleteButton diaryId={id} />
            </div>
          </div>

          {/* ユーザー入力 */}
          {diary.user_input && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                メモ
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {diary.user_input}
              </p>
            </div>
          )}

          {/* 日記本文 */}
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {diary.content}
            </div>
          </div>

          {/* 更新日時 */}
          {diary.updated_at.getTime() !== diary.created_at.getTime() && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                最終更新: {diary.updated_at.toLocaleString('ja-JP')}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
