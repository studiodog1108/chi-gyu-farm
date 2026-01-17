import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <main className="flex max-w-2xl flex-col items-center gap-8 text-center">
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-foreground mb-4 border-b-2 border-white pb-4 text-4xl font-bold sm:text-5xl">
            * チー牛農場
          </h1>
        </div>

        {/* Description */}
        <p className="text-foreground-muted max-w-md">
          外向的な社交プレッシャーのない、安心できるオンライン空間。
          静かな趣味を持つ人々が、自分のペースで繋がれる場所。
        </p>

        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-2 border-white bg-black p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-red-500">
                🛡️ ATフィールド
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground-secondary text-sm">
              <p>
                「結婚」「BBQ」「海」などの
                <br />
                リア充ワードを自動検閲
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-white bg-black p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-blue-400">
                😶 ROM専バッジ
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground-secondary text-sm">
              <p>
                投稿しなくていい。
                <br />
                見るだけでいい。
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="h-8 w-8 border border-white bg-gray-700"></div>
                <span className="border border-blue-500 bg-blue-900 px-1 py-0.5 text-[10px] text-blue-200">
                  ROM
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-white bg-black p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-yellow-500">
                😑 陰キャリアクション
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground-secondary space-y-2 text-sm">
              <p>「いいね」のプレッシャーからの解放</p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 border-white text-[10px] text-white hover:bg-white hover:text-black"
                >
                  あ…
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 border-white text-[10px] text-white hover:bg-white hover:text-black"
                >
                  そっスね
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 border-white text-[10px] text-white hover:bg-white hover:text-black"
                >
                  ...
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-white bg-black p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-green-500">
                🖥️ 完全BBSモード
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground-secondary text-sm">
              <p>
                画像読み込みなし。
                <br />
                テキストだけの安心感。
              </p>
              <div className="mt-2 border border-gray-700 p-1 text-left font-mono text-[10px]">
                1: 名無しさん
                <br />
                &nbsp;&nbsp;つらたん
                <br />
                2: 名無しさん
                <br />
                &nbsp;&nbsp;&gt;&gt;1 わかる
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary-dark"
          >
            <Link href="/register">新規登録</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">ログイン</Link>
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-foreground-muted text-xs">
          映えなくていい。自分らしくいられる場所。
        </p>
      </main>
    </div>
  );
}
