# Sync Map - Local Development & Setup

This document covers setting up and running Sync Map locally for development.

## Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Latest version (install with `npm install -g pnpm`)
- **Git**: For version control

## Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd sync-map

# Install dependencies
pnpm install
```

### 2. Run Development Server

```bash
# Start the Next.js development server
pnpm dev
```

The application will be available at: **http://localhost:3000**

HMR (Hot Module Replacement) is enabled, so changes will reflect instantly.

## First Steps

### Test Local Functionality

1. **Open the App:**
   - Visit `http://localhost:3000` in your browser

2. **Create a Session:**
   - Click "Create New Room" to generate a room ID
   - You'll automatically become the "Tracker"
   - Your geolocation permission will be requested

3. **Join as Tracked User:**
   - Open another browser tab/window
   - Go to `http://localhost:3000`
   - Paste the room ID
   - Select "Tracked" role
   - Join the session
   - You should see the Tracker's location on the map

### Verify Real-Time Sync

- Both users should see the same location
- Movement should sync within 100ms
- Connection status should show "Connected" in the HUD

## Theme Testing

The application supports both light and dark themes:

### Test Light Theme
1. Open Developer Tools (F12)
2. Go to Console
3. Run: `localStorage.setItem('theme', 'light')`
4. Refresh page
5. App should display in light mode

### Test Dark Theme
```javascript
localStorage.setItem('theme', 'dark')
// Refresh page
```

### Test System Theme
```javascript
localStorage.setItem('theme', 'system')
// Refresh page
// App will follow your system preference
```

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting (if configured)
pnpm lint

# Run tests (if configured)
pnpm test
```

## Project Structure

```
sync-map/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Home page (room join)
│   ├── globals.css             # Global styles & theme tokens
│   ├── not-found.tsx           # 404 page
│   ├── api/
│   │   └── socket/route.ts     # Socket.io API route
│   └── session/
│       └── page.tsx            # Session page
├── components/
│   ├── map-view.tsx            # Canvas-based map component
│   ├── hud-overlay.tsx         # Heads-up display with stats
│   ├── session-client.tsx      # Session container component
│   ├── connection-status.tsx   # Connection indicator
│   ├── error-boundary.tsx      # Error handling
│   ├── theme-provider.tsx      # Theme context provider
│   ├── theme-toggle.tsx        # Theme switcher button
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── use-socket.ts           # Socket.io hook
├── lib/
│   ├── socket-server.ts        # Socket.io server logic
│   ├── socket-handler.ts       # Socket event handlers
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── package.json                # Dependencies
├── next.config.mjs            # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── README.md                  # Project documentation
├── SETUP.md                   # This file
└── DEPLOYMENT.md              # Deployment guide
```

## Key Features

### Real-Time Location Sync
- Sub-100ms latency with event throttling
- WebSocket (Socket.io) for bidirectional communication
- Automatic reconnection with exponential backoff

### Two User Roles
- **Tracker**: Broadcasts your live location
- **Tracked**: Receives location updates in real-time

### Classic UI with Theme Support
- Light and dark themes with semantic color tokens
- Clean, professional interface
- Responsive design for mobile and desktop

### Canvas-Based Map
- Grid-based visualization
- Zoom controls
- Live position indicators
- Location data display

### Production-Ready
- Error boundaries for graceful error handling
- Connection status monitoring
- Comprehensive logging for debugging
- TypeScript for type safety

## Environment Variables

The application works out of the box with no required environment variables.

**Optional:**
- `NODE_ENV`: Automatically set to `development` or `production`

## Debugging

### Enable Debug Logging

Add this to your browser console:
```javascript
// Check Socket.io connection
console.log(window.io)

// Check theme
console.log(localStorage.getItem('theme'))
```

### Browser DevTools

The HUD overlay shows:
- Room ID
- Connection status
- User role
- Location coordinates
- Connected user count (for Tracker)

### Development-Only Debug Info

When `NODE_ENV === 'development'`, a debug panel appears showing:
- User ID
- Socket ID
- Connection status

## Common Issues & Solutions

### Issue: Geolocation Permission Denied
**Solution:**
1. Click the location icon in browser address bar
2. Select "Allow" for location access
3. Refresh the page
4. Default NYC location will be used if denied

### Issue: Two Users Not Syncing
**Solution:**
1. Verify both are in the same room (check room ID)
2. Ensure Tracker user granted location permission
3. Check browser console for connection errors
4. Verify both users are connected (connection status = "Connected")

### Issue: Map Not Displaying
**Solution:**
1. Clear browser cache
2. Refresh the page
3. Check browser console for errors
4. Verify JavaScript is enabled

### Issue: Theme Not Persisting
**Solution:**
```javascript
// Clear theme storage and reset
localStorage.removeItem('theme')
// Refresh page - will use system preference
```

## Performance Tips

### For Development
- The app throttles location updates to 100ms
- Use React DevTools to profile component renders
- Check Network tab to monitor Socket.io messages

### For Production
- Theme is cached in localStorage
- Components use React.memo for optimization
- Canvas rendering is efficient with requestAnimationFrame

## Next Steps

1. **Explore the Code:**
   - Start with `app/page.tsx` for the home page
   - Check `components/map-view.tsx` for map implementation
   - Review `hooks/use-socket.ts` for Socket.io integration

2. **Make Changes:**
   - Modify components and see live updates with HMR
   - Test different themes and layouts
   - Add your own features

3. **Deploy:**
   - See `DEPLOYMENT.md` for Vercel and Render instructions
   - Test everything locally first
   - Use preview deployments before going live

## Learning Resources

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Socket.io**: https://socket.io/docs/v4/client-api/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Review the connection status in the HUD
3. See the troubleshooting section above
4. Check GitHub issues or create a new one

---

Happy developing! 🚀
