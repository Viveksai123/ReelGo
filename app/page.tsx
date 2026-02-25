'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Moon, Sun, Users } from 'lucide-react';
import { SiteNav } from '@/components/site-nav';
import { useTheme } from '@/components/theme-provider';

export default function Home() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [roomId, setRoomId] = useState('');
  const [role, setRole] = useState<'tracker' | 'tracked' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim() || !role) return;
    setLoading(true);
    const encodedRoomId = encodeURIComponent(roomId.trim());
    router.push(`/session?roomId=${encodedRoomId}&role=${role}`);
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setRole('tracker');
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.14),transparent_30%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.08))]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between">
          <SiteNav />
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg border border-border bg-card p-2 text-foreground hover:border-primary/40"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        <section className="mx-auto w-full max-w-xl">
          <form onSubmit={handleJoinSession} className="rounded-2xl border border-border/70 bg-card/92 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-bold">Join Session</h2>
            <p className="mt-1 text-xs text-muted-foreground">Enter a room ID and select your role.</p>

            <label className="mt-4 block text-xs font-semibold text-muted-foreground">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="E.g. 7HD93K"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole('tracker')}
                className={`rounded-lg border p-3 text-left transition ${
                  role === 'tracker' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="inline-flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4" /> Tracker</div>
                <div className="mt-1 text-xs text-muted-foreground">Controls map broadcast</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('tracked')}
                className={`rounded-lg border p-3 text-left transition ${
                  role === 'tracked' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="inline-flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" /> Follower</div>
                <div className="mt-1 text-xs text-muted-foreground">Receives synchronized map</div>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="submit"
                disabled={!roomId.trim() || !role || loading}
                className="h-10 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Session'}
              </button>
              <button
                type="button"
                onClick={handleCreateRoom}
                className="h-10 rounded-lg border border-border bg-background text-sm font-semibold"
              >
                Create New Room
              </button>
            </div>

            <Link href="/guide" className="mt-4 inline-flex items-center gap-2 text-xs text-primary hover:underline">
              Setup and usage guide
            </Link>
          </form>
        </section>
      </div>
    </main>
  );
}
