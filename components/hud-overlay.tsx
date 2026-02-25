'use client';

import { MapPin, Signal, Users, AlertCircle, Radio } from 'lucide-react';

interface LocationData {
  lat: number;
  lng: number;
  zoom: number;
  tilt?: number;
  timestamp: number;
}

interface RoomState {
  roomId: string;
  tracker?: { id: string; role: string };
  trackedCount: number;
}

interface HUDOverlayProps {
  roomId: string;
  role: 'tracker' | 'tracked';
  roomState: RoomState | null;
  trackerLocation: LocationData | null;
  connected: boolean;
  error?: string | null;
  trackedUserCount: number;
}

function statusStyle(connected: boolean, error?: string | null) {
  if (error) return 'border-red-400/70 bg-red-500/10 text-red-700 dark:text-red-300';
  if (connected) return 'border-emerald-400/70 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  return 'border-amber-400/70 bg-amber-500/10 text-amber-700 dark:text-amber-300';
}

function statusText(connected: boolean, error?: string | null) {
  if (error) return 'Error';
  if (connected) return 'Connected';
  return 'Searching...';
}

export function HUDOverlay({
  roomId,
  role,
  roomState,
  trackerLocation,
  connected,
  error,
  trackedUserCount,
}: HUDOverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none p-3 sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-between">
        <div className="pointer-events-auto flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="rounded-xl border border-border/70 bg-card/92 px-3 py-2 shadow-lg backdrop-blur sm:max-w-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Room ID</span>
            </div>
            <div className="mt-1 break-all font-mono text-sm font-semibold text-foreground">{roomId}</div>
          </div>

          <div className={`rounded-xl border px-3 py-2 shadow-lg backdrop-blur sm:max-w-sm ${statusStyle(connected, error)}`}>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
              <span>{statusText(connected, error)}</span>
            </div>
            {error && <div className="mt-1 break-words text-xs">{error}</div>}
          </div>
        </div>

        <div className="pointer-events-auto mb-14 sm:mb-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-lg border border-border/70 bg-card/92 px-3 py-1.5 text-xs shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Radio className="h-3.5 w-3.5 text-primary" />
                <span>{role === 'tracker' ? 'Broadcasting' : 'Receiving'}</span>
              </div>
            </div>

            {role === 'tracker' && (
              <div className="rounded-lg border border-border/70 bg-card/92 px-3 py-1.5 text-xs shadow-lg backdrop-blur text-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{trackedUserCount + 1} users</span>
                </div>
              </div>
            )}

            {role === 'tracked' && (
              <div className="rounded-lg border border-border/70 bg-card/92 px-3 py-1.5 text-xs shadow-lg backdrop-blur">
                <div className="flex items-center gap-2">
                  {roomState?.tracker ? (
                    <>
                      <Signal className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-300">Tracker active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-700 dark:text-amber-300">Waiting tracker</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {trackerLocation && (
              <div className="rounded-lg border border-border/70 bg-card/92 px-3 py-1.5 text-xs shadow-lg backdrop-blur">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-foreground/90">
                  <span>Lat {trackerLocation.lat.toFixed(5)}</span>
                  <span>Lng {trackerLocation.lng.toFixed(5)}</span>
                  <span>Z {trackerLocation.zoom}x</span>
                  <span>Tilt {(trackerLocation.tilt ?? 0).toFixed(1)} deg</span>
                </div>
              </div>
            )}
            </div>
          </div>
      </div>
    </div>
  );
}


