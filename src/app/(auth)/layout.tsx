import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-4">
        <div className="mx-auto max-w-md">
          <Link href="/" className="text-xl font-bold text-primary">
            チー牛農場
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-4 text-center text-sm text-muted-foreground">
        <p>映えなくていい。自分らしくいられる場所。</p>
      </footer>
    </div>
  );
}
