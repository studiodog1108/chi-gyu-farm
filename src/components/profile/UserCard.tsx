'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FollowButton } from './FollowButton';
import { getHobbyTagById } from '@/constants';
import type { Profile } from '@/types/database';

interface UserCardProps {
  user: Profile;
  currentUserId?: string;
  isFollowing: boolean;
}

export function UserCard({ user, currentUserId, isFollowing }: UserCardProps) {
  const displayName = user.display_name ?? user.username ?? '不明';
  const initials = displayName.slice(0, 2);
  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Avatar */}
      <Link href={`/profile/${user.id}`}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar_url ?? undefined} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <Link href={`/profile/${user.id}`} className="block">
          <div className="font-medium hover:underline">{displayName}</div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
        </Link>

        {/* Bio preview */}
        {user.bio && (
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {user.bio}
          </p>
        )}

        {/* Hobby tags */}
        {user.hobby_tags && user.hobby_tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {user.hobby_tags.slice(0, 3).map((tagId) => {
              const tag = getHobbyTagById(tagId);
              if (!tag) return null;
              return (
                <Badge key={tagId} variant="secondary" className="text-xs">
                  {tag.emoji}
                </Badge>
              );
            })}
            {user.hobby_tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{user.hobby_tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Follow button */}
      {currentUserId && !isOwnProfile && (
        <FollowButton targetUserId={user.id} isFollowing={isFollowing} />
      )}
    </div>
  );
}
