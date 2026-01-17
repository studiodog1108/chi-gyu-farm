'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  HOBBY_TAGS,
  HOBBY_TAG_CATEGORIES,
  type HobbyTagId,
} from '@/constants';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types/database';

export default function SettingsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedTags, setSelectedTags] = useState<HobbyTagId[]>([]);
  const [isAnonymousDefault, setIsAnonymousDefault] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = (await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()) as { data: Profile | null };

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name ?? '');
        setBio(data.bio ?? '');
        setSelectedTags((data.hobby_tags as HobbyTagId[]) ?? []);
        setIsAnonymousDefault(data.is_anonymous_default);
      }
    };

    loadProfile();
  }, [router]);

  const toggleTag = (tagId: HobbyTagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: displayName || null,
          bio: bio || null,
          hobby_tags: selectedTags as string[],
          is_anonymous_default: isAnonymousDefault,
        } as never)
        .eq('id', user.id);

      if (updateError) {
        setError('保存に失敗しました。もう一度お試しください');
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    });
  };

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const initials =
    displayName.slice(0, 2) || profile.username?.slice(0, 2) || '??';

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">設定</h1>

      <form onSubmit={handleSubmit}>
        {/* Profile settings */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
            <CardDescription>
              公開される情報を編集できます
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-primary/10 p-3 text-sm text-primary-dark">
                保存しました
              </div>
            )}

            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-xl text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-muted-foreground">
                アバター画像の変更は準備中です
              </div>
            </div>

            {/* Username (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">ユーザー名</label>
              <Input value={`@${profile.username}`} disabled />
              <p className="text-xs text-muted-foreground">
                ユーザー名は変更できません
              </p>
            </div>

            {/* Display name */}
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                表示名
              </label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="表示される名前"
                maxLength={50}
                disabled={isPending}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                自己紹介
              </label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="趣味や好きなことを書いてみましょう"
                maxLength={300}
                rows={3}
                disabled={isPending}
              />
              <p className="text-right text-xs text-muted-foreground">
                {bio.length}/300
              </p>
            </div>

            {/* Hobby tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium">趣味タグ</label>

              <div className="space-y-4">
                {HOBBY_TAG_CATEGORIES.map((category) => (
                  <div key={category.id}>
                    <div className="mb-2 text-xs text-muted-foreground">
                      {category.label}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {HOBBY_TAGS.filter((t) => t.category === category.id).map(
                        (tag) => {
                          const isSelected = selectedTags.includes(tag.id);
                          return (
                            <Badge
                              key={tag.id}
                              variant={isSelected ? 'default' : 'outline'}
                              className={cn(
                                'cursor-pointer transition-colors',
                                isSelected
                                  ? 'bg-primary hover:bg-primary-dark'
                                  : 'hover:bg-primary/10'
                              )}
                              onClick={() => toggleTag(tag.id)}
                            >
                              {tag.emoji} {tag.label}
                            </Badge>
                          );
                        }
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy settings */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>プライバシー</CardTitle>
            <CardDescription>
              投稿に関する設定を変更できます
            </CardDescription>
          </CardHeader>

          <CardContent>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isAnonymousDefault}
                onChange={(e) => setIsAnonymousDefault(e.target.checked)}
                className="h-4 w-4 rounded border-border"
                disabled={isPending}
              />
              <div>
                <div className="text-sm font-medium">
                  デフォルトで匿名投稿にする
                </div>
                <div className="text-xs text-muted-foreground">
                  新規投稿時に匿名オプションがデフォルトでオンになります
                </div>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Save button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark"
          disabled={isPending}
        >
          {isPending ? '保存中...' : '変更を保存'}
        </Button>
      </form>
    </div>
  );
}
