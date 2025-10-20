'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteDiary } from '@/app/actions/diary';
import { Button, Modal } from '@/components/ui';

export default function DeleteButton({ diaryId }: { diaryId: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    const result = await deleteDiary(diaryId);

    if (result.success) {
      router.push('/diaries');
      router.refresh();
    } else {
      setError(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setIsModalOpen(true)}
      >
        削除
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="日記を削除"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            この日記を削除してもよろしいですか？この操作は取り消せません。
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              {isDeleting ? '削除中...' : '削除する'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
