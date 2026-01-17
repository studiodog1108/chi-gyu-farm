import type { Metadata, Viewport } from 'next';
import { DotGothic16 } from 'next/font/google';

import './globals.css';

const dotGothic16 = DotGothic16({
  weight: ['400'],
  preload: true,
  display: 'swap',
  variable: '--font-dot-gothic',
});

export const metadata: Metadata = {
  title: {
    default: 'チー牛農場 - 静かなインターネット',
    template: '%s | チー牛農場',
  },
  description:
    '外向的な社交プレッシャーのない、安心できるオンライン空間。静かな趣味を持つ人々のためのSNS。',
  // Search engine blocking
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  // No OpenGraph for privacy
  openGraph: undefined,
  twitter: undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${dotGothic16.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
