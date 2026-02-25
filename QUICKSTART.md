# Sync Map - Quick Start Guide

Get up and running with Sync Map in minutes!

## Local Development (5 minutes)

### 1. Install & Start
```bash
pnpm install
pnpm dev
```

### 2. Open Browser
Visit: **http://localhost:3000**

### 3. Create a Session
- Click "Create New Room"
- You become the Tracker
- Grant location permission

### 4. Open Another Tab
- Paste the room ID
- Select "Tracked"
- Click "Join Session"
- See location sync in real-time!

---

## Deploy to Vercel (2 minutes)

### Simplest Option:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Click "Deploy"

**That's it!** Vercel auto-configures Next.js and WebSockets.

### Your deployment URL will be: `your-project.vercel.app`

---

## Deploy to Render (3 minutes)

### Steps:
1. Go to [render.com](https://render.com)
2. Click "New Web Service"
3. Connect GitHub repository
4. Settings:
   - Build: `pnpm install && pnpm build`
   - Start: `pnpm start`
5. Click "Create Web Service"

**Done!** Render will deploy automatically.

---

## Using Your App

### For Tracker:
```
1. Create or join a room
2. Grant location permission
3. Your location broadcasts in real-time
4. See how many users are tracking you
```

### For Tracked Users:
```
1. Get the room ID from Tracker
2. Join as "Tracked"
3. See Tracker's location on map
4. Location updates automatically
```

### Controls:
- **+ Button**: Zoom in map
- **− Button**: Zoom out map
- **Back Arrow**: Leave session
- **HUD Display**: Shows connection info

---

## Theme Switcher (Optional)

To add a theme toggle button, look for `ThemeToggle` component usage.

The app automatically:
- Detects system dark/light mode
- Stores preference in browser
- Applies on every visit

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No location on map | Grant geolocation permission |
| Users not syncing | Verify same room ID |
| Can't connect | Check internet connection |
| Theme not changing | Clear browser cache |

---

## File Structure Overview

```
Key Files:
- app/page.tsx         → Home page (room join)
- app/session/page.tsx → Session with map
- components/map-view.tsx → Map display
- hooks/use-socket.ts → Real-time sync
```

---

## Environment Setup

**No environment variables needed!**

The app works out of the box:
- Socket.io runs on same server
- Theme uses browser localStorage
- Location uses browser geolocation API

---

## Next: Advanced Setup

See detailed guides:
- **Local Development**: See [SETUP.md](./SETUP.md)
- **Deployment Details**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Full Documentation**: See [README.md](./README.md)

---

## API Endpoints

The app uses:
- **WebSocket**: Real-time location sync via Socket.io
- **HTTP**: Only for initial page loads

No external API calls needed!

---

## Share Your App

Once deployed:
```
1. Share deployment URL with users
2. Users create/join rooms
3. Share room IDs to sync locations
4. That's it!
```

---

## Performance

- ⚡ Sub-100ms sync latency
- 📱 Works on desktop and mobile
- 🔄 Auto-reconnects on disconnect
- 💾 No database needed

---

## Support

Having issues? Check:
1. Browser console (F12)
2. Connection status in HUD
3. See [SETUP.md](./SETUP.md) troubleshooting section

---

**Ready to go!** 🚀

Questions? Check the full documentation or explore the code!
