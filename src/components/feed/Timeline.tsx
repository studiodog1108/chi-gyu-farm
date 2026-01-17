'use client';

import { useEffect, useImperativeHandle, useState, useTransition, forwardRef } from 'react';

import { PostCard } from '@/components/feed/PostCard';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { Post, Profile } from '@/types/database';

interface PostWithAuthor extends Post {
  profiles: Profile;
  reactions: { type: string; user_id: string }[];
  comments: { id: string }[];
}

export interface TimelineRef {
  refresh: () => void;
}

interface TimelineProps {
  initialPosts: PostWithAuthor[];
  currentUserId?: string;
  tagFilter?: string;
}

const PAGE_SIZE = 20;

export const Timeline = forwardRef<TimelineRef, TimelineProps>((
  {
    initialPosts,
    currentUserId,
    tagFilter,
  }: TimelineProps,
  ref
) => {
  const [posts, setPosts] = useState<PostWithAuthor[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialPosts.length >= PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  // Reset posts when tag filter changes
  useEffect(() => {
    setPosts(initialPosts);
    setHasMore(initialPosts.length >= PAGE_SIZE);
  }, [initialPosts, tagFilter]);

  const loadMore = () => {
    if (isPending || !hasMore) return;

    startTransition(async () => {
      const supabase = createClient();
      const lastPost = posts[posts.length - 1];

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
        .lt('created_at', lastPost?.created_at)
        .limit(PAGE_SIZE);

      if (tagFilter) {
        query = query.contains('hobby_tags', [tagFilter]);
      }

      const { data } = await query;

      if (data) {
        setPosts((prev) => [...prev, ...(data as PostWithAuthor[])]);
        setHasMore(data.length >= PAGE_SIZE);
      }
    });
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const refresh = async () => {
    const supabase = createClient();
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
      .limit(PAGE_SIZE);

    if (tagFilter) {
      query = query.contains('hobby_tags', [tagFilter]);
    }

    const { data } = await query;

    if (data) {
      setPosts(data as PostWithAuthor[]);
      setHasMore(data.length >= PAGE_SIZE);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {tagFilter
            ? 'このタグの投稿はまだありません'
            : 'まだ投稿がありません。最初の投稿をしてみましょう！'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onDelete={() => handlePostDeleted(post.id)}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isPending}
          >
            {isPending ? '読み込み中...' : 'もっと見る'}
          </Button>
        </div>
      )}
    </div>
  );
});

Timeline.displayName = 'Timeline';
