import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FollowButton } from '@/components/profile/FollowButton';
import { PostCard } from '@/components/feed/PostCard';
import { getHobbyTagById } from '@/constants';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get profile
  const { data: profile, error } = (await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()) as { data: Profile | null; error: unknown };

  if (error || !profile) {
    notFound();
  }

  // Get user's posts
  const { data: posts } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles (*),
      reactions (type, user_id),
      comments (id)
    `
    )
    .eq('user_id', id)
    .eq('is_anonymous', false)
    .order('created_at', { ascending: false })
    .limit(20) as { data: Array<{
      id: string;
      user_id: string;
      content: string;
      is_anonymous: boolean;
      images: string[];
      hobby_tags: string[];
      created_at: string;
      updated_at: string;
      profiles: Profile;
      reactions: { type: string; user_id: string }[];
      comments: { id: string }[];
    }> | null };

  // Get follow counts
  const [{ count: followersCount }, { count: followingCount }] =
    await Promise.all([
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', id),
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', id),
    ]);

  // Check if current user is following
  let isFollowing = false;
  if (user && user.id !== id) {
    const { data } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', user.id)
      .eq('following_id', id)
      .single();
    isFollowing = !!data;
  }

  const isOwnProfile = user?.id === id;
  const displayName = profile.display_name ?? profile.username ?? '不明';
  const initials = displayName.slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Profile header */}
      <Card className="mb-6 border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 sm:h-20 sm:w-20">
              <AvatarImage src={profile.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="mt-4 flex-1 text-center sm:mt-0 sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold">{displayName}</h1>
                  <p className="text-sm text-muted-foreground">
                    @{profile.username}
                  </p>
                </div>

                {!isOwnProfile && user && (
                  <FollowButton
                    targetUserId={id}
                    isFollowing={isFollowing}
                  />
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-3 whitespace-pre-wrap text-sm">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="mt-4 flex justify-center gap-6 text-sm sm:justify-start">
                <div>
                  <span className="font-bold">{posts?.length ?? 0}</span>
                  <span className="ml-1 text-muted-foreground">投稿</span>
                </div>
                <Link
                  href={`/profile/${id}/followers`}
                  className="hover:underline"
                >
                  <span className="font-bold">{followersCount ?? 0}</span>
                  <span className="ml-1 text-muted-foreground">フォロワー</span>
                </Link>
                <Link
                  href={`/profile/${id}/following`}
                  className="hover:underline"
                >
                  <span className="font-bold">{followingCount ?? 0}</span>
                  <span className="ml-1 text-muted-foreground">フォロー中</span>
                </Link>
              </div>

              {/* Hobby tags */}
              {profile.hobby_tags && profile.hobby_tags.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                  {profile.hobby_tags.map((tagId) => {
                    const tag = getHobbyTagById(tagId);
                    if (!tag) return null;
                    return (
                      <Badge key={tagId} variant="secondary" className="text-xs">
                        {tag.emoji} {tag.label}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div>
        <h2 className="mb-4 text-lg font-medium">投稿</h2>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            まだ投稿がありません
          </div>
        )}
      </div>
    </div>
  );
}
