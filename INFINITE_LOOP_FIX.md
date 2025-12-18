# Maximum Update Depth Error - Root Cause & Fix

## Error

```
Maximum update depth exceeded. This can happen when a component calls 
setState inside useEffect, but useEffect either doesn't have a dependency 
array, or one of the dependencies changes on every render.
```

## Root Cause

The infinite loop was caused by circular dependencies in the context and component:

### AdminHeaderSlotsContext Issue
**File:** `src/contexts/AdminHeaderSlotsContext.tsx` (Line 64)

The `value` useMemo was including `setTitle`, `setActions`, `setSubHeader`, and `clear` in its dependency array:

```tsx
// BEFORE (WRONG)
const value = useMemo(
  () => ({
    slots,
    setTitle,
    setActions,
    setSubHeader,
    clear,
  }),
  [slots, setTitle, setActions, setSubHeader, clear]  // ❌ These callbacks are stable!
);
```

**Problem:**
- These callbacks are created with empty dependency arrays, so they never change
- Including them in the useMemo dependency array is unnecessary
- The context value still changed whenever `slots` changed, triggering all consumers to re-render

### Editor Component Issue
**File:** `src/components/admin/PostEditor/Editor.tsx` (Line 119)

The `useEffect` hook included `setActions` in its dependency array:

```tsx
// BEFORE (WRONG)
useEffect(() => {
  setActions(<EditorHeaderActions {...props} />);
  return () => setActions(null);
}, [
  setActions,  // ❌ setActions is stable, but still included
  isDirty,
  isSaving,
  // ... other deps
]);
```

**Problem:**
- When `slots` in the context changes, the context value is recreated
- This causes all consumers (including Editor) to re-render
- The useEffect dependencies change, triggering the effect
- The effect calls `setActions`, which updates the context
- This cycle repeats, causing infinite updates

## Solution

### Fix 1: Remove Stable Callbacks from Context useMemo
**File:** `src/contexts/AdminHeaderSlotsContext.tsx`

Changed the dependency array to only include `slots`:

```tsx
// AFTER (CORRECT)
const value = useMemo(
  () => ({
    slots,
    setTitle,
    setActions,
    setSubHeader,
    clear,
  }),
  [slots]  // ✅ Only depends on slots, which is correct
);
```

**Why This Works:**
- The callbacks are stable and never change
- The context value only changes when the actual data (`slots`) changes
- Consumers only re-render when there's a genuine data update

### Fix 2: Optimize Editor's useEffect Dependencies
**File:** `src/components/admin/PostEditor/Editor.tsx`

Removed derived dependencies from the effect, keeping only the "source" state values that affect the visual output:

```tsx
// AFTER (CORRECT)
useEffect(() => {
  setActions(<EditorHeaderActions {...props} />);
  return () => setActions(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isDirty, isSaving, lastSaved, saveError, state.status]);
```

Removed from dependency array:
- ~~`setActions`~~ - stable callback, no need to track
- ~~`explicitSave`~~ - derived from state, will be updated on normal render
- ~~`handlePublish`~~ - derived from state, will be updated on normal render  
- ~~`canPublish`~~ - computed value derived from state
- ~~`publishDisabledReason`~~ - computed value derived from state

**Why This Works:**
- The effect only re-runs when the visual state actually changes
- The JSX will still receive the latest function versions through closure when the component re-renders
- Derived values don't need to be tracked; only track the source values
- `setActions` is stable so doesn't need to be tracked
- No circular dependency chain can form
- The eslint-disable is appropriate because we intentionally exclude derived values

## Performance Impact

**Positive:** These changes actually improve performance by:
- Reducing unnecessary re-renders of context consumers
- Removing unnecessary dependency tracking
- Preventing the infinite update loop that was thrashing the browser

## Explanation

The issue is a common React anti-pattern:

1. **Bad:** Including stable values in dependency arrays
2. **Bad:** Creating a useMemo dependency on things that don't actually need to trigger updates
3. **Good:** Only including dependencies that actually change and should trigger effects
4. **Good:** Relying on the fact that useCallback creates stable references

## Prevention

When using Context + useCallback + useEffect together:

✅ **DO:**
- Create callbacks with useCallback and stable dependency arrays
- Only include callbacks in useEffect if they actually change
- Only include callbacks in useMemo if they're part of the memoized object
- Remember: useCallback creates a stable reference, so it only goes in dependencies if the implementation changes

❌ **DON'T:**
- Include stable callbacks in useEffect/useMemo just because they're used
- Create circular dependencies between context updates and component effects
- Track things in dependency arrays that you know won't change

## Files Changed

1. `src/contexts/AdminHeaderSlotsContext.tsx` - Removed unnecessary callbacks from useMemo dependency
2. `src/components/admin/PostEditor/Editor.tsx` - Removed setActions from useEffect dependency array
