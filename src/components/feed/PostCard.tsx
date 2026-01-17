'use client';

import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MessageCircle, MoreHorizontal, Trash2, UserX } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReactionButtons } from '@/components/feed/ReactionButtons';
import { getHobbyTagById } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import type { Post, Profile } from '@/types/database';

interface PostWithAuthor extends Post {
  profiles: Profile;
  reactions: { type: string; user_id: string }[];
  comments: { id: string }[];
}

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId?: string;
  onDelete?: () => void;
}

export function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const [isDeleting, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);

  const isOwner = currentUserId === post.user_id;
  const author = post.profiles;
  const isAnonymous = post.is_anonymous;

  const displayName = isAnonymous
    ? '匿名ユーザー'
    : author.display_name ?? author.username ?? '不明';

  const initials = isAnonymous ? '?' : displayName.slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ja,
  });

  const handleDelete = () => {
    if (!confirm('この投稿を削除しますか？')) return;

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.from('posts').delete().eq('id', post.id);

      if (!error) {
        setIsDeleted(true);
        onDelete?.();
      }
    });
  };

  if (isDeleted) return null;

  return (
    <Card className="border-border">
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isAnonymous ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <UserX className="h-5 w-5 text-muted-foreground" />
              </div>
            ) : (
              <Link href={`/profile/${author.id}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={author.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}

            <div>
              {isAnonymous ? (
                <span className="font-medium text-muted-foreground">
                  匿名ユーザー
                </span>
              ) : (
                <Link
                  href={`/profile/${author.id}`}
                  className="font-medium hover:underline"
                >
                  {displayName}
                </Link>
              )}
              <div className="text-xs text-muted-foreground">
                {!isAnonymous && (
                  <span className="mr-2">@{author.username}</span>
                )}
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Actions menu */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? '削除中...' : '削除'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        <div className="mt-3 whitespace-pre-wrap text-sm">{post.content}</div>

        {/* Hobby tags */}
        {post.hobby_tags && post.hobby_tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.hobby_tags.map((tagId) => {
              const tag = getHobbyTagById(tagId);
              if (!tag) return null;
              return (
                <Badge
                  key={tagId}
                  variant="secondary"
                  className="text-xs"
                >
                  {tag.emoji} {tag.label}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Reactions & Comments */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <ReactionButtons
            postId={post.id}
            reactions={post.reactions}
            currentUserId={currentUserId}
          />

          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments?.length ?? 0}</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
