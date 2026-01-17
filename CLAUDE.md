# チー牛農場 - CLAUDE.md

## Project Overview

チー牛（内向的・静かな趣味を持つ層）向けSNS Webサイト。
「静かなインターネット」をコンセプトに、外向的な社交プレッシャーのない安心できる空間を提供する。

### Target Users
- 静かな趣味を持つ人（温泉、風景、ドライブ、ジャズ、ホームセンター巡りなど）
- 無理な自己演出を求められない空間を望む人
- Instagram的な映え投稿圧力を避けたい人
- 同じ価値観を持つ人と深く繋がりたい人

### Core Concept
- **検索避け**: 外部検索エンジンにインデックスされない
- **静かなタイムライン**: トレンド排除、フォロー中心表示
- **匿名性重視**: ユーザー名非表示オプション
- **テキスト中心**: 画像より文章を重視するUI

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand or React Context

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime

### Deployment
- **Platform**: Vercel
- **PWA**: next-pwa for Progressive Web App support

---

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

---

## Project Structure

```
otaku/
├── app/
│   ├── (auth)/              # Auth routes (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── (main)/              # Main app routes (requires auth)
│   │   ├── feed/            # Timeline/Feed
│   │   ├── communities/     # Community list & detail
│   │   ├── profile/         # User profile
│   │   ├── settings/        # User settings
│   │   └── events/          # Event list & detail
│   ├── api/                 # API routes
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # Base UI components (shadcn/ui)
│   ├── feed/                # Feed-related components
│   │   ├── Post.tsx
│   │   ├── PostForm.tsx
│   │   ├── Timeline.tsx
│   │   └── Reactions.tsx
│   ├── community/           # Community components
│   │   ├── CommunityCard.tsx
│   │   ├── CommunityList.tsx
│   │   └── MemberList.tsx
│   ├── profile/             # Profile components
│   └── common/              # Shared components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── SearchBar.tsx
├── lib/
│   ├── supabase/            # Supabase client & utilities
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── utils.ts             # Utility functions
│   └── constants.ts         # App constants
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── usePosts.ts
│   └── useCommunities.ts
├── types/                   # TypeScript type definitions
│   ├── database.ts          # Supabase generated types
│   └── index.ts
├── styles/
│   └── globals.css
└── public/
    └── icons/
```

---

## Database Schema

### Core Tables

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_anonymous_default BOOLEAN DEFAULT false,
  hobby_tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  images TEXT[],
  hobby_tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions (empathy-focused)
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'like', 'empathy', 'relatable', 'support'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, type)
);

-- Communities
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  hobby_tags TEXT[],
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Members
CREATE TABLE community_members (
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'moderator', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (community_id, user_id)
);

-- Follows
CREATE TABLE follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Events (for offline meetups)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT, -- 'onsen', 'drive', 'cafe', 'other'
  location TEXT,
  event_date TIMESTAMPTZ,
  max_participants INT,
  community_id UUID REFERENCES communities(id),
  organizer_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Posts: Anyone can read, only author can write
CREATE POLICY "Posts are viewable by authenticated users"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## Core Features

### Phase 1: MVP

1. **Authentication**
   - Email/Password registration
   - Magic link login
   - Profile setup with hobby tags

2. **Feed/Timeline**
   - Post creation (text + optional images)
   - Anonymous posting option
   - Hobby tag filtering
   - "Quiet timeline" - no trending, follower-based

3. **Reactions**
   - Like
   - Empathy (共感)
   - Relatable (同感)
   - Support (応援)

4. **Profile**
   - Bio and avatar
   - Hobby tags display
   - Post history
   - Privacy settings

5. **Search Avoidance**
   - `robots.txt` to block crawlers
   - `noindex` meta tags
   - No public profile URLs

### Phase 2: Community

1. **Communities**
   - Create/join communities
   - Open vs private communities
   - Community-specific posts
   - Moderator roles

2. **Matching**
   - Hobby-based user suggestions
   - "Similar to you" percentage

### Phase 3: Events

1. **Offline Events**
   - Event creation
   - RSVP system
   - Post-event reports

---

## UI/UX Guidelines

### Design Philosophy
- **Calm colors**: Pastel tones, low contrast
- **Minimal animations**: Simple transitions only
- **Text-first**: Prioritize text over images
- **No pressure**: Hide exact like counts, show ranges instead

### Color Palette

```css
:root {
  /* Primary - Soft sage green */
  --primary: #8FBC8F;
  --primary-light: #C5E1C5;
  --primary-dark: #6B8E6B;

  /* Background - Warm neutrals */
  --bg-primary: #FAF9F6;
  --bg-secondary: #F5F5F0;
  --bg-tertiary: #EDEDEA;

  /* Text */
  --text-primary: #3D3D3D;
  --text-secondary: #6B6B6B;
  --text-muted: #9B9B9B;

  /* Accent - Soft coral for reactions */
  --accent: #E8A598;
  --accent-light: #F5D5CE;
}
```

### Typography

```css
/* Japanese-friendly font stack */
font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;

/* Readable line height for Japanese text */
line-height: 1.8;

/* Comfortable font sizes */
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
```

---

## Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Chigyu SNS
```

---

## Development Best Practices

### Code Style
- Use TypeScript strict mode
- Prefer Server Components where possible
- Use `use client` directive only when necessary
- Follow Tailwind CSS conventions

### Security
- Always use RLS policies
- Sanitize user input
- No public API endpoints for sensitive data
- Rate limiting on API routes

### Performance
- Use Next.js Image component
- Implement infinite scroll for feeds
- Lazy load images
- Cache Supabase queries with React Query

### Accessibility
- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance

---

## Hobby Tags (趣味タグ)

```typescript
const HOBBY_TAGS = [
  // Nature & Outdoors
  'onsen',      // 温泉
  'scenery',    // 風景
  'autumn',     // 紅葉
  'drive',      // ドライブ

  // Music
  'jazz',       // ジャズ
  'funk',       // ファンク
  'classical',  // クラシック

  // Indoor
  'homeCenter', // ホームセンター
  'diy',        // DIY
  'reading',    // 読書
  'coffee',     // コーヒー

  // Media
  'anime',      // アニメ
  'manga',      // マンガ
  'game',       // ゲーム

  // Vehicles
  'cars',       // 車
  'trains',     // 電車
  'planes',     // 飛行機

  // Others
  'cooking',    // 料理
  'photography',// 写真
  'gardening',  // 園芸
] as const;
```

---

## Moderation Guidelines

### Community Rules
1. No harassment or personal attacks
2. No external SNS-style "flexing"
3. Respect others' pace and preferences
4. Keep conversations constructive
5. Report violations to moderators

### Auto-moderation
- Implement basic profanity filter
- Rate limit new user posts
- Flag suspicious activity patterns

---

## Future Considerations

- **Mobile App**: React Native or Expo
- **Premium Features**: Ad-free, extra storage, custom themes
- **Matching/Dating**: Optional feature for interested users
- **Offline Events**: Integration with event platforms

---

## References

- [Market Research Report](../notes/obsidian/MyVault/Zettelkasten/30_FeelingNote/チー牛向けSNS市場調査レポート.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
