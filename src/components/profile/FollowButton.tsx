'use client';

import { UserMinus, UserPlus } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
}

export function FollowButton({
  targetUserId,
  isFollowing: initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (!error) {
          setIsFollowing(false);
        }
      } else {
        // Follow
        const { error } = await supabase.from('follows').insert({
          follower_id: user.id,
          following_id: targetUserId,
        } as never);

        if (!error) {
          setIsFollowing(true);
        }
      }
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      className={isFollowing ? '' : 'bg-primary hover:bg-primary-dark'}
    >
      {isFollowing ? (
        <>
          <UserMinus className="mr-1.5 h-4 w-4" />
          フォロー中
        </>
      ) : (
        <>
          <UserPlus className="mr-1.5 h-4 w-4" />
          フォロー
        </>
      )}
    </Button>
  );
}
