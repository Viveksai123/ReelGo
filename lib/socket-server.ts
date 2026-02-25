import { Server as HTTPServer } from 'http';
import { Socket as ServerSocket, Server as SocketIOServer } from 'socket.io';

interface LocationData {
  lat: number;
  lng: number;
  zoom: number;
  timestamp: number;
}

interface UserSession {
  id: string;
  role: 'tracker' | 'tracked';
  location?: LocationData;
}

interface Room {
  tracker?: UserSession;
  tracked: Map<string, UserSession>;
}

// Store active rooms
const rooms = new Map<string, Room>();

// Store last location for each user (for throttling)
const lastLocationUpdate = new Map<string, number>();

const THROTTLE_INTERVAL = 100; // 100ms throttle

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'
        : 'http://localhost:3000',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: ServerSocket) => {
    console.log('[Socket] Client connected:', socket.id);

    // User joins a room
    socket.on('join-room', (data: { roomId: string; userId: string; role: 'tracker' | 'tracked' }) => {
      const { roomId, userId, role } = data;

      // Leave previous room if any
      const previousRoom = socket.data.roomId;
      if (previousRoom) {
        socket.leave(previousRoom);
        const room = rooms.get(previousRoom);
        if (room) {
          if (role === 'tracker') {
            room.tracker = undefined;
          } else {
            room.tracked.delete(userId);
          }
        }
      }

      // Join new room
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.userId = userId;
      socket.data.role = role;

      // Initialize room if needed
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          tracker: undefined,
          tracked: new Map(),
        });
      }

      const room = rooms.get(roomId)!;
      const userSession: UserSession = { id: userId, role };

      if (role === 'tracker') {
        room.tracker = userSession;
        // Notify tracked users that a tracker joined
        io.to(roomId).emit('tracker-joined', { trackerId: userId });
      } else {
        room.tracked.set(userId, userSession);
        // Notify that a tracked user joined
        io.to(roomId).emit('tracked-joined', { trackedId: userId });

        // Send current location to the new tracked user if tracker exists
        if (room.tracker?.location) {
          socket.emit('location-update', {
            trackerId: room.tracker.id,
            location: room.tracker.location,
          });
        }
      }

      // Send room state to the joining user
      const roomState = {
        roomId,
        tracker: room.tracker,
        trackedCount: room.tracked.size,
      };
      socket.emit('room-state', roomState);

      console.log(`[Socket] User ${userId} joined room ${roomId} as ${role}`);
    });

    // Tracker broadcasts location
    socket.on('broadcast-location', (data: { lat: number; lng: number; zoom: number }) => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const now = Date.now();
      const lastUpdate = lastLocationUpdate.get(socket.id) || 0;

      // Throttle updates
      if (now - lastUpdate < THROTTLE_INTERVAL) {
        return;
      }

      lastLocationUpdate.set(socket.id, now);

      const room = rooms.get(roomId);
      if (!room || room.tracker?.id !== socket.data.userId) {
        return; // Only tracker can broadcast
      }

      const locationData: LocationData = {
        lat: data.lat,
        lng: data.lng,
        zoom: data.zoom,
        timestamp: now,
      };

      // Update tracker's location
      if (room.tracker) {
        room.tracker.location = locationData;
      }

      // Broadcast to all tracked users in the room
      io.to(roomId).emit('location-update', {
        trackerId: socket.data.userId,
        location: locationData,
      });
    });

    // Tracked user acknowledges location
    socket.on('location-ack', (data: { trackerId: string; timestamp: number }) => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      // Optionally log or store for analytics
      const latency = Date.now() - data.timestamp;
      console.log(`[Socket] Location ACK from ${socket.data.userId}: ${latency}ms latency`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;
      const role = socket.data.role;

      if (roomId) {
        const room = rooms.get(roomId);
        if (room) {
          if (role === 'tracker') {
            room.tracker = undefined;
            io.to(roomId).emit('tracker-left', { trackerId: userId });
          } else {
            room.tracked.delete(userId);
            io.to(roomId).emit('tracked-left', { trackedId: userId });
          }

          // Clean up empty rooms
          if (!room.tracker && room.tracked.size === 0) {
            rooms.delete(roomId);
          }
        }
      }

      lastLocationUpdate.delete(socket.id);
      console.log('[Socket] Client disconnected:', socket.id);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('[Socket] Error:', error);
    });
  });

  return io;
}

export function getSocketIO(): SocketIOServer | null {
  // This will be populated by the API route
  return null;
}
