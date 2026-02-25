import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
            <MapPin className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-slate-300 text-lg mb-2">Page not found</p>
        <p className="text-slate-400 text-sm mb-8">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Link href="/">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
