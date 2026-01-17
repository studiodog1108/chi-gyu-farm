'use client';

import { useTransition } from 'react';

import { REACTION_TYPES, formatReactionCount } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface ReactionButtonsProps {
  postId: string;
  reactions: { type: string; user_id: string }[];
  currentUserId?: string;
}

export function ReactionButtons({
  postId,
  reactions,
  currentUserId,
}: ReactionButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const getReactionCount = (type: string) =>
    reactions.filter((r) => r.type === type).length;

  const hasReacted = (type: string) =>
    reactions.some((r) => r.type === type && r.user_id === currentUserId);

  const handleReaction = (type: string) => {
    if (!currentUserId) return;

    startTransition(async () => {
      const supabase = createClient();
      const alreadyReacted = hasReacted(type);

      if (alreadyReacted) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUserId)
          .eq('type', type);
      } else {
        // Add reaction
        await supabase.from('reactions').insert({
          post_id: postId,
          user_id: currentUserId,
          type,
        } as never);
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      {REACTION_TYPES.map((reaction) => {
        const count = getReactionCount(reaction.id);
        const isActive = hasReacted(reaction.id);
        const displayCount = formatReactionCount(count);

        return (
          <button
            key={reaction.id}
            onClick={() => handleReaction(reaction.id)}
            disabled={isPending || !currentUserId}
            title={reaction.description}
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors',
              isActive
                ? 'bg-accent/20 text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              isPending && 'opacity-50'
            )}
          >
            <span>{reaction.emoji}</span>
            {displayCount && <span>{displayCount}</span>}
          </button>
        );
      })}
    </div>
  );
}
