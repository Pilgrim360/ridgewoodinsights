# Data Refresh Fix for Stale Loading Screens

## Problem

After implementing the session management system, the **session validation was working correctly**, but pages would still show infinite loading screens when returning to an inactive tab. The console logs showed:

```
[SessionManager] Tab became visible - checking session
[Auth] Session valid - expires in 49 minutes
[SessionManager] Session is valid
```

The session was valid, but **React components were stuck in loading state** because:
1. Data fetching only ran on initial component mount
2. When tab became inactive and then visible again, components didn't remount
3. The Supabase connection might have stalled during inactivity
4. No mechanism existed to trigger data refetch when tab became visible

## Root Cause

The issue was **not with authentication** but with **data fetching lifecycle**:

- ✅ Session management working correctly
- ✅ Tokens being refreshed properly
- ❌ **React components not re-fetching data** when tab becomes visible
- ❌ **No trigger to reload stale data** after inactivity

## Solution: Data Refresh Context

Implemented a global data refresh mechanism using React Context to broadcast "refresh data" events to all components when the tab becomes visible.

### 1. DataRefreshContext (`src/contexts/DataRefreshContext.tsx`)

**Purpose:** Provides a global refresh trigger that all pages can subscribe to.

```typescript
interface DataRefreshContextType {
  refreshKey: number;      // Increments on each refresh
  triggerRefresh: () => void;  // Triggers refresh
}
```

**How it works:**
- Maintains a `refreshKey` counter
- When `triggerRefresh()` is called, increments the key
- Components that depend on `refreshKey` in their `useEffect` automatically re-run
- Simple, predictable, React-native solution

### 2. Enhanced SessionManager

**Updated to trigger data refresh when tab becomes visible:**

```typescript
const handleVisibilityChange = useCallback(() => {
  if (!isLoginPage && user) {
    console.log('[SessionManager] Tab became visible - checking session and refreshing data');
    handleSessionRefresh(true); // Pass true to trigger data refresh
  }
}, [handleSessionRefresh, user, isLoginPage]);
```

**What happens on tab visibility:**
1. Check session validity (existing functionality)
2. If session valid, call `triggerRefresh()` to increment refresh key
3. Call `router.refresh()` to refresh Next.js server components
4. All admin pages with data fetching automatically re-run their queries

### 3. Updated Admin Pages

All data-fetching pages now include `refreshKey` in their `useEffect` dependencies:

#### Dashboard Page
```typescript
const { refreshKey } = useDataRefresh();

useEffect(() => {
  async function loadDashboardData() {
    // ... fetch data
  }
  loadDashboardData();
}, [showError, refreshKey]); // ← Added refreshKey
```

#### Posts Page
```typescript
const { refreshKey } = useDataRefresh();

useEffect(() => {
  async function fetchPosts() {
    // ... fetch posts
  }
  fetchPosts();
}, [state.filters, showError, refreshKey]); // ← Added refreshKey
```

#### Categories Page
```typescript
const { refreshKey } = useDataRefresh();

useEffect(() => {
  async function loadCategories() {
    // ... fetch categories
  }
  loadCategories();
}, [showError, refreshKey]); // ← Added refreshKey
```

#### Media Page
```typescript
const { refreshKey } = useDataRefresh();

useEffect(() => {
  async function loadMedia() {
    // ... fetch media
  }
  loadMedia();
}, [user, router, refreshKey]); // ← Added refreshKey
```

#### Settings Page
```typescript
const { refreshKey } = useDataRefresh();

useEffect(() => {
  async function loadSettings() {
    // ... fetch settings
  }
  loadSettings();
}, [showError, refreshKey]); // ← Added refreshKey
```

### 4. Updated Admin Layout

Added `DataRefreshProvider` to the context hierarchy:

```typescript
<AdminAuthProvider>
  <AdminErrorProvider>
    <DataRefreshProvider>  {/* ← Added */}
      <AuthErrorBoundary>
        <SessionManager>
          {children}
        </SessionManager>
      </AuthErrorBoundary>
    </DataRefreshProvider>
  </AdminErrorProvider>
</AdminAuthProvider>
```

## How It Works - Flow Diagram

```
User switches away from tab
    ↓
Tab becomes inactive (browser suspends some operations)
    ↓
[Time passes - Supabase connection may stall]
    ↓
User returns to tab
    ↓
usePageVisibility detects visibility change
    ↓
SessionManager.handleVisibilityChange() called
    ↓
1. checkAndRefreshSession() → validates/refreshes token
    ↓
2. triggerRefresh() → increments refreshKey
    ↓
3. router.refresh() → refreshes Next.js cache
    ↓
All useEffect hooks with refreshKey dependency re-run
    ↓
Data fetching functions execute again
    ↓
UI updates with fresh data
    ↓
Loading screens resolve → User sees current data
```

