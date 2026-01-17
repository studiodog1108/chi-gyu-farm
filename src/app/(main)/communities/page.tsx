import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HOBBY_TAG_CATEGORIES, getHobbyTagsByCategory } from '@/constants';
import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function CommunitiesList() {
  const supabase = await createClient();
  const { data: communities } = await supabase
    .from('communities')
    .select(`
      *,
      profiles:owner_id (*),
      community_members (count)
    `)
    .order('created_at', { ascending: false });

  if (!communities || communities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">まだコミュニティがありません</p>
        <p className="text-sm text-muted-foreground">
          最初のコミュニティを作成してみましょう
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {communities.map((community: any) => {
        const memberCount = Array.isArray(community.community_members)
          ? community.community_members.length
          : (community.community_members?.[0]?.count ?? 0);

        return (
          <Link key={community.id} href={`/communities/${community.id}`}>
            <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{community.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {community.description || '説明なし'}
                    </CardDescription>
                  </div>
                  {community.is_private && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      非公開
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>メンバー: {memberCount}人</span>
                  {community.hobby_tags && community.hobby_tags.length > 0 && (
                    <div className="flex gap-1">
                      {community.hobby_tags.slice(0, 3).map((tagId: string) => {
                        const tag = getHobbyTagsByCategory(tagId)[0];
                        if (!tag) return null;
                        return (
                          <span
                            key={tagId}
                            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                          >
                            {tag.emoji} {tag.label}
                          </span>
                        );
                      })}
                      {community.hobby_tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{community.hobby_tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default async function CommunitiesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">コミュニティ</h1>
          <p className="text-sm text-muted-foreground mt-1">
            同じ趣味を持つ人と繋がろう
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark">
          <Plus className="mr-2 h-4 w-4" />
          作成
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        }
      >
        <CommunitiesList />
      </Suspense>
    </div>
  );
}
