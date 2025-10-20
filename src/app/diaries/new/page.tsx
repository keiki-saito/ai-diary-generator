import { Card } from '@/components/ui';
import NewDiaryForm from './NewDiaryForm';

export default function NewDiaryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">新規日記作成</h1>
          <p className="mt-2 text-gray-600">
            今日の出来事や感情を入力して、AIに日記を生成してもらいましょう
          </p>
        </div>

        <Card>
          <NewDiaryForm />
        </Card>
      </div>
    </div>
  );
}
