'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { useState } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // クライアント側で直接Supabaseのログアウトを実行
      const supabase = createBrowserClient();
      await supabase.auth.signOut();

      // ログインページにリダイレクト
      router.push('/login');
      router.refresh();
    } catch {
      // エラーが発生してもログインページにリダイレクト
      router.push('/login');
      setIsLoading(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* ロゴとナビゲーション */}
          <div className="flex">
            {/* ロゴ */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/diaries" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                AI日記
              </Link>
            </div>

            {/* ナビゲーションリンク（デスクトップ） */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/diaries"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/diaries')
                    ? 'border-primary-500 text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                日記一覧
              </Link>
              <Link
                href="/diaries/new"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/diaries/new')
                    ? 'border-primary-500 text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                新規作成
              </Link>
            </div>
          </div>

          {/* テーマトグルとログアウトボタン */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'ログアウト中...' : 'ログアウト'}
            </button>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 pt-4 pb-3 space-y-1">
          <Link
            href="/diaries"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/diaries')
                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            日記一覧
          </Link>
          <Link
            href="/diaries/new"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/diaries/new')
                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            新規作成
          </Link>
        </div>
      </nav>
    </header>
  );
}
