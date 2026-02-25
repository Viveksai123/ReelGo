'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

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

export function useSocket(
  roomId: string,
  userId: string,
  role: 'tracker' | 'tracked'
) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [trackerLocation, setTrackerLocation] = useState<LocationData | null>(null);
  const [trackedUsers, setTrackedUsers] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!roomId || !userId) return;
    const socketBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

    const socket = io(socketBaseUrl, {
      path: '/socket.io',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[useSocket] Connected:', socket.id);
      setConnected(true);
      setError(null);

      // Join room
      socket.emit('join-room', { roomId, userId, role });
    });

    socket.on('disconnect', () => {
      console.log('[useSocket] Disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[useSocket] Connection error:', err);
      setError('Connection error: ' + err.message);
    });

    socket.on('room-state', (state: RoomState) => {
      console.log('[useSocket] Room state:', state);
      setRoomState(state);
    });

    socket.on('location-update', (data: { trackerId: string; location: LocationData }) => {
      console.log('[useSocket] Location update:', data);
      setTrackerLocation(data.location);

      // Send acknowledgment
      socket.emit('location-ack', {
        trackerId: data.trackerId,
        timestamp: data.location.timestamp,
      });
    });

    socket.on('tracker-joined', (data: { trackerId: string }) => {
      console.log('[useSocket] Tracker joined:', data.trackerId);
      setRoomState((prev) => (prev ? { ...prev, tracker: { id: data.trackerId, role: 'tracker' } } : null));
    });

    socket.on('tracker-left', () => {
      console.log('[useSocket] Tracker left');
      setRoomState((prev) => (prev ? { ...prev, tracker: undefined } : null));
      setTrackerLocation(null);
    });

    socket.on('tracked-joined', (data: { trackedId: string }) => {
      console.log('[useSocket] Tracked user joined:', data.trackedId);
      setTrackedUsers((prev) => new Set([...prev, data.trackedId]));
    });

    socket.on('tracked-left', (data: { trackedId: string }) => {
      console.log('[useSocket] Tracked user left:', data.trackedId);
      setTrackedUsers((prev) => {
        const next = new Set(prev);
        next.delete(data.trackedId);
        return next;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomId, userId, role]);

  const broadcastLocation = useCallback((lat: number, lng: number, zoom: number, tilt?: number) => {
    if (socketRef.current && connected && role === 'tracker') {
      socketRef.current.emit('broadcast-location', { lat, lng, zoom, tilt });
    }
  }, [connected, role]);

  return {
    socket: socketRef.current,
    connected,
    roomState,
    trackerLocation,
    trackedUsers,
    error,
    broadcastLocation,
  };
}
