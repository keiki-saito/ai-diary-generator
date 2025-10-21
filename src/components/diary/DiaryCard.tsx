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
    <Card className="hover:shadow-lg dark:hover:shadow-gray-900/70 transition-all duration-200 hover:scale-[1.02]">
      <article className="space-y-3">
        <div className="flex items-center justify-between">
          <time
            className="text-sm font-medium text-primary-600 dark:text-primary-400"
            dateTime={date.toISOString()}
          >
            {formattedDate}
          </time>
        </div>
        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{contentPreview}</p>
        <div className="pt-2">
          <Link
            href={`/diaries/${id}`}
            className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors duration-150"
            aria-label={`${formattedDate}の日記を読む`}
          >
            詳細を見る →
          </Link>
        </div>
      </article>
    </Card>
  );
}
