import { redirect } from 'next/navigation';

import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null };

  // If no username, redirect to setup
  if (!profile?.username) {
    redirect('/setup');
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={user} profile={profile} />

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      </div>

      {/* Mobile navigation - visible only on mobile */}
      <MobileNav />
    </div>
  );
}
