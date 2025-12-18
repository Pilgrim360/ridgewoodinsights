# Post Editor Navigation Bug - Root Cause Analysis & Fixes

## Issue
When on the post editor page, sidebar navigation items become unresponsive. Clicking dashboard, categories, or other sidebar items does nothing and the user is stuck on the editor page.

## Root Causes Identified

### 1. **ResizableImageNodeView Event Capture** (Primary Issue)
**File:** `src/lib/tiptap/nodeViews/ResizableImageNodeView.tsx` (Lines 130-156)

The image resize handle calls `event.stopPropagation()` and `event.preventDefault()` on the `onPointerDown` handler. While these calls are contained within the resize handle's scope, the issue is that **Tippy.js (used by TipTap's BubbleMenu) and TipTap's editor may be listening to events at the window/document level** due to how the editor content area is structured.

The problem manifests when:
- The editor has high z-index or captures click events
- The BubbleMenu's Tippy.js instance has event delegation set up
- Clicks outside the editor aren't properly propagating back to the sidebar

### 2. **BubbleMenu Event Capture** (Secondary Issue)  
**Files:**
- `src/components/admin/PostEditor/EditorImageBubbleMenu.tsx` (Line 168)
- `src/components/admin/PostEditor/EditorTableBubbleMenu.tsx` (Line 27)

Both use `BubbleMenu` with `tippyOptions={{ interactive: true }}` or similar. Tippy.js creates portals that may:
- Intercept click events before they reach the sidebar
- Have z-index issues that cover the sidebar area
- Use event capture listeners

### 3. **Editor Container Structure Issue**
**File:** `src/components/admin/PostEditor/Editor.tsx` (Lines 131-158)

The Editor component uses:
```tsx
<div className="h-full flex flex-col bg-background">
  <div className="flex-1 overflow-y-auto flex gap-4">
```

The nested overflow containers with flex layout can cause event propagation issues when combined with TipTap's editor, which has its own event handling layer.

---

## Recommended Fixes

### Fix 1: Ensure Editor Container Doesn't Interfere with Event Propagation

**File:** `src/components/admin/PostEditor/Editor.tsx`

Change the outer container to use `h-screen` instead of `h-full` and add proper pointer-events handling:

```tsx
// Before:
<div className="h-full flex flex-col bg-background">
  <div className="flex-1 overflow-y-auto flex gap-4">

// After:
<div className="h-screen flex flex-col bg-background pointer-events-auto">
  <div className="flex-1 overflow-y-auto flex gap-4">
```

**Why:** Ensures the editor container properly respects the viewport height and doesn't interfere with event propagation.

### Fix 2: Disable Event Capture in ResizableImageNodeView

**File:** `src/lib/tiptap/nodeViews/ResizableImageNodeView.tsx`

Limit the stopPropagation to only prevent the editor from interpreting the resize as a selection event:

```tsx
// Before (Lines 130-156):
const startResize = useCallback(
  (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!editor.isEditable) return;
    
    event.preventDefault();
    event.stopPropagation();  // This blocks everything
    // ... rest of code

// After:
const startResize = useCallback(
  (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!editor.isEditable) return;
    
    event.preventDefault();
    // Only stop propagation if we're actually going to resize
    if (imgRef.current?.getBoundingClientRect()) {
      event.stopPropagation();
    }
    // ... rest of code
```

Or better yet, use `event.stopPropagation()` only on the move/up handlers, not the initial pointerdown.

### Fix 3: Ensure BubbleMenu Doesn't Overlay the Sidebar

**File:** `src/components/admin/PostEditor/EditorImageBubbleMenu.tsx`

Verify the Tippy.js portal positioning:

```tsx
// Before:
<BubbleMenu
  editor={editor}
  tippyOptions={{ duration: 150, interactive: true }}
  shouldShow={() => editor.isActive('image')}
  className="flex items-center gap-1 rounded-lg border border-surface bg-white p-1 shadow-sm"
>

// After - Add placement constraints:
<BubbleMenu
  editor={editor}
  tippyOptions={{ 
    duration: 150, 
    interactive: true,
    placement: 'bottom',  // Prevent placement over sidebar
    maxWidth: 'calc(100vw - 400px)',  // Leave space for sidebar
  }}
  shouldShow={() => editor.isActive('image')}
  className="flex items-center gap-1 rounded-lg border border-surface bg-white p-1 shadow-sm"
>
```

### Fix 4: Add Pointer Events Guard on Main Content

**File:** `src/app/admin/(dashboard)/layout.tsx`

Ensure the main content area doesn't capture events meant for navigation:

```tsx
// Line 38, change from:
<main className="flex-1 overflow-auto">

// To:
<main className="flex-1 overflow-auto pointer-events-auto">
  <div className="pointer-events-auto">
```

---

## Testing the Fix

After applying these fixes:

1. **Navigate to post editor:** `/admin/posts/new` or `/admin/posts/[id]`
2. **Try clicking sidebar items:** Dashboard, Categories, etc.
3. **Expected behavior:** Navigation should work and change the page
4. **Also test:** 
   - Image insertion and resizing in the editor
   - Table creation and editing
   - BubbleMenu interactions should still work

---

## Additional Recommendation

Consider adding a route guard or confirmation dialog when trying to navigate away with unsaved changes:

```tsx
// In Editor.tsx, add a beforeunload handler:
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);
```

This way users know why they can't navigate (if that's the actual issue) rather than thinking the UI is broken.
