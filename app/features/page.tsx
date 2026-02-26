import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SpotlightCard, StarBorder, TiltedCard } from '@/components/effects';

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
    <main className="page-shell min-h-screen">
      <div className="page-aurora" />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <SiteNav />
          <Link href="/">
            <StarBorder as="span" color="#22d3ee" className="text-sm" speed="5.5s">
              Open App
            </StarBorder>
          </Link>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <SpotlightCard className="glass-panel rounded-2xl border border-border/70 p-6 shadow-xl">
            <h1 className="text-4xl font-black tracking-tight">Feature Matrix</h1>
            <p className="mt-3 text-sm text-muted-foreground">Implemented capabilities for the assignment scope.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {featureList.map((item) => (
                <li key={item} className="rounded-lg border border-border/70 bg-background/70 px-4 py-3 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </SpotlightCard>

          <SpotlightCard className="glass-panel rounded-2xl border border-border/70 p-4 shadow-xl">
            <TiltedCard
              imageSrc="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80"
              altText="Map grid and location planning"
              captionText="Live synchronized map experience"
              containerHeight="340px"
              imageHeight="320px"
              imageWidth="100%"
            />
          </SpotlightCard>
        </section>
      </div>
    </main>
  );
}
