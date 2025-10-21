import { getDiary } from '@/app/actions/diary';
import { Card } from '@/components/ui';
import { redirect } from 'next/navigation';
import EditDiaryForm from './EditDiaryForm';

export default async function EditDiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let diary;

  try {
    diary = await getDiary(id);
  } catch {
    redirect('/diaries');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">日記を編集</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {diary.date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <Card>
          <EditDiaryForm diaryId={id} initialData={diary} />
        </Card>
      </div>
    </div>
  );
}
