'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

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
import { HOBBY_TAGS, HOBBY_TAG_CATEGORIES, type HobbyTagId } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function SetupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedTags, setSelectedTags] = useState<HobbyTagId[]>([]);

  const toggleTag = (tagId: HobbyTagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username) {
      setError('ユーザー名を入力してください');
      return;
    }

    if (username.length < 3) {
      setError('ユーザー名は3文字以上で入力してください');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('ユーザー名は英数字とアンダースコアのみ使用できます');
      return;
    }

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
          username,
          display_name: displayName || null,
          bio: bio || null,
          hobby_tags: selectedTags as string[],
        } as never)
        .eq('id', user.id);

      if (updateError) {
        if (updateError.code === '23505') {
          setError('このユーザー名は既に使用されています');
        } else {
          setError('プロフィールの保存に失敗しました');
        }
        return;
      }

      router.push('/feed');
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">プロフィール設定</CardTitle>
          <CardDescription>
            あなたのことを教えてください（後から変更できます）
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                ユーザー名 <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">@</span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="username"
                  pattern="[a-zA-Z0-9_]+"
                  minLength={3}
                  maxLength={30}
                  required
                  disabled={isPending}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                英数字とアンダースコアのみ、3文字以上
              </p>
            </div>

            {/* Display name */}
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                表示名（任意）
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
                自己紹介（任意）
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
              <label className="text-sm font-medium">
                趣味タグを選択（任意）
              </label>
              <p className="text-xs text-muted-foreground">
                興味のあるタグを選ぶと、同じ趣味の人と繋がりやすくなります
              </p>

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

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isPending}
            >
              {isPending ? '保存中...' : '始める'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
