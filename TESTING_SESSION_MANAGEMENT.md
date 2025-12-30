# Testing the Session Management System

## Quick Test Checklist

Use this checklist to verify the session management system is working correctly.

### ✅ Test 1: Basic Login Flow
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Verify redirect to `/admin` dashboard
4. Check browser console for session logs:
   - `[Supabase] Session expires at: [timestamp]`
   - `[Auth] Session valid - expires in X minutes`

**Expected:** Successful login with detailed session logging

---

### ✅ Test 2: Tab Reactivation (Short Duration)
1. Login to admin panel
2. Switch to another tab/window for 2-3 minutes
3. Return to admin tab
4. Check console for:
   - `[SessionManager] Tab became visible - checking session`
   - `[Auth] Checking session validity...`
   - `[Auth] Session valid - expires in X minutes`

**Expected:** Session automatically validated, no interruption

---

### ✅ Test 3: Periodic Health Check
1. Login and stay active in admin panel
2. Monitor console logs over 10+ minutes
3. Look for health checks every 5 minutes:
   - `[SessionManager] Running periodic session health check`
   - `[Auth] Session valid - expires in X minutes`

**Expected:** Health checks run automatically every 5 minutes

---

### ✅ Test 4: Session Expiry (Simulate)
1. Login to admin panel
2. Open browser DevTools → Application → Local Storage
3. Find `supabase.auth.token` entries
4. Delete the auth tokens
5. Try to navigate or load data
6. Check for:
   - Toast notification: "Your session has expired"
   - Automatic redirect to `/admin/login?session_expired=true`
   - No infinite loading spinner

**Expected:** Graceful error handling with user feedback

---

### ✅ Test 5: API Request with Expired Token
1. Login to admin panel
2. Navigate to Posts page (`/admin/posts`)
3. Simulate token expiry (delete tokens from localStorage)
4. Click "New Post" or try to edit a post
5. Verify:
   - Request fails gracefully
   - Toast notification appears
   - Redirect to login
   - No blank screen or crash

**Expected:** Auth error caught and handled with redirect

---

### ✅ Test 6: Error Boundary
1. Login to admin panel
2. Intentionally trigger an error (e.g., modify code to throw)
3. Verify AuthErrorBoundary catches error
4. Should see error UI with:
   - User-friendly message
   - "Reload Page" button
   - Error details (collapsible)

**Expected:** Error boundary prevents app crash

---

### ✅ Test 7: Token Auto-Refresh
1. Login to admin panel
2. Wait until token is close to expiry (or modify expiry time in Supabase)
3. Monitor console for automatic refresh:
   - `[Supabase] Token refreshed automatically`
   - `[Auth] Token expires in X seconds - refreshing proactively`

**Expected:** Token refreshes automatically before expiry

---

### ✅ Test 8: Multiple Tabs (Future Enhancement)
1. Login in one admin tab
2. Open second admin tab
3. Logout from first tab
4. Return to second tab
5. Try to interact

**Current Behavior:** Second tab may need manual refresh  
**Future Enhancement:** Sync logout across tabs

---

## Console Log Reference

### Normal Operation Logs
```
[Supabase] Session expires at: 2024-01-15 14:30:00
[Auth] Session valid - expires in 45 minutes
[SessionManager] Starting periodic session health checks
[SessionManager] Running periodic session health check
[Auth] Checking session validity...
```

### Tab Reactivation Logs
```
[SessionManager] Tab became visible - checking session
[Auth] Attempting to refresh session...
[Auth] Session refreshed successfully
```

### Session Expiry Logs
```
[Auth] Session refresh failed: JWT expired
[SessionManager] Session refresh failed - redirecting to login
[Auth] Session expired - redirecting to login
```

### Auth Error Logs
```
[Auth Error] Session expired or unauthorized
Error Code: PGRST301
Error Message: JWT expired
[useAdminMutation] Auth error detected - triggering session expiry
```

## Common Issues & Solutions

### Issue: "Session expired" immediately after login
**Cause:** Supabase token expiry too short  
**Solution:** Check Supabase project settings → Authentication → JWT expiry

### Issue: Health checks not running
**Cause:** User on login page or not logged in  
**Solution:** Verify user is logged in and navigated to admin dashboard

### Issue: No toast notifications
**Cause:** AdminErrorProvider not wrapping components  
**Solution:** Verify layout structure includes AdminErrorProvider

### Issue: Still seeing infinite loading
**Cause:** AuthErrorBoundary not catching errors  
**Solution:** Ensure AuthErrorBoundary wraps SessionManager

## Manual Token Expiry Test (Advanced)

To test token expiry without waiting:

1. Login to admin panel
2. Open browser DevTools console
3. Run this code to see token details:
```javascript
// Get current session
const session = await (await fetch('/_next/data/.../admin.json')).json()
console.log('Session expires at:', new Date(session.expires_at * 1000))
```

4. To force expiry, you can:
   - Wait for natural expiry (1 hour typically)
   - Delete tokens from localStorage
   - Modify Supabase settings for shorter expiry (dev only)

## Automated Testing (Future)

Consider adding these automated tests:

1. **Unit Tests:**
   - `isAuthError()` correctly identifies auth errors
   - `checkAndRefreshSession()` refreshes when needed
   - `handleSessionExpired()` clears state and redirects

2. **Integration Tests:**
   - Tab reactivation triggers refresh
   - API errors caught and handled
   - Toast notifications displayed

3. **E2E Tests (Playwright/Cypress):**
   - Full login → expire → graceful logout flow
   - Multi-tab session sync
   - Error boundary catches crashes

## Performance Monitoring

Monitor these metrics:
- **Session refresh rate:** Should be minimal with auto-refresh
- **Failed request rate:** Should be near zero with proactive refresh
- **User complaints:** "Session expired" or "infinite loading" should be eliminated

## Success Criteria

The session management system is working correctly if:

✅ Users never see infinite loading screens  
✅ Session expiry shows clear toast notification  
✅ Automatic redirect to login on expiry  
✅ No manual page refresh needed  
✅ Tab reactivation works seamlessly  
✅ Periodic health checks prevent stale sessions  
✅ Error logs are detailed and helpful  
✅ No app crashes from auth errors  

## Questions?

If you encounter issues not covered here:
1. Check console logs for detailed error info
2. Review `SESSION_MANAGEMENT.md` for architecture details
3. Verify all files are properly imported and wired up
4. Check Supabase project settings for auth configuration
