'use client';

import { useRef } from 'react';

import { PostForm } from '@/components/feed/PostForm';
import { Timeline, TimelineRef } from '@/components/feed/Timeline';
import type { Post, Profile } from '@/types/database';

interface PostWithAuthor extends Post {
  profiles: Profile;
  reactions: { type: string; user_id: string }[];
  comments: { id: string }[];
}

interface FeedContentClientProps {
  initialPosts: PostWithAuthor[];
  currentUserId?: string;
  tagFilter?: string;
}

export function FeedContentClient({
  initialPosts,
  currentUserId,
  tagFilter,
}: FeedContentClientProps) {
  const timelineRef = useRef<{ refresh: () => void }>(null);

  const handlePostCreated = () => {
    timelineRef.current?.refresh();
  };

  return (
    <>
      <div className="mb-6">
        <PostForm onPostCreated={handlePostCreated} />
      </div>

      <Timeline
        ref={timelineRef}
        initialPosts={initialPosts}
        currentUserId={currentUserId}
        tagFilter={tagFilter}
      />
    </>
  );
}
