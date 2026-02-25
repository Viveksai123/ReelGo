const http = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const host = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname: host, port });
const handle = app.getRequestHandler();

const rooms = new Map();
const lastLocationUpdate = new Map();
const THROTTLE_INTERVAL = 100;

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: true,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    socket.on('join-room', (data) => {
      const { roomId, userId, role } = data || {};
      if (!roomId || !userId || !role) return;

      const previousRoom = socket.data.roomId;
      if (previousRoom) {
        socket.leave(previousRoom);
        const oldRoom = rooms.get(previousRoom);
        if (oldRoom) {
          if (socket.data.role === 'tracker') {
            oldRoom.tracker = undefined;
          } else if (socket.data.userId) {
            oldRoom.tracked.delete(socket.data.userId);
          }

          if (!oldRoom.tracker && oldRoom.tracked.size === 0) {
            rooms.delete(previousRoom);
          }
        }
      }

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.userId = userId;
      socket.data.role = role;

      if (!rooms.has(roomId)) {
        rooms.set(roomId, { tracker: undefined, tracked: new Map() });
      }

      const room = rooms.get(roomId);
      if (!room) return;

      if (role === 'tracker') {
        room.tracker = { id: userId, role, location: room.tracker?.location };
        io.to(roomId).emit('tracker-joined', { trackerId: userId });
      } else {
        room.tracked.set(userId, { id: userId, role });
        io.to(roomId).emit('tracked-joined', { trackedId: userId });

        if (room.tracker?.location) {
          socket.emit('location-update', {
            trackerId: room.tracker.id,
            location: room.tracker.location,
          });
        }
      }

      socket.emit('room-state', {
        roomId,
        tracker: room.tracker,
        trackedCount: room.tracked.size,
      });
    });

    socket.on('broadcast-location', (data) => {
      const roomId = socket.data.roomId;
      if (!roomId || socket.data.role !== 'tracker') return;

      const now = Date.now();
      const lastUpdate = lastLocationUpdate.get(socket.id) || 0;
      if (now - lastUpdate < THROTTLE_INTERVAL) return;

      lastLocationUpdate.set(socket.id, now);

      const room = rooms.get(roomId);
      if (!room || !room.tracker || room.tracker.id !== socket.data.userId) return;

      const lat = Number(data?.lat);
      const lng = Number(data?.lng);
      const zoom = Number(data?.zoom);
      const tilt = typeof data?.tilt === 'number' ? Number(data.tilt) : 0;
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        !Number.isFinite(zoom) ||
        !Number.isFinite(tilt)
      ) {
        return;
      }

      const location = {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        zoom: Number(zoom.toFixed(2)),
        tilt: Number(tilt.toFixed(2)),
        timestamp: now,
      };

      room.tracker.location = location;

      io.to(roomId).emit('location-update', {
        trackerId: socket.data.userId,
        location,
      });
    });

    socket.on('location-ack', () => {
      // Optional telemetry hook.
    });

    socket.on('disconnect', () => {
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;
      const role = socket.data.role;

      if (roomId && userId) {
        const room = rooms.get(roomId);
        if (room) {
          if (role === 'tracker') {
            room.tracker = undefined;
            socket.to(roomId).emit('tracker-left', { trackerId: userId });
          } else {
            room.tracked.delete(userId);
            socket.to(roomId).emit('tracked-left', { trackedId: userId });
          }

          if (!room.tracker && room.tracked.size === 0) {
            rooms.delete(roomId);
          }
        }
      }

      lastLocationUpdate.delete(socket.id);
    });
  });

  server.listen(port, host, () => {
    console.log('> Ready on http://localhost:' + port);
    console.log('> Socket.IO listening on /socket.io');
  });
});
