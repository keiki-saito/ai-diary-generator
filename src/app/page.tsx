import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui';

export default async function Home() {
  // 認証状態を確認
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* ヘッダー */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
            AI日記
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 px-4">
            少ない入力からAIがあなたの日記を自動生成
          </p>
        </div>

        {/* 特徴説明 */}
        <div className="grid md:grid-cols-3 gap-6 py-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-900/50 transition-colors">
            <div className="text-4xl mb-3">✍️</div>
            <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-100">簡単入力</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              今日の出来事を一言入力するだけ
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-900/50 transition-colors">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-100">AI自動生成</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              Claude Sonnet 4が豊かな日記を作成
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-900/50 transition-colors">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-100">簡単管理</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              過去の日記を一覧で振り返り
            </p>
          </div>
        </div>

        {/* CTAボタン */}
        <div className="space-y-4">
          {user ? (
            // 認証済みユーザー向け
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/diaries/new">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  新しい日記を作成
                </Button>
              </Link>
              <Link href="/diaries">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                  日記一覧を見る
                </Button>
              </Link>
            </div>
          ) : (
            // 未認証ユーザー向け
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  新規登録
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                  ログイン
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* 補足説明 */}
        {!user && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            無料で始められます。メールアドレスとパスワードのみで登録完了
          </p>
        )}
      </div>
    </main>
  );
}
