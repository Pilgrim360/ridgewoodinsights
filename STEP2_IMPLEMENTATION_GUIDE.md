# Step 2 Implementation Guide: Sidebar Navigation

## Quick Start

### Files Created
- `src/components/admin/SidebarLink.tsx` - Navigation link component
- `src/components/admin/SidebarHeader.tsx` - Logo and collapse toggle
- `src/components/admin/SidebarFooter.tsx` - User info and logout
- `src/components/admin/Sidebar.tsx` - Main sidebar container
- `src/components/admin/AdminHeader.tsx` - Top navigation bar

### Files Updated
- `src/app/admin/layout.tsx` - Integrated sidebar and header
- `src/app/admin/page.tsx` - Updated to use color palette

### Dependencies
- All components use existing: `useSidebarState`, `useAdminAuth`, Tailwind CSS
- No new npm packages required

## How to Use

### In Any Admin Page
The sidebar and header are automatically included via the admin layout. No additional setup needed in child pages.

```typescript
// src/app/admin/posts/page.tsx - sidebar + header included automatically
export default function PostsPage() {
  return <YourContent />;
}
```

### Accessing Sidebar State
Only needed if you want to create custom header components:

```typescript
'use client';
import { useSidebarState } from '@/hooks/useSidebarState';

export function CustomComponent() {
  const { isExpanded, isMobileOpen, toggleMobileMenu } = useSidebarState();
  
  return (
    <button onClick={toggleMobileMenu}>
      {isMobileOpen ? 'Close' : 'Open'} Menu
    </button>
  );
}
```

### Adding Navigation Items
Edit the `navItems` array in `src/components/admin/Sidebar.tsx`:

```typescript
const navItems = [
  // ... existing items
  {
    href: '/admin/new-page',
    label: 'New Page',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* Your icon SVG path */}
      </svg>
    ),
  },
];
```

## Testing

### Run Development Server
```bash
npm run dev
```
Then visit `http://localhost:3000/admin` (or 3001 if port in use)

### Manual Testing Checklist
- [ ] Desktop: Toggle sidebar collapse/expand
- [ ] Desktop: Hover shows tooltips on collapsed nav items
- [ ] Desktop: Active link highlights in primary color
- [ ] Mobile: Hamburger menu opens sidebar overlay
- [ ] Mobile: Click backdrop closes sidebar
- [ ] Mobile: Escape key closes sidebar
- [ ] Mobile: Tab key cycles through links (focus trap)
- [ ] All links are clickable and navigate correctly

### Automated Testing
```bash
npm run typecheck    # TypeScript errors
npm run lint         # Code style
npm run build        # Production build
```

## Component Props Reference

### Sidebar
```typescript
interface SidebarProps {
  state: SidebarState;  // From useSidebarState hook
}

// Usage:
<Sidebar state={sidebarState} />
```

### AdminHeader
```typescript
interface AdminHeaderProps {
  onMenuToggle: () => void;      // Called when hamburger clicked
  isMobileMenuOpen: boolean;     // Current menu state
}

// Usage:
<AdminHeader 
  onMenuToggle={sidebarState.toggleMobileMenu}
  isMobileMenuOpen={sidebarState.isMobileOpen}
/>
```

### SidebarLink
```typescript
interface SidebarLinkProps {
  href: string;          // Navigation target
  icon: React.ReactNode; // SVG or icon element
  label: string;         // Link text
  isExpanded: boolean;   // Show/hide label
  onClick?: () => void;  // Optional callback (closes mobile menu)
}
```

### SidebarHeader
```typescript
interface SidebarHeaderProps {
  isExpanded: boolean;        // Sidebar state
  onToggleExpand: () => void; // Collapse/expand callback
}
```

### SidebarFooter
```typescript
interface SidebarFooterProps {
  isExpanded: boolean; // Show/hide label
}
```

## Styling Customization

