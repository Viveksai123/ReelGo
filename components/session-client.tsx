'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { MapView } from './map-view';
import { HUDOverlay } from './hud-overlay';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface ViewState {
  lat: number;
  lng: number;
  zoom: number;
  tilt?: number;
  timestamp: number;
}

export function SessionClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [userId] = useState(() => uuidv4());
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState | null>(null);
  const [copied, setCopied] = useState(false);

  const roomId = searchParams.get('roomId') || '';
  const role = (searchParams.get('role') as 'tracker' | 'tracked') || 'tracked';

  const {
    socket,
    connected,
    roomState,
    trackerLocation,
    trackedUsers,
    error,
    broadcastLocation,
  } = useSocket(roomId, userId, role);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (role === 'tracked' && trackerLocation) {
      setCurrentView(trackerLocation);
    }
  }, [role, trackerLocation]);

  const handleLocationChange = useCallback(
    (lat: number, lng: number, zoom: number, tilt?: number) => {
      const nextView: ViewState = { lat, lng, zoom, tilt, timestamp: Date.now() };
      setCurrentView(nextView);
      if (role === 'tracker') {
        broadcastLocation(lat, lng, zoom, tilt);
      }
    },
    [role, broadcastLocation]
  );

  const handleLeaveSession = () => {
    if (socket) {
      socket.disconnect();
    }
    router.push('/');
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!roomId || !role) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Invalid session parameters</p>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background relative overflow-hidden">
      {/* Map Container */}
      <div className="w-full h-full">
        <MapView
          role={role}
          trackerLocation={trackerLocation}
          onLocationChange={handleLocationChange}
        />
      </div>

      {/* HUD Overlay */}
      <HUDOverlay
        roomId={roomId}
        role={role}
        roomState={roomState}
        trackerLocation={currentView}
        connected={connected}
        error={error}
        trackedUserCount={trackedUsers.size}
      />

      {/* Global Controls */}
      <div className="absolute top-20 right-3 z-50 pointer-events-auto flex items-center gap-2 sm:top-16 sm:right-4">
        <button
          onClick={handleLeaveSession}
          className="p-2 rounded-lg bg-card hover:bg-secondary text-foreground transition-all border border-border hover:border-primary"
          title="Leave session"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-card hover:bg-secondary text-foreground transition-all border border-border hover:border-primary"
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Room ID Tab */}
      <div className="absolute top-36 right-3 z-50 pointer-events-auto sm:top-28 sm:right-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur max-w-[85vw] sm:max-w-none">
          <span className="text-muted-foreground">Room</span>
          <span className="font-mono font-semibold text-foreground truncate max-w-[9rem] sm:max-w-none">{roomId}</span>
          <button
            onClick={handleCopyRoomId}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 hover:border-primary/40"
            title="Copy room ID"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Debug Info - Development Only */}
      {process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_DEBUG === 'true' && (
        <div className="hidden md:block absolute bottom-16 right-4 bg-card/90 backdrop-blur border border-border rounded-lg p-2 text-xs text-foreground font-mono max-w-xs z-50">
          <div>User ID: {userId.slice(0, 8)}</div>
          <div>Socket ID: {socket?.id?.slice(0, 8) || 'N/A'}</div>
          <div>Connected: {connected ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}
