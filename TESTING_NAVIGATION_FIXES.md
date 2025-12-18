# Navigation & Infinite Loop Fixes - Testing Checklist

## Pre-Test Requirements
- [ ] Clear browser cache and reload
- [ ] Open browser DevTools Console to check for errors
- [ ] Have the app running in dev mode (`npm run dev`)

## Test 1: Create New Post (No Infinite Loop)
1. Navigate to `/admin/posts/new`
2. Observe:
   - [ ] Page loads without "Maximum update depth exceeded" errors
   - [ ] Editor UI is fully visible
   - [ ] Header shows save/publish buttons
   - [ ] No spinning/frozen UI

## Test 2: Edit Existing Post (No Infinite Loop)
1. Navigate to `/admin/posts/[id]` (edit existing post)
2. Observe:
   - [ ] Post loads successfully
   - [ ] No infinite loop errors
   - [ ] Editor content displays correctly
   - [ ] Header actions are visible

## Test 3: Sidebar Navigation (No Click Blocking)
From the post editor page:
1. Click "Dashboard" in sidebar → [ ] Should navigate away
2. Go back to editor
3. Click "Categories" in sidebar → [ ] Should navigate away
4. Go back to editor
5. Click "All Posts" in sidebar → [ ] Should navigate away
6. Go back to editor
7. Click "Settings" in sidebar → [ ] Should navigate away

## Test 4: Editor Functionality (No Event Capture Issues)
1. Open any post in editor
2. Test image insertion:
   - [ ] Can select/paste images
   - [ ] Image resize handle appears when image selected
   - [ ] Can drag resize handle to resize image
3. Test table creation:
   - [ ] Can insert table
   - [ ] Table bubble menu appears when table selected
   - [ ] Can add/remove rows/columns
4. Test content editing:
   - [ ] Text input works smoothly
   - [ ] Formatting tools respond to clicks
   - [ ] No lag or freezing

## Test 5: Auto-Save & Status Updates
1. Create/edit a post
2. Start typing:
   - [ ] "Unsaved changes" indicator appears
   - [ ] Auto-save triggers after 2 seconds
   - [ ] Status updates to "Saved X seconds ago"
3. Continue editing:
   - [ ] Auto-save works consistently
   - [ ] No errors in console
   - [ ] Header buttons remain responsive

## Test 6: Unsaved Changes Handling
1. Edit a post and make changes
2. Try clicking sidebar item while changes are unsaved:
   - [ ] Navigation works (no blocking)
   - [ ] You leave the page with unsaved changes
   - Consider: Should we add a confirmation dialog? (Not in current scope)

## Test 7: Form Submission from Editor
1. Edit a post
2. Click "Save" button:
   - [ ] Loading spinner appears
   - [ ] Editors elements are disabled
   - [ ] Save completes successfully
   - [ ] Status shows success
3. Click "Publish" button:
   - [ ] Validates title and slug exist
   - [ ] Shows error if missing required fields
   - [ ] Publishes and navigates to posts list if valid

## Test 8: Mobile Responsiveness
1. View editor on mobile/tablet:
   - [ ] Layout is responsive
   - [ ] Sidebar menu works (hamburger opens/closes)
   - [ ] Editor content is accessible
   - [ ] Touch interactions work on editor

## Test 9: Browser Console Check
Throughout all tests:
- [ ] No "Maximum update depth exceeded" errors
- [ ] No React warning/error messages
- [ ] No JavaScript exceptions
- [ ] Network tab shows normal request pattern (no spam)

## Test 10: Performance Check
1. Open DevTools > Performance tab
2. Record while editing post for 30 seconds:
   - [ ] Consistent frame rate (no jank)
   - [ ] Memory usage is stable
   - [ ] No excessive re-renders visible
3. Check Network tab:
   - [ ] Requests are throttled (not firing excessively)
   - [ ] Auto-save doesn't hammer the server

## Known Edge Cases to Test
- [ ] Creating post and immediately publishing without saving first
- [ ] Rapidly switching between tabs/pages while saving
- [ ] Network latency (throttle in DevTools to slow 3G)
- [ ] Very large content (5000+ words)
- [ ] Multiple images in content
- [ ] Tables with many rows/columns
- [ ] Switching between different posts quickly

## Success Criteria
- ✅ No infinite update depth errors
- ✅ Sidebar navigation works from editor page
- ✅ Editor interactions (images, tables) work smoothly
- ✅ Auto-save works without errors
- ✅ Console is clean (no relevant errors)
- ✅ Performance is acceptable (60 FPS on normal hardware)

## If Tests Fail

### Infinite Loop Returns
1. Check browser console for exact error location
2. Look for patterns in which actions trigger it
3. Review the dependency arrays in:
   - `src/components/admin/PostEditor/Editor.tsx`
   - `src/contexts/AdminHeaderSlotsContext.tsx`
4. Ensure no callbacks are being recreated unnecessarily

### Navigation Still Blocked
1. Clear browser cache completely
2. Check if TipTap bubble menus are still being created (inspect elements)
3. Verify `pointer-events-auto` classes are applied
4. Check if something is capturing events at window level

### Performance Issues
1. Open DevTools > Profiler
2. Record React interaction causing lag
3. Look for components rendering excessively
4. Check if effect dependencies are incorrect

## Documentation References
- See `INFINITE_LOOP_FIX.md` for dependency array explanation
- See `FIXES_APPLIED.md` for pointer-events and event capture fixes
- See `EDITOR_NAVIGATION_BUG_REPORT.md` for original analysis