### Colors
All colors use Tailwind CSS tokens defined in `tailwind.config.ts`:
- `primary` - Primary color (#006466)
- `secondary` - Secondary color (#2C3E50)
- `text` - Body text color (#415161)
- `surface` - Border/hover color (#E2E7ED)
- `background` - Page background (#F8F9FB)
- `white` - Component backgrounds (#FFFFFF)

To change colors, update `tailwind.config.ts` and restart the dev server.

### Responsive Behavior
- `md:` breakpoint = 768px (Tailwind default)
- Below 768px: Mobile layout (hamburger menu)
- 768px and above: Desktop layout (visible sidebar)

To change the breakpoint, edit Tailwind config or the component class names.

### Widths
- Desktop expanded: `w-60` (240px)
- Desktop collapsed: `w-20` (80px)
- Mobile: `w-60` (240px)

Edit these in `Sidebar.tsx` to adjust.

## Accessibility

### Keyboard Navigation
- **Tab** - Move between interactive elements
- **Enter/Space** - Activate links or buttons
- **Escape** - Close mobile menu (mobile only)
- **Tab** in mobile menu - Cycles within menu (focus trap)

### Screen Readers
- All navigation items labeled
- Active state announced via semantic elements
- Button purposes clear from labels

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Verified with Lighthouse or contrast checker

## Troubleshooting

### Sidebar Not Showing on Desktop
- Check viewport width (must be ≥ 768px)
- Verify `isExpanded` and `isMobileOpen` states
- Check browser dev tools for CSS class conflicts

### Mobile Menu Not Opening
- Verify hamburger button is visible (visible on mobile only)
- Check if `toggleMobileMenu` is connected correctly
- Look for JavaScript errors in console

### Links Not Highlighting
- Ensure `href` in navItems matches actual route
- Check that `usePathname()` returns expected values
- Verify active state logic in `SidebarLink.tsx`

### Focus Trap Not Working
- Only active when `isMobileOpen === true`
- Escape key should close menu
- If not working, check browser console for errors

### Logout Button Disabled
- Normal during logout operation (loading state)
- Wait for operation to complete
- Check network tab if stuck

## Performance Tips

### Optimize Mobile Menu
The focus trap only activates when menu is open:
```typescript
// Efficient - only runs when needed
useEffect(() => {
  if (!isMobileOpen) return; // Skip if menu closed
  // ... focus trap logic
}, [isMobileOpen]);
```

### Prevent Unnecessary Re-renders
Use the `useCallback` hook:
```typescript
const toggleExpand = useCallback(() => {
  setIsExpanded(prev => !prev);
}, []);
```

### Smooth Animations
Uses Tailwind transitions (60fps CSS animations):
```typescript
transition-all duration-300 ease-in-out // Sidebar width
```

## Browser Support

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support (iOS 12+)
- Internet Explorer: ✗ Not supported (modern only)

## Integration with Other Steps

### Step 3: Dashboard
- Dashboard page content appears in the main area
- Sidebar persists across page navigation
- Active state updates as user navigates

### Step 4: Posts Page
- Posts list appears in main area
- Sidebar shows "Posts" as active
- Same navigation structure

### Step 5: Post Editor
- Editor fills main area
- Sidebar remains accessible
- Logout available in footer

## Questions?

Refer to:
- `ADMIN_CMS_STEP2.md` - Detailed technical documentation
- `ADMIN_CMS_QUICK_REFERENCE.md` - Patterns and common tasks
- Component source files - Inline comments and examples
- `src/types/admin.d.ts` - Type definitions

## Ready for Step 3?

If all tests pass and manual testing looks good, you're ready to move on to:

**Step 3: Dashboard Page**
- StatsCard components
- ActivityFeed component
- QuickActions component
- Dashboard page assembly

See `ADMIN_CMS_QUICK_REFERENCE.md` for Step 3 details.

---

**Status:** ✓ Complete and Ready  
**Last Updated:** December 9, 2025  
**Questions?** Check the documentation or inline component comments
