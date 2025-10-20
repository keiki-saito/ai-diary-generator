import { getDiaries } from '@/app/actions/diary';
import { DiaryCard } from '@/components/diary';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DiariesPage() {
  let diaries;

  try {
    diaries = await getDiaries();
  } catch (error) {
    // 認証エラーの場合はログインページにリダイレクト
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">日記一覧</h1>
          <Link href="/diaries/new">
            <Button>新規作成</Button>
          </Link>
        </div>

        {/* 日記一覧 */}
        {diaries.length === 0 ? (
          // 空状態
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">
                まだ日記がありません
              </h2>
              <p className="text-gray-600">
                最初の日記を作成して、あなたの日々を記録しましょう
              </p>
              <div className="pt-4">
                <Link href="/diaries/new">
                  <Button size="lg">最初の日記を作成</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // 日記カードグリッド
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diaries.map((diary) => (
              <DiaryCard
                key={diary.id}
                id={diary.id}
                date={diary.date}
                contentPreview={diary.content.substring(0, 100)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
