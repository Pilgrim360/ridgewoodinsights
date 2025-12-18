# Admin Sidebar QA Testing Checklist

## Pre-Testing Setup

- [ ] Pull latest code from branch: `feat/admin-left-sidebar-rewrite-modern-polished`
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Open admin portal: `http://localhost:3000/admin/login`
- [ ] Login with admin credentials

## Desktop Testing (≥768px)

### Visual Appearance
- [ ] Sidebar appears on left side of screen
- [ ] Logo "R" icon is visible and styled correctly
- [ ] "Ridgewood Admin" text appears next to logo
- [ ] All navigation items have icons and labels
- [ ] Colors match Ridgewood brand (primary #006466)
- [ ] Spacing and padding look professional
- [ ] Divider appears between main nav and settings
- [ ] User info appears in footer with initials avatar
- [ ] Collapse/expand button is visible in footer

### Navigation Items
- [ ] Dashboard item is present
- [ ] Posts item is present
- [ ] Categories item is present
- [ ] Media item is present
- [ ] Settings item is present (below divider)

### Collapse/Expand Functionality
- [ ] Click "Collapse" button in footer
- [ ] Sidebar smoothly transitions to narrow width (~80px)
- [ ] Only icons are visible (no text labels)
- [ ] Content area smoothly expands to fill space
- [ ] Expand button (arrow) appears in footer
- [ ] Click expand button
- [ ] Sidebar smoothly transitions to full width (~256px)
- [ ] Labels reappear next to icons
- [ ] Content area smoothly contracts

### State Persistence
- [ ] Collapse the sidebar
- [ ] Refresh the page (F5)
- [ ] Sidebar remains collapsed after reload
- [ ] Expand the sidebar
- [ ] Refresh the page
- [ ] Sidebar remains expanded after reload

### Active State
- [ ] Navigate to Dashboard (/admin)
- [ ] Dashboard item has primary color background
- [ ] Dashboard item has left border accent
- [ ] Navigate to Posts (/admin/posts)
- [ ] Posts item is now highlighted
- [ ] Dashboard item returns to normal state
- [ ] Test each navigation item
- [ ] Active state updates correctly

### Submenu Functionality
- [ ] Posts item shows chevron on right side
- [ ] Click on Posts item (anywhere)
- [ ] Submenu expands with smooth animation
- [ ] Chevron rotates 90 degrees
- [ ] Four submenu items appear:
  - [ ] All Posts
  - [ ] New Post
  - [ ] Drafts
  - [ ] Scheduled
- [ ] Submenu items are indented with border
- [ ] Submenu icons are smaller than parent icons
- [ ] Click Posts item again
- [ ] Submenu collapses smoothly
- [ ] Navigate to /admin/posts
- [ ] Submenu auto-expands showing active item
- [ ] "All Posts" submenu item is highlighted

### Hover States
- [ ] Hover over Dashboard item
- [ ] Background changes to light gray
- [ ] Text becomes slightly darker
- [ ] Hover over Posts item
- [ ] Same hover effect
- [ ] Hover over submenu item
- [ ] Lighter hover effect
- [ ] Hover over logout button
- [ ] Background changes to light red tint

### Click Interactions
- [ ] Click Dashboard
- [ ] Navigates to /admin
- [ ] Click Posts → All Posts
- [ ] Navigates to /admin/posts
- [ ] Click Posts → New Post
- [ ] Navigates to /admin/posts/new
- [ ] Click Categories
- [ ] Navigates to /admin/categories
- [ ] Click Media
- [ ] Navigates to /admin/media
- [ ] Click Settings
- [ ] Navigates to /admin/settings

### User Menu
- [ ] User avatar shows initials (first letters of email)
- [ ] User email (or name) is displayed
- [ ] "Admin" role label is shown
- [ ] Logout button is visible
- [ ] Hover over logout button
- [ ] Background changes to red tint
- [ ] Click logout button
- [ ] User is logged out successfully
- [ ] Redirected to login page

### Tooltips (Collapsed State)
- [ ] Collapse the sidebar
- [ ] Hover over Dashboard icon
- [ ] Tooltip appears showing "Dashboard"
- [ ] Hover over Posts icon
- [ ] Tooltip appears showing "Posts"
- [ ] Test tooltips on all items
- [ ] Tooltips appear correctly

## Mobile Testing (<768px)

### Initial State
- [ ] Resize browser to mobile width (<768px)
- [ ] Sidebar is hidden
- [ ] Hamburger menu icon appears in header
- [ ] Content area takes full width
- [ ] No overlap or layout issues

### Opening Mobile Menu
- [ ] Click hamburger menu icon in header
- [ ] Backdrop overlay appears (dark transparent)
- [ ] Sidebar slides in from left smoothly
- [ ] Sidebar width is ~288px
- [ ] Close "X" button appears in header
- [ ] All navigation items are visible
- [ ] Sidebar is always expanded (no collapsed state)

### Mobile Menu Interactions
- [ ] Posts submenu expands/collapses
- [ ] All navigation links work
- [ ] Hover states work on touch
- [ ] Scrolling works if content is long

### Closing Mobile Menu
- [ ] Click backdrop (outside sidebar)
- [ ] Menu closes smoothly
- [ ] Backdrop fades out
- [ ] Open menu again
- [ ] Click "X" button in header
- [ ] Menu closes
- [ ] Open menu again
- [ ] Press Escape key
- [ ] Menu closes
- [ ] Open menu again
- [ ] Click a navigation link
- [ ] Menu auto-closes after navigation

### Mobile Layout
- [ ] No horizontal scrolling
- [ ] Touch targets are adequate (≥44px)
- [ ] Text is readable
- [ ] Spacing feels appropriate
- [ ] User menu is visible in footer

## Responsive Breakpoint Testing

### Resize from Desktop to Mobile
- [ ] Start at desktop width (>768px)
- [ ] Slowly resize browser narrower
- [ ] At 768px breakpoint, sidebar switches to mobile mode
- [ ] Transition is smooth
- [ ] No layout jumping or flickering

### Resize from Mobile to Desktop
- [ ] Start at mobile width (<768px)
- [ ] Open mobile menu
- [ ] Slowly resize browser wider
- [ ] At 768px breakpoint, mobile menu closes
- [ ] Desktop sidebar appears
- [ ] Remembers expanded/collapsed state from before

## Keyboard Navigation Testing

### Tab Navigation
- [ ] Click in browser address bar
- [ ] Press Tab repeatedly
- [ ] Focus moves to sidebar items in order
- [ ] Focus indicator is clearly visible (ring outline)
- [ ] Tab through all navigation items
- [ ] Focus moves to user menu
- [ ] Tab through logout button

### Enter Key
- [ ] Tab to Dashboard item
- [ ] Press Enter
- [ ] Navigates to Dashboard
- [ ] Tab to Posts item
- [ ] Press Enter
- [ ] Submenu expands/collapses
- [ ] Tab to submenu item
- [ ] Press Enter
- [ ] Navigates correctly

### Escape Key
- [ ] Open mobile menu
- [ ] Press Escape
- [ ] Menu closes
- [ ] Test on desktop (should have no effect)

## Accessibility Testing

### Screen Reader (if available)
- [ ] Enable screen reader (VoiceOver/NVDA/JAWS)
- [ ] Navigate through sidebar
- [ ] Each item is announced clearly
- [ ] Active state is announced
- [ ] Submenu expansion is announced
- [ ] Buttons have clear labels

### Color Contrast
- [ ] Use browser DevTools or contrast checker
- [ ] Default text on white: Check ratio
- [ ] Active text on tinted background: Check ratio
- [ ] Icon colors: Check ratio
- [ ] Hover states: Check ratio
- [ ] All should meet WCAG AA (4.5:1 for normal text)

### Focus Indicators
- [ ] All interactive elements have visible focus
- [ ] Focus ring is clearly visible
- [ ] Focus ring color contrasts with background
- [ ] Focus is never invisible

## Performance Testing

### Animation Smoothness
- [ ] Collapse/expand sidebar multiple times
- [ ] Animation is smooth (60fps)
- [ ] No stuttering or jank
- [ ] Content area transitions smoothly
- [ ] Open/close mobile menu
- [ ] Slide animation is smooth

### Page Load
- [ ] Refresh page multiple times
- [ ] Sidebar appears quickly
- [ ] No layout shift during load
- [ ] Icons load properly
- [ ] No flicker or pop-in

### Network Throttling
- [ ] Open DevTools Network tab
- [ ] Throttle to "Slow 3G"
- [ ] Refresh page
- [ ] Sidebar still loads reasonably fast
- [ ] Functionality works despite slow network

## Cross-Browser Testing

### Chrome/Edge (Chromium)
- [ ] All functionality works
- [ ] Visual appearance correct
- [ ] Animations smooth
- [ ] No console errors

### Firefox
- [ ] All functionality works
- [ ] Visual appearance correct
- [ ] Animations smooth
- [ ] No console errors

### Safari (if available)
- [ ] All functionality works
- [ ] Visual appearance correct
- [ ] Animations smooth
- [ ] No console errors

## Edge Cases & Error Handling

### Long Email Address
- [ ] Login with very long email
- [ ] Email truncates correctly in footer
- [ ] Tooltip shows full email (if implemented)
- [ ] Layout doesn't break

### Many Submenu Items
- [ ] If submenu gets very long
- [ ] Scrolling works correctly
- [ ] Layout remains intact

### Rapid Clicking
- [ ] Rapidly click collapse/expand
- [ ] No animation glitches
- [ ] State remains consistent
- [ ] Rapidly click submenu toggle
- [ ] Expansion/collapse works correctly

### localStorage Disabled
- [ ] Disable localStorage in browser
- [ ] Refresh page
- [ ] Sidebar defaults to expanded
- [ ] Functionality still works
- [ ] No JavaScript errors

### Slow System
- [ ] Test on older device if available
- [ ] Animations may be slower but still work
- [ ] Functionality is intact
- [ ] No crashes or freezes

## Integration Testing

### With Other Admin Components
- [ ] Navigate to Posts page
- [ ] Posts table displays correctly
- [ ] No overlap with sidebar
- [ ] Filters and pagination work
- [ ] Navigate to Categories page
- [ ] Modal opens correctly
- [ ] No z-index issues with sidebar
- [ ] Navigate to Media page
- [ ] Upload modal works
- [ ] No interference from sidebar
- [ ] Navigate to Settings page
- [ ] Form works correctly
- [ ] Save button accessible

### With Admin Header
- [ ] Hamburger menu works (mobile)
- [ ] Header doesn't overlap sidebar
- [ ] Header actions work (if any)
- [ ] Breadcrumbs/title update correctly

### Content Area Adjustment
- [ ] Collapse sidebar
- [ ] Content area expands smoothly
- [ ] No content cutoff
- [ ] Responsive tables adjust
- [ ] Expand sidebar
- [ ] Content area contracts smoothly
- [ ] Layout remains correct

## Build & Production Testing

### Development Build
- [ ] Run `npm run dev`
- [ ] No compilation errors
- [ ] No console warnings (sidebar-related)
- [ ] Hot reload works correctly

### Production Build
- [ ] Run `npm run build`
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Run `npm start`
- [ ] Production build runs
- [ ] Sidebar works identically
- [ ] No console errors

### Type Checking
- [ ] Run `npm run typecheck`
- [ ] No TypeScript errors
- [ ] Types are correct

## Documentation Review

- [ ] Read SIDEBAR_REBUILD.md
- [ ] Documentation matches implementation
- [ ] All features documented are present
- [ ] Instructions are clear
- [ ] Read docs/admin-sidebar-design-system.md
- [ ] Design specs match implementation
- [ ] Colors are correct
- [ ] Spacing is correct
- [ ] Read docs/sidebar-migration-guide.md
- [ ] Migration steps are clear
- [ ] Code examples are accurate

## Final Verification

- [ ] No console errors in browser
- [ ] No console warnings (sidebar-related)
- [ ] No layout issues on any page
- [ ] All animations are smooth
- [ ] All links navigate correctly
- [ ] State persists correctly
- [ ] Mobile experience is excellent
- [ ] Desktop experience is excellent
- [ ] Accessibility is solid
- [ ] Performance is good

## Sign-Off

**Tester Name:** _______________________  
**Date:** _______________________  
**Browser(s) Tested:** _______________________  
**Device(s) Tested:** _______________________  

**Issues Found:** (List any issues below)
```
1. 
2. 
3. 
```

**Overall Status:**
- [ ] ✅ Approved - Ready for production
- [ ] ⚠️ Approved with minor issues (list above)
- [ ] ❌ Not approved - Major issues found (list above)

**Additional Notes:**
```



```

---

**Checklist Version:** 1.0.0  
**Last Updated:** December 2024
