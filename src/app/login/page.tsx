import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'ログイン - AI日記',
  description: 'AI日記にログイン',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            AI日記
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            アカウントにログイン
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
