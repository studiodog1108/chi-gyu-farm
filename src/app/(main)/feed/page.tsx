import { Suspense } from 'react';

import { PostForm } from '@/components/feed/PostForm';
import { Timeline } from '@/components/feed/Timeline';
import { getHobbyTagById } from '@/constants';
import { createClient } from '@/lib/supabase/server';

interface FeedPageProps {
  searchParams: Promise<{ tag?: string }>;
}

async function FeedContent({ tagFilter }: { tagFilter?: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from('posts')
    .select(
      `
      *,
      profiles (*),
      reactions (type, user_id),
      comments (id)
    `
    )
    .order('created_at', { ascending: false })
    .limit(20);

  if (tagFilter) {
    query = query.contains('hobby_tags', [tagFilter]);
  }

  const { data: posts } = await query;

  return (
    <Timeline
      initialPosts={posts ?? []}
      currentUserId={user?.id}
      tagFilter={tagFilter}
    />
  );
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const { tag } = await searchParams;
  const selectedTag = tag ? getHobbyTagById(tag) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Tag filter indicator */}
      {selectedTag && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-muted px-4 py-2">
          <span className="text-sm">
            <span className="mr-2">{selectedTag.emoji}</span>
            <span className="font-medium">{selectedTag.label}</span>
            の投稿を表示中
          </span>
          <a
            href="/feed"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            フィルターを解除
          </a>
        </div>
      )}

      {/* Post form */}
      <div className="mb-6">
        <PostForm />
      </div>

      {/* Timeline */}
      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        }
      >
        <FeedContent tagFilter={tag} />
      </Suspense>
    </div>
  );
}
