import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { UserCard } from '@/components/profile/UserCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

interface FollowersPageProps {
  params: Promise<{ id: string }>;
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the profile owner
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', id)
    .single() as { data: { username: string; display_name: string | null } | null; error: unknown };

  if (error || !profile) {
    notFound();
  }

  // Get followers
  const { data: followers } = await supabase
    .from('follows')
    .select('follower_id, profiles!follows_follower_id_fkey (*)')
    .eq('following_id', id) as {
      data: Array<{
        follower_id: string;
        profiles: Profile;
      }> | null;
    };

  // Get current user's following list to check follow status
  let currentUserFollowing: Set<string> = new Set();
  if (user) {
    const { data: followingData } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id) as { data: { following_id: string }[] | null };
    currentUserFollowing = new Set(
      followingData?.map((f) => f.following_id) ?? []
    );
  }

  const displayName = profile.display_name ?? profile.username;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Back button */}
      <Link
        href={`/profile/${id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {displayName}のプロフィールに戻る
      </Link>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>フォロワー ({followers?.length ?? 0})</CardTitle>
        </CardHeader>

        <CardContent>
          {followers && followers.length > 0 ? (
            <div className="divide-y divide-border">
              {followers.map((follow) => (
                <UserCard
                  key={follow.follower_id}
                  user={follow.profiles}
                  currentUserId={user?.id}
                  isFollowing={currentUserFollowing.has(follow.follower_id)}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              まだフォロワーがいません
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
