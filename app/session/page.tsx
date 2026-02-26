import { Suspense } from 'react';
import { SessionClient } from '@/components/session-client';

export const metadata = {
  title: 'Session - Sync Map',
  description: 'Real-time location synchronization session',
};

function SessionLoading() {
  return (
    <div className="page-shell flex h-screen w-full items-center justify-center">
      <div className="page-aurora" />
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
        <p className="text-muted-foreground">Connecting to session...</p>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<SessionLoading />}>
      <SessionClient />
    </Suspense>
  );
}
