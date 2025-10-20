'use client';

import { useRouter } from 'next/navigation';
import { DiaryEditor } from '@/components/diary';
import { updateDiary } from '@/app/actions/diary';
import { useState } from 'react';
import type { Diary } from '@/types';

export default function EditDiaryForm({
  diaryId,
  initialData,
}: {
  diaryId: string;
  initialData: Diary;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: {
    date: Date;
    userInput: string;
    content: string;
  }) => {
    setIsSaving(true);
    setError(null);

    const result = await updateDiary(diaryId, {
      user_input: data.userInput,
      content: data.content,
    });

    if (result.success) {
      router.push(`/diaries/${diaryId}`);
      router.refresh();
    } else {
      setError(result.error);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <DiaryEditor
        initialDate={initialData.date}
        initialUserInput={initialData.user_input}
        initialContent={initialData.content}
        onSave={handleSave}
      />

      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <p className="text-gray-900">保存中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
