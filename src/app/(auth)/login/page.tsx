'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';

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

import { signIn, signInWithMagicLink, type AuthState } from '../actions';

const initialState: AuthState = {};

export default function LoginPage() {
  const [usePassword, setUsePassword] = useState(true);
  const [passwordState, passwordAction, passwordPending] = useActionState(
    signIn,
    initialState
  );
  const [magicLinkState, magicLinkAction, magicLinkPending] = useActionState(
    signInWithMagicLink,
    initialState
  );

  const state = usePassword ? passwordState : magicLinkState;
  const isPending = usePassword ? passwordPending : magicLinkPending;

  return (
    <Card className="border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ログイン</CardTitle>
        <CardDescription>
          アカウントにログインして、静かなタイムラインへ
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {magicLinkState.success && !usePassword && (
          <div className="mb-4 rounded-md bg-primary/10 p-3 text-sm text-primary-dark">
            ログインリンクをメールで送信しました。メールをご確認ください。
          </div>
        )}

        {usePassword ? (
          <form action={passwordAction} className="space-y-4">
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
                placeholder="••••••••"
                required
                disabled={isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isPending}
            >
              {isPending ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
        ) : (
          <form action={magicLinkAction} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isPending}
            >
              {isPending ? '送信中...' : 'ログインリンクを送信'}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setUsePassword(!usePassword)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {usePassword
              ? 'パスワードなしでログイン（マジックリンク）'
              : 'パスワードでログイン'}
          </button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          アカウントをお持ちでない方は{' '}
          <Link href="/register" className="text-primary hover:underline">
            新規登録
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
