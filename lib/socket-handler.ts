import { Socket as ServerSocket } from 'socket.io';

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

export class SocketHandler {
  private rooms = new Map<string, Room>();
  private lastLocationUpdate = new Map<string, number>();
  private readonly THROTTLE_INTERVAL = 100; // 100ms throttle

  handleConnection(socket: ServerSocket) {
    console.log('[Socket] Client connected:', socket.id);

    socket.on('join-room', (data: { roomId: string; userId: string; role: 'tracker' | 'tracked' }) => {
      this.handleJoinRoom(socket, data);
    });

    socket.on('broadcast-location', (data: { lat: number; lng: number; zoom: number }) => {
      this.handleBroadcastLocation(socket, data);
    });

    socket.on('location-ack', (data: { trackerId: string; timestamp: number }) => {
      this.handleLocationAck(socket, data);
    });

    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });

    socket.on('error', (error) => {
      console.error('[Socket] Error:', error);
    });
  }

  private handleJoinRoom(
    socket: ServerSocket,
    data: { roomId: string; userId: string; role: 'tracker' | 'tracked' }
  ) {
    const { roomId, userId, role } = data;

    // Leave previous room if any
    const previousRoom = socket.data.roomId;
    if (previousRoom) {
      socket.leave(previousRoom);
      const room = this.rooms.get(previousRoom);
      if (room) {
        if (socket.data.role === 'tracker') {
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
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        tracker: undefined,
        tracked: new Map(),
      });
    }

    const room = this.rooms.get(roomId)!;
    const userSession: UserSession = { id: userId, role };

    if (role === 'tracker') {
      room.tracker = userSession;
      socket.to(roomId).emit('tracker-joined', { trackerId: userId });
    } else {
      room.tracked.set(userId, userSession);
      socket.to(roomId).emit('tracked-joined', { trackedId: userId });

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
  }

  private handleBroadcastLocation(socket: ServerSocket, data: { lat: number; lng: number; zoom: number }) {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const now = Date.now();
    const lastUpdate = this.lastLocationUpdate.get(socket.id) || 0;

    // Throttle updates
    if (now - lastUpdate < this.THROTTLE_INTERVAL) {
      return;
    }

    this.lastLocationUpdate.set(socket.id, now);

    const room = this.rooms.get(roomId);
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

    // Broadcast to all users in the room
    socket.to(roomId).emit('location-update', {
      trackerId: socket.data.userId,
      location: locationData,
    });
  }

  private handleLocationAck(socket: ServerSocket, data: { trackerId: string; timestamp: number }) {
    const latency = Date.now() - data.timestamp;
    console.log(`[Socket] Location ACK from ${socket.data.userId}: ${latency}ms latency`);
  }

  private handleDisconnect(socket: ServerSocket) {
    const roomId = socket.data.roomId;
    const userId = socket.data.userId;
    const role = socket.data.role;

    if (roomId) {
      const room = this.rooms.get(roomId);
      if (room) {
        if (role === 'tracker') {
          room.tracker = undefined;
          socket.to(roomId).emit('tracker-left', { trackerId: userId });
        } else {
          room.tracked.delete(userId);
          socket.to(roomId).emit('tracked-left', { trackedId: userId });
        }

        // Clean up empty rooms
        if (!room.tracker && room.tracked.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    }

    this.lastLocationUpdate.delete(socket.id);
    console.log('[Socket] Client disconnected:', socket.id);
  }

  getRoomStats() {
    return {
      totalRooms: this.rooms.size,
      rooms: Array.from(this.rooms.entries()).map(([id, room]) => ({
        id,
        tracker: room.tracker?.id,
        trackedCount: room.tracked.size,
      })),
    };
  }
}
