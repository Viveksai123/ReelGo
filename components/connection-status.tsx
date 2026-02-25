'use client';

import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ConnectionStatusProps {
  connected: boolean;
  loading?: boolean;
  error?: string | null;
}

export function ConnectionStatus({ connected, loading, error }: ConnectionStatusProps) {
  if (connected) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-medium">Connected</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-destructive dark:text-destructive-foreground">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm font-medium">Connecting...</span>
    </div>
  );
}
