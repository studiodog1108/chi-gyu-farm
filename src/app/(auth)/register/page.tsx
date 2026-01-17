'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { signUp, type AuthState } from '../actions';

const initialState: AuthState = {};

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(signUp, initialState);

  if (state.success) {
    return (
      <Card className="border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">登録完了</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4 rounded-md bg-primary/10 p-4 text-primary-dark">
            <p className="mb-2">確認メールを送信しました。</p>
            <p className="text-sm">
              メールに記載されたリンクをクリックして、登録を完了してください。
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-primary hover:underline">
            ログインページへ
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">新規登録</CardTitle>
        <CardDescription>
          チー牛農場に参加して、静かなインターネットを楽しもう
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              メールアドレス
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              パスワード
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="8文字以上"
              minLength={8}
              required
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              8文字以上で入力してください
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              パスワード（確認）
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="もう一度入力"
              minLength={8}
              required
              disabled={isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark"
            disabled={isPending}
          >
            {isPending ? '登録中...' : 'アカウント作成'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          登録することで、利用規約とプライバシーポリシーに同意したものとします。
        </p>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          既にアカウントをお持ちの方は{' '}
          <Link href="/login" className="text-primary hover:underline">
            ログイン
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
