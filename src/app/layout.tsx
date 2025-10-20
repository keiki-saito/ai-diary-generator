import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI日記 - AI自動日記生成アプリ',
  description: 'AIがあなたの日記を自動生成します',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