## Console Output

After the fix, you'll see these logs when returning to the tab:

```
[SessionManager] Tab became visible - checking session and refreshing data
[SessionManager] Checking session validity...
[Auth] Session valid - expires in 49 minutes
[SessionManager] Session is valid
[SessionManager] Triggering data and router refresh  ← New
[DataRefresh] Triggering data refresh across all components  ← New
```

## Benefits

✅ **Automatic data refresh** when tab becomes visible  
✅ **Works with all admin pages** (dashboard, posts, categories, media, settings)  
✅ **No manual refresh needed** - happens automatically  
✅ **Solves loading screen issue** - data fetches complete properly  
✅ **Works with Next.js router** - refreshes server components too  
✅ **Simple implementation** - just add `refreshKey` to useEffect dependencies  
✅ **Centralized control** - single source of truth for refresh events  

## Testing

### Test Scenario 1: Short Inactivity (2-5 minutes)
1. Login to admin panel
2. Navigate to dashboard or posts page
3. Switch to another tab for 2-3 minutes
4. Return to admin tab
5. **Expected:** Page shows loading briefly, then displays fresh data
6. **Console shows:** "Triggering data and router refresh"

### Test Scenario 2: Long Inactivity (30+ minutes)
1. Login to admin panel
2. Navigate to any admin page
3. Leave tab inactive for 30+ minutes
4. Return to admin tab
5. **Expected:** 
   - If token expired: Session refresh, then data refresh
   - If token still valid: Immediate data refresh
6. **Result:** No infinite loading, fresh data displayed

### Test Scenario 3: Multiple Pages
1. Login and navigate to Posts page
2. Switch tabs, come back → Posts refresh
3. Navigate to Dashboard
4. Switch tabs, come back → Dashboard refreshes
5. Navigate to Media
6. Switch tabs, come back → Media refreshes
7. **Expected:** Each page properly refreshes its data

## Edge Cases Handled

1. **User on login page:** Skip refresh (no data to fetch)
2. **User not logged in:** Skip refresh (will redirect to login)
3. **Multiple rapid tab switches:** Debounced via `isRefreshing` ref
4. **Session invalid:** Redirect to login instead of refreshing data
5. **Network errors:** Components handle errors independently

## Performance Considerations

- **Minimal overhead:** Only one counter increment per tab visibility change
- **Efficient re-renders:** Only components with `refreshKey` dependency re-run
- **No unnecessary fetches:** Refresh only triggers on actual tab visibility change
- **Batched updates:** React batches state updates from multiple components

## Comparison with Alternatives

### ❌ Alternative 1: Polling
```typescript
// Bad: Wastes resources even when tab is inactive
setInterval(fetchData, 5000);
```

### ❌ Alternative 2: Manual Refresh Button
```typescript
// Bad: Requires user action, poor UX
<button onClick={fetchData}>Refresh</button>
```

### ✅ Our Solution: Event-Driven Refresh
```typescript
// Good: Only refreshes when needed, automatic
useEffect(() => {
  fetchData();
}, [refreshKey]);
```

## Files Changed

1. `src/contexts/DataRefreshContext.tsx` - **New file**
2. `src/components/admin/SessionManager.tsx` - Enhanced with data refresh trigger
3. `src/app/admin/layout.tsx` - Added DataRefreshProvider
4. `src/app/admin/(dashboard)/page.tsx` - Added refreshKey dependency
5. `src/app/admin/(dashboard)/posts/page.tsx` - Added refreshKey dependency
6. `src/app/admin/(dashboard)/categories/page.tsx` - Added refreshKey dependency
7. `src/app/admin/(dashboard)/media/page.tsx` - Added refreshKey dependency
8. `src/app/admin/(dashboard)/settings/page.tsx` - Added refreshKey dependency

## Summary

The infinite loading screen issue was **not caused by session management** (which was working correctly), but by **React components not re-fetching data** when the tab became visible after inactivity.

The solution uses a **global refresh context** that broadcasts a "refresh data" event when the tab becomes visible, triggering all admin pages to re-fetch their data automatically.

**Result:** No more infinite loading screens, no manual refresh needed, seamless UX when returning to inactive tabs.
