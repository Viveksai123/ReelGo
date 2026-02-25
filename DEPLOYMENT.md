# Deployment Guide for Sync Map

This guide covers deploying the Sync Map application to Vercel and Render.

## Prerequisites

- Node.js 18+ and pnpm installed
- Git repository initialized
- GitHub account (for both Vercel and Render deployments)

## Deployment to Vercel

Vercel is the recommended platform as it has first-class Next.js support and native WebSocket support.

### Step 1: Prepare for Deployment

1. Ensure all changes are committed to Git:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. Update environment variables if needed in `.env.local`

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts:
   - Link to existing project or create new
   - Confirm project settings
   - Set environment variables if needed

**Option B: Using Vercel Dashboard**

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Configure project settings:
   - Framework: Next.js (auto-detected)
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Environment Variables: (add any needed)
6. Click "Deploy"

### Step 3: Configure Vercel for WebSocket Support

The app uses Socket.io which requires WebSocket support. Vercel supports this natively:

1. No additional configuration needed - Vercel automatically enables WebSocket support
2. Your Socket.io connection will work out of the box

### Vercel Deployment Tips

- Use Vercel Preview URLs to test before production
- Enable automatic deployments on every git push
- Use Environment Variables for sensitive config
- Monitor your project at [vercel.com/dashboard](https://vercel.com/dashboard)

---

## Deployment to Render

Render is a good alternative if you prefer a different hosting provider.

### Step 1: Prepare Your Application

1. Ensure your code is committed and pushed to GitHub
2. Create a `render.yaml` configuration file (optional but recommended)

### Step 2: Create Render Service

1. Visit [render.com](https://render.com)
2. Sign in or create account
3. Click "New +"
4. Select "Web Service"
5. Connect your GitHub repository
6. Configure the service:

**Basic Configuration:**
- Name: `sync-map` (or your preferred name)
- Environment: `Node`
- Region: Choose closest to your users
- Branch: `main` (or your deployment branch)
- Build Command: `pnpm install && pnpm build`
- Start Command: `pnpm start`

**Advanced Settings:**
- Runtime: `node-18` or higher
- Auto-deploy: Enable to deploy on every push

### Step 3: Set Environment Variables (Render)

1. In your service settings, go to "Environment"
2. Add variables if needed (usually none required for this app)
3. Save and redeploy

### Step 4: Enable WebSocket Support (Render)

Render supports WebSockets natively:
1. No additional configuration needed
2. Socket.io will work automatically
3. Connection will use HTTP polling as fallback if needed

### Step 5: Monitor Your Deployment

1. Check deployment logs in Render dashboard
2. Visit your deployed app at the provided URL
3. Test Socket.io connection by creating a room and testing sync

---

## Testing After Deployment

### Test Real-Time Sync

1. **Test Tracker Role:**
   - Open your app URL
   - Select "Tracker" role
   - Create a new room
   - Your location should update in real-time

2. **Test Tracked Role:**
   - Open the app in another browser/tab
   - Select "Tracked" role
   - Join the room created by the Tracker
   - You should receive location updates

3. **Test Multiple Users:**
   - Open multiple Tracked user sessions
   - Each should receive the Tracker's location

### Verify WebSocket Connection

Check browser console:
```javascript
// In browser DevTools Console
// You should see Socket.io connection messages
```

---

## Environment Variables

The application works with minimal environment configuration. No secrets are required for basic operation.

**Optional Variables:**
- `NODE_ENV`: Set to `production` (auto-set by hosting platforms)

---

## Monitoring & Troubleshooting

### Common Issues

**1. WebSocket Connection Fails**
- Check if your hosting platform supports WebSockets (both do)
- Verify your server is running
- Check browser console for connection errors

**2. Locations Not Syncing**
- Ensure both users are in the same room
- Check network tab for Socket.io events
- Verify geolocation permission is granted

**3. CORS Issues**
- The app doesn't make cross-origin requests
- If issues occur, check browser console for details

### Useful Debug Commands

Add this to your browser console to debug Socket.io:
```javascript
// Check Socket.io version
window.io

// Check connection status
// Will appear in HUD on page
```

---

## Performance Optimization

### Current Optimizations
- Event throttling: 100ms between location broadcasts
- React.memo for components
- Efficient canvas rendering
- Room-based message routing

### For Better Performance

1. **Vercel:**
   - Use Vercel Edge Functions for even faster responses
   - Enable Caching for static assets

2. **Render:**
   - Choose a region close to your users
   - Scale to Pro plan if needed for more resources

---

## Scaling Your Application

### For Growing User Base

1. **Vercel:**
   - Auto-scales automatically
   - Monitor usage in dashboard
   - Upgrade plan if needed

2. **Render:**
   - Upgrade from free to paid tier
   - Use background workers for heavy computation
   - Consider load balancing for multiple instances

### Database (Future Enhancement)

If you add persistent storage:
1. Use Vercel Postgres or Render PostgreSQL
2. Configure connection pooling
3. Set up automated backups

---

## Rollback & Updates

### Rollback (Vercel)
1. Go to Deployments tab
2. Click on a previous deployment
3. Click "Rollback"

### Rollback (Render)
1. Go to Deployment history
2. Click "Redeploy" on a previous version

### Update Your Application
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Both Vercel and Render will auto-deploy
```

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Socket.io Docs:** https://socket.io/docs/

---

## Next Steps

1. Deploy to Vercel or Render using the steps above
2. Test real-time synchronization
3. Share your deployment URL with users
4. Monitor for any issues
5. Consider adding features like:
   - User authentication
   - Session history
   - Location markers/polylines
   - Custom room names
   - Export location data
