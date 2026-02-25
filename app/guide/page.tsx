import { SiteNav } from '@/components/site-nav';

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <SiteNav />
        <section className="mt-8 rounded-2xl border border-border/70 bg-card p-6 shadow-xl">
          <h1 className="text-3xl font-bold">Quick Guide</h1>
          <ol className="mt-5 space-y-3 text-sm">
            <li className="rounded-lg border border-border bg-background px-4 py-3">1. Open app on two devices/browser tabs.</li>
            <li className="rounded-lg border border-border bg-background px-4 py-3">2. Create a room as Tracker, copy room ID.</li>
            <li className="rounded-lg border border-border bg-background px-4 py-3">3. Join same room as Follower.</li>
            <li className="rounded-lg border border-border bg-background px-4 py-3">4. Move tracker map; follower syncs in near real-time.</li>
            <li className="rounded-lg border border-border bg-background px-4 py-3">5. Use map controls: layers, search, map type, locate, and re-sync.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
