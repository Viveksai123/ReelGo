import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SpotlightCard, StarBorder, TrueFocus } from '@/components/effects';

const steps = [
  'Open app on two devices/browser tabs.',
  'Create a room as Tracker, copy room ID.',
  'Join the same room as Follower.',
  'Move tracker map; follower syncs in near real-time.',
  'Use map controls: layers, search, map type, locate, and re-sync.',
];

export default function GuidePage() {
  return (
    <main className="page-shell min-h-screen">
      <div className="page-aurora" />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <SiteNav />
          <Link href="/">
            <StarBorder as="span" color="#60a5fa" className="text-sm" speed="5s">
              Open App
            </StarBorder>
          </Link>
        </div>

        <SpotlightCard className="glass-panel mt-8 rounded-2xl border border-border/70 p-6 shadow-xl">
          <TrueFocus
            sentence="Quick Guide"
            separator=" "
            blurAmount={1.8}
            borderColor="#60a5fa"
            glowColor="rgba(96, 165, 250, 0.6)"
            className="justify-start"
          />
          <ol className="mt-5 space-y-3 text-sm">
            {steps.map((step, idx) => (
              <li key={step} className="rounded-lg border border-border/70 bg-background/70 px-4 py-3">
                {idx + 1}. {step}
              </li>
            ))}
          </ol>
        </SpotlightCard>
      </div>
    </main>
  );
}
