import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';

const featureList = [
  'Room-based tracker/follower architecture',
  'Google Maps synchronization with pan, zoom, tilt',
  'Traffic, transit, and bicycling layers',
  'Follower mode: follow tracker or free explore + re-sync',
  'Persistent HUD with precision coordinates and connection state',
  'Socket event throttling to reduce jitter and overload',
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <SiteNav />
          <Link href="/" className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm">Open App</Link>
        </div>

        <section className="mt-8 rounded-2xl border border-border/70 bg-card p-6 shadow-xl">
          <h1 className="text-3xl font-bold">Feature Matrix</h1>
          <p className="mt-2 text-sm text-muted-foreground">Implemented capabilities for the assignment scope.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {featureList.map((item) => (
              <li key={item} className="rounded-lg border border-border bg-background px-4 py-3 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
