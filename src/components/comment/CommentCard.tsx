'use client';

import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

interface CommentCardProps {
  comment: {
    id: string;
    content: string;
    is_anonymous: boolean;
    created_at: string;
    user_id: string;
    profiles: Profile;
  };
  currentUserId?: string;
  onDeleted?: () => void;
}

export function CommentCard({
  comment,
  currentUserId,
  onDeleted,
}: CommentCardProps) {
  const [isPending, startTransition] = useTransition();

  const isOwner = currentUserId === comment.user_id;
  const isAnonymous = comment.is_anonymous;

  const displayName = isAnonymous
    ? '匿名さん'
    : comment.profiles.display_name ?? comment.profiles.username ?? '不明';

  const initials = isAnonymous
    ? '匿'
    : displayName.slice(0, 2);

  const handleDelete = () => {
    if (!confirm('このコメントを削除しますか？')) return;

    startTransition(async () => {
      const supabase = createClient();
      await supabase.from('comments').delete().eq('id', comment.id);
      onDeleted?.();
    });
  };

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <div className="flex gap-3 py-3">
      {/* Avatar */}
      {isAnonymous ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      ) : (
        <Link href={`/profile/${comment.user_id}`}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={comment.profiles.avatar_url ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {isAnonymous ? (
            <span className="text-sm text-muted-foreground">{displayName}</span>
          ) : (
            <Link
              href={`/profile/${comment.user_id}`}
              className="text-sm font-medium hover:underline"
            >
              {displayName}
            </Link>
          )}
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
      </div>

      {/* Delete button */}
      {isOwner && (
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="削除"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
