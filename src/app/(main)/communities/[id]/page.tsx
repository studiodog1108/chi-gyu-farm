import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: community } = (await supabase
    .from('communities')
    .select(
      `
      *,
      profiles:owner_id (*),
      community_members (*)
    `
    )
    .eq('id', id)
    .single()) as { data: any | null };

  if (!community) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold mb-2">コミュニティが見つかりません</h1>
          <p className="text-muted-foreground">
            <Link href="/communities" className="text-primary hover:underline">
              コミュニティ一覧へ戻る
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{community.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {community.description || '説明なし'}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          メンバー: {community.community_members?.length || 0}人
        </p>
      </div>

      <div className="rounded-lg bg-muted p-6 text-center">
        <p className="text-muted-foreground mb-4">まだ投稿がありません</p>
        <p className="text-sm text-muted-foreground">
          最初の投稿をしてみましょう
        </p>
      </div>
    </div>
  );
}
