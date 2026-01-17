'use client';

import { Eye, EyeOff, Send } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface CommentFormProps {
  postId: string;
  onCommentCreated?: () => void;
}

export function CommentForm({ postId, onCommentCreated }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
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

      const { error: insertError } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
        is_anonymous: isAnonymous,
      } as never);

      if (insertError) {
        setError('コメントの投稿に失敗しました');
        return;
      }

      setContent('');
      setIsAnonymous(false);
      onCommentCreated?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを書く..."
        maxLength={500}
        rows={2}
        className="resize-none"
        disabled={isPending}
      />

      <div className="flex items-center justify-between">
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
              匿名
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              名前表示
            </>
          )}
        </button>

        <Button
          type="submit"
          size="sm"
          className="bg-primary hover:bg-primary-dark"
          disabled={isPending || !content.trim()}
        >
          <Send className="mr-1 h-3.5 w-3.5" />
          {isPending ? '送信中...' : '送信'}
        </Button>
      </div>
    </form>
  );
}
