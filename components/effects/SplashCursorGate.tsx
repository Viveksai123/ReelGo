'use client';

import { usePathname } from 'next/navigation';
import { SplashCursor } from './SplashCursor';

export function SplashCursorGate() {
  const pathname = usePathname();
  if (pathname?.startsWith('/session')) return null;
  return <SplashCursor />;
}

