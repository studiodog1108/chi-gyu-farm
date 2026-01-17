/**
 * Hobby tags for チー牛農場
 * These tags represent quiet, introverted hobbies
 */

export const HOBBY_TAGS = [
  // Nature & Outdoors
  { id: 'onsen', label: '温泉', emoji: '♨️', category: 'nature' },
  { id: 'scenery', label: '風景', emoji: '🏞️', category: 'nature' },
  { id: 'autumn', label: '紅葉', emoji: '🍂', category: 'nature' },
  { id: 'drive', label: 'ドライブ', emoji: '🚗', category: 'nature' },
  { id: 'gardening', label: '園芸', emoji: '🌱', category: 'nature' },

  // Music
  { id: 'jazz', label: 'ジャズ', emoji: '🎷', category: 'music' },
  { id: 'funk', label: 'ファンク', emoji: '🎸', category: 'music' },
  { id: 'classical', label: 'クラシック', emoji: '🎻', category: 'music' },

  // Indoor Activities
  { id: 'homeCenter', label: 'ホームセンター', emoji: '🔧', category: 'indoor' },
  { id: 'diy', label: 'DIY', emoji: '🛠️', category: 'indoor' },
  { id: 'reading', label: '読書', emoji: '📚', category: 'indoor' },
  { id: 'coffee', label: 'コーヒー', emoji: '☕', category: 'indoor' },
  { id: 'cooking', label: '料理', emoji: '🍳', category: 'indoor' },

  // Media & Entertainment
  { id: 'anime', label: 'アニメ', emoji: '📺', category: 'media' },
  { id: 'manga', label: 'マンガ', emoji: '📖', category: 'media' },
  { id: 'game', label: 'ゲーム', emoji: '🎮', category: 'media' },

  // Vehicles & Transportation
  { id: 'cars', label: '車', emoji: '🚙', category: 'vehicles' },
  { id: 'trains', label: '電車', emoji: '🚃', category: 'vehicles' },
  { id: 'planes', label: '飛行機', emoji: '✈️', category: 'vehicles' },

  // Creative
  { id: 'photography', label: '写真', emoji: '📷', category: 'creative' },
] as const;

export type HobbyTagId = (typeof HOBBY_TAGS)[number]['id'];
export type HobbyTag = (typeof HOBBY_TAGS)[number];

export const HOBBY_TAG_CATEGORIES = [
  { id: 'nature', label: '自然・アウトドア' },
  { id: 'music', label: '音楽' },
  { id: 'indoor', label: 'インドア' },
  { id: 'media', label: 'メディア' },
  { id: 'vehicles', label: '乗り物' },
  { id: 'creative', label: 'クリエイティブ' },
] as const;

export function getHobbyTagById(id: string): HobbyTag | undefined {
  return HOBBY_TAGS.find((tag) => tag.id === id);
}

export function getHobbyTagsByCategory(
  category: string
): readonly HobbyTag[] {
  return HOBBY_TAGS.filter((tag) => tag.category === category);
}
