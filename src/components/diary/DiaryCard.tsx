import Link from 'next/link';
import { Card } from '@/components/ui';

export interface DiaryCardProps {
  id: string;
  date: Date;
  contentPreview: string;
}

export default function DiaryCard({ id, date, contentPreview }: DiaryCardProps) {
  const formattedDate = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <time className="text-sm font-medium text-primary-600">
            {formattedDate}
          </time>
        </div>
        <p className="text-gray-700 line-clamp-3">{contentPreview}</p>
        <div className="pt-2">
          <Link
            href={`/diaries/${id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            詳細を見る →
          </Link>
        </div>
      </div>
    </Card>
  );
}
