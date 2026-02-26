import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { SpotlightCard } from '@/components/effects';

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center p-4">
      <div className="page-aurora" />
      <SpotlightCard className="glass-panel relative w-full max-w-md rounded-2xl border border-border/70 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4">
            <MapPin className="h-12 w-12 text-blue-400" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-2 text-lg text-muted-foreground">Page not found</p>
        <p className="mb-8 text-sm text-muted-foreground/90">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Link href="/">
          <Button className="w-full bg-primary text-primary-foreground font-semibold">
            Return to Home
          </Button>
        </Link>
      </SpotlightCard>
    </div>
  );
}
