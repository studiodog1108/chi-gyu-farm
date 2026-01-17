/**
 * Reaction types for チー牛農場
 * Empathy-focused reactions instead of just "likes"
 */

export const REACTION_TYPES = [
  {
    id: 'like',
    label: 'いいね',
    emoji: '👍',
    description: '素敵だと思った',
  },
  {
    id: 'empathy',
    label: '共感',
    emoji: '🤝',
    description: '気持ちがわかる',
  },
  {
    id: 'relatable',
    label: '同感',
    emoji: '💭',
    description: '自分も同じ',
  },
  {
    id: 'support',
    label: '応援',
    emoji: '💪',
    description: '頑張ってほしい',
  },
] as const;

export type ReactionTypeId = (typeof REACTION_TYPES)[number]['id'];
export type ReactionType = (typeof REACTION_TYPES)[number];

export function getReactionById(id: string): ReactionType | undefined {
  return REACTION_TYPES.find((reaction) => reaction.id === id);
}

/**
 * Convert reaction count to a range display
 * This reduces social pressure by not showing exact numbers
 */
export function formatReactionCount(count: number): string {
  if (count === 0) return '';
  if (count < 5) return '数件';
  if (count < 10) return '5+';
  if (count < 50) return '10〜50';
  if (count < 100) return '50〜100';
  if (count < 500) return '100+';
  return '500+';
}
