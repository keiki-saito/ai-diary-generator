import { Metadata } from 'next';
import SignUpForm from './SignUpForm';

export const metadata: Metadata = {
  title: 'サインアップ - AI日記',
  description: 'AI日記アカウントを作成',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            AI日記
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            アカウントを作成
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
