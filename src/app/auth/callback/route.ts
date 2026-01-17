import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/feed';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed profile setup
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = (await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()) as { data: { username: string | null } | null };

        // If no username, redirect to profile setup
        if (!profile?.username) {
          return NextResponse.redirect(`${origin}/setup`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
