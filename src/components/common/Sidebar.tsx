'use client';

import { Home, Users, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { HOBBY_TAG_CATEGORIES, getHobbyTagsByCategory } from '@/constants';

const navItems = [
  { href: '/feed', label: 'ホーム', icon: Home },
  { href: '/communities', label: 'コミュニティ', icon: Users },
  { href: '/events', label: 'イベント', icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col p-4">
      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-border" />

      {/* Hobby tag filters */}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-2 flex items-center gap-2 px-3 text-xs font-medium text-muted-foreground">
          <Search className="h-3 w-3" />
          趣味タグで絞り込み
        </div>

        <div className="space-y-4">
          {HOBBY_TAG_CATEGORIES.map((category) => (
            <div key={category.id}>
              <div className="px-3 py-1 text-xs text-muted-foreground">
                {category.label}
              </div>
              <div className="flex flex-wrap gap-1 px-2">
                {getHobbyTagsByCategory(category.id).map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/feed?tag=${tag.id}`}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                      'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary',
                      'transition-colors'
                    )}
                  >
                    <span>{tag.emoji}</span>
                    <span>{tag.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
