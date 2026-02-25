# Socket.io Connection Troubleshooting

## Error: ERR_CONNECTION_REFUSED

If you see errors like:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
GET http://localhost:3000/socket.io/?EIO=4&transport=polling net::ERR_CONNECTION_REFUSED
```

### Root Cause
The Socket.io server is not running or responding to connection attempts.

### Solution 1: Restart Development Server (MOST COMMON FIX)

```bash
# Stop the current dev server (Ctrl+C)
# Clear Node cache
rm -rf node_modules/.vite

# Start fresh
pnpm dev
# or: npm run dev
```

Wait 5-10 seconds for the dev server to fully start before testing in the browser.

### Solution 2: Clear Browser Cache & Reload

1. **Hard refresh the page**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Or open DevTools**: F12 → Application → Storage → Clear All
3. Reload the page: `F5` or `Ctrl+R`

### Solution 3: Check Port 3000 is Available

```bash
# On Mac/Linux - check if port 3000 is in use
lsof -i :3000

# On Windows - check if port 3000 is in use
netstat -ano | findstr :3000

# Kill any process on 3000 if needed:
# Mac/Linux: kill -9 <PID>
# Windows: taskkill /PID <PID> /F
```

Then restart: `pnpm dev`

### Solution 4: Check Socket.io API Route

Verify the Socket.io handler is in place:
- File should exist: `/vercel/share/v0-project/app/api/socket/route.ts`
- This route handles Socket.io WebSocket connections

### Solution 5: Check Firewall/VPN

- **Disable VPN** temporarily and test
- **Check firewall settings** - allow connections to localhost:3000
- **Check browser extensions** - disable any that might block connections

### Solution 6: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Create a session (join room)
4. Look for Socket.io connections:
   - `socket.io` requests should show status **200** or **101** (upgrade)
   - If you see **Connection Refused**, the server isn't running
   - If you see **timeout**, there's a network/firewall issue

### Solution 7: Verify Environment

Make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ All dependencies installed (`pnpm install`)
- ✅ Dev server running on port 3000
- ✅ Modern browser (Chrome, Firefox, Safari, Edge)

### Solution 8: Full Reset

Complete system reset:

```bash
# Stop dev server (Ctrl+C if running)

# Clean everything
rm -rf node_modules
rm -rf .next
rm pnpm-lock.yaml 2>/dev/null || rm package-lock.json 2>/dev/null

# Reinstall
pnpm install

# Start fresh
pnpm dev
```

Wait 10 seconds, then go to http://localhost:3000

## Common Scenarios

### Scenario 1: Just Started Dev Server
**Problem**: I just ran `pnpm dev` but Socket.io shows connection error immediately
**Solution**: Wait 5-10 seconds for the server to fully initialize before testing

### Scenario 2: Dev Server Hangs
**Problem**: Terminal shows "Ready in X ms" but connections refused
**Solution**: 
1. Stop (Ctrl+C)
2. Clear: `rm -rf .next node_modules/.vite`
3. Restart: `pnpm dev`

### Scenario 3: Works Locally But Not on Phone/Other Device
**Problem**: Can connect on localhost:3000 on same machine, but not from other device
**Solution**:
1. Find your machine's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Try: `http://<YOUR_IP>:3000` from other device
3. May need to allow port 3000 in firewall
4. This is normal local dev behavior - works fine when deployed

### Scenario 4: Multiple Dev Servers Running
**Problem**: Two terminals both running `pnpm dev`
**Solution**: Stop all except one, then restart

## Geolocation Errors

If you see: `GeolocationPositionError`

### Solutions:
1. **Grant Permission**: Browser should ask for location - click "Allow"
2. **Check HTTPS/Localhost**: Geolocation requires secure context (HTTPS or localhost)
3. **Enable GPS**: On mobile devices, ensure GPS is enabled
4. **Check Browser Privacy Settings**: 
   - Chrome: Settings → Privacy → Site Settings → Location
   - Firefox: Preferences → Privacy → Permissions → Location

## HUD Text Overlap Issue

**Fixed in latest version**: Text now has `max-width` and `truncate` classes to prevent overlap.

If you still see overlapping text:
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Update to latest code

## Still Having Issues?

### Debug Info to Gather
When reporting issues, include:
1. Browser console errors (F12 → Console tab)
2. Network errors (F12 → Network tab)
3. Your Node.js version: `node --version`
4. OS (Windows/Mac/Linux)
5. Exact error message

### Manual Socket.io Test

In browser console (F12 → Console), try:
```javascript
// Check if Socket.io is loaded
console.log(io);

// Should output: ƒ io(url, opts) { return manager(...) }
// If undefined, Socket.io library didn't load
```

### Check Server Logs

Look at terminal output when `pnpm dev` is running:
- Should show Next.js is ready
- Should show compilation complete
- Look for errors starting with `[error]` or red text

If you see errors, share them in bug report.

## Deployment Issues

If everything works locally but fails on Vercel/Render:

### Vercel
- Socket.io WebSocket works automatically
- Make sure `NEXT_PUBLIC_APP_URL` is not set (remove it)
- Vercel handles proxy setup automatically

### Render
- Socket.io works with Node.js apps
- Check build command: `pnpm install && pnpm build`
- Check start command: `pnpm start`
- Allow minimum 512MB RAM for Node app

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment setup.
