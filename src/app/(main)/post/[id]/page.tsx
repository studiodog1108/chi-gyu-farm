import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PostCard } from '@/components/feed/PostCard';
import { CommentList } from '@/components/comment/CommentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get post with profile and reactions
  const { data: post, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles (*),
      reactions (type, user_id),
      comments (id)
    `
    )
    .eq('id', id)
    .single() as {
      data: {
        id: string;
        user_id: string;
        content: string;
        is_anonymous: boolean;
        images: string[];
        hobby_tags: string[];
        created_at: string;
        updated_at: string;
        profiles: Profile;
        reactions: { type: string; user_id: string }[];
        comments: { id: string }[];
      } | null;
      error: unknown;
    };

  if (error || !post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Back button */}
      <Link
        href="/feed"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        フィードに戻る
      </Link>

      {/* Post */}
      <div className="mb-6">
        <PostCard post={post} currentUserId={user?.id} />
      </div>

      {/* Comments section */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            コメント ({post.comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CommentList postId={id} currentUserId={user?.id} />
        </CardContent>
      </Card>
    </div>
  );
}
