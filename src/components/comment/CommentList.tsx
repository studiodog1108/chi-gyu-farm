'use client';

import { useEffect, useState } from 'react';

import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

interface CommentListProps {
  postId: string;
  currentUserId?: string;
}

interface CommentWithProfile {
  id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  user_id: string;
  profiles: Profile;
}

export function CommentList({ postId, currentUserId }: CommentListProps) {
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('comments')
      .select('*, profiles (*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true }) as {
        data: CommentWithProfile[] | null;
      };

    setComments(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3 py-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment form */}
      {currentUserId && (
        <CommentForm postId={postId} onCommentCreated={loadComments} />
      )}

      {/* Comments list */}
      <div className="divide-y divide-border">
        {comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            まだコメントがありません
          </p>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDeleted={loadComments}
            />
          ))
        )}
      </div>
    </div>
  );
}
