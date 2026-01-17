'use client';

import { Eye, EyeOff, Send } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { HOBBY_TAGS, type HobbyTagId, MAX_POST_LENGTH } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface PostFormProps {
  onPostCreated?: () => void;
}

export function PostForm({ onPostCreated }: PostFormProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState<HobbyTagId[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tagId: HobbyTagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('投稿内容を入力してください');
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('ログインが必要です');
        return;
      }

      const { error: insertError } = await supabase.from('posts').insert({
        user_id: user.id,
        content: content.trim(),
        is_anonymous: isAnonymous,
        hobby_tags: selectedTags as string[],
      } as never);

      if (insertError) {
        console.error('Post creation error:', insertError);
        if (insertError.code === '42501') {
          setError('権限エラー: 投稿する権限がありません');
        } else {
          setError(`投稿に失敗しました: ${insertError.message}`);
        }
        return;
      }

      // Reset form
      setContent('');
      setIsAnonymous(false);
      setSelectedTags([]);
      setShowTags(false);

      onPostCreated?.();
    });
  };

  return (
    <Card className="border-border">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="いま何してる？気軽に書いてみよう"
            maxLength={MAX_POST_LENGTH}
            rows={3}
            className="resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
            disabled={isPending}
          />

          {/* Character count */}
          <div className="mt-2 text-right text-xs text-muted-foreground">
            {content.length}/{MAX_POST_LENGTH}
          </div>

          {/* Tag selector toggle */}
          <button
            type="button"
            onClick={() => setShowTags(!showTags)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {showTags ? '▼ タグを隠す' : '▶ タグを追加'}
          </button>

          {/* Tag selector */}
          {showTags && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {HOBBY_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer text-xs transition-colors',
                      isSelected
                        ? 'bg-primary hover:bg-primary-dark'
                        : 'hover:bg-primary/10'
                    )}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.emoji} {tag.label}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors',
                isAnonymous
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isAnonymous ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  匿名で投稿
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  名前を表示
                </>
              )}
            </button>

            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary-dark"
              disabled={isPending || !content.trim()}
            >
              <Send className="mr-1.5 h-4 w-4" />
              {isPending ? '投稿中...' : '投稿'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
