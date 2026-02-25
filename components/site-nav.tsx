'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Info, MapPinned } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: MapPinned },
  { href: '/features', label: 'Features', icon: Compass },
  { href: '/guide', label: 'Guide', icon: Info },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition ${
              active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-foreground hover:border-primary/40'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
