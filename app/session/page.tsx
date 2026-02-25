import { Suspense } from 'react';
import { SessionClient } from '@/components/session-client';

export const metadata = {
  title: 'Session - Sync Map',
  description: 'Real-time location synchronization session',
};

function SessionLoading() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-300">Connecting to session...</p>
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
