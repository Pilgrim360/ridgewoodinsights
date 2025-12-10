# Admin CMS Quick Reference Guide

**Purpose:** Fast lookup for implementation details, patterns, and conventions.

---

## Project Structure

```
src/
├── app/(admin)/                      # Admin routes
│   ├── layout.tsx                    # Two-panel layout
│   ├── page.tsx                      # Dashboard
│   ├── posts/
│   │   ├── page.tsx                  # Posts list
│   │   ├── new/page.tsx              # Create post
│   │   └── [id]/page.tsx             # Edit post
│   ├── categories/page.tsx           # Categories management
│   └── settings/page.tsx             # Settings (Step 7)
│
├── components/admin/
│   ├── ErrorBoundary.tsx             # Error boundary
│   ├── Sidebar.tsx                   # Navigation sidebar
│   ├── SidebarHeader.tsx             # Sidebar header
│   ├── SidebarLink.tsx               # Nav link item
│   ├── SidebarFooter.tsx             # User info + logout
│   ├── Dashboard/
│   │   ├── StatsCard.tsx             # Single stat
│   │   ├── ActivityFeed.tsx          # Recent activity
│   │   └── QuickActions.tsx          # Action buttons
│   ├── Posts/
│   │   ├── PostsTable.tsx            # Table display
│   │   ├── FilterBar.tsx             # Search/filter controls
│   │   ├── PostRow.tsx               # Single row
│   │   └── DeleteModal.tsx           # Delete confirmation
│   └── PostEditor/
│       ├── Editor.tsx                # Main editor container
│       ├── EditorTopBar.tsx          # Sticky top with title, buttons
│       ├── EditorSidebar.tsx         # Metadata panel
│       ├── TipTapEditor.tsx          # TipTap wrapper
│       └── ImageUpload.tsx           # Upload component
│
├── contexts/
│   ├── AdminAuthContext.tsx          # Auth user + logout
│   └── AdminErrorContext.tsx         # Error/success toasts
│
├── hooks/
│   ├── useSidebarState.ts            # Sidebar collapse state
│   └── usePostEditor.ts              # Editor state + auto-save
│
├── lib/admin/
│   ├── supabase.ts                   # Supabase client + error handling
│   ├── slugify.ts                    # Slug generation/validation
│   ├── dates.ts                      # Date formatting
│   ├── settings.ts                   # Settings CRUD
│   ├── uploads.ts                    # Image upload helpers
│   ├── posts.ts                      # Post queries (Step 4)
│   ├── categories.ts                 # Category queries (Step 6)
│   └── html.ts                       # HTML sanitization (Step 5)
│
└── types/admin.d.ts                  # All TypeScript interfaces
```

---

## Color Palette (Ridgewood)

```
Primary (Teal):         #006466  // Active states, primary CTAs
Secondary (Blue):       #2C3E50  // Headings, navigation
Text (Gray):            #415161  // Body text
Surface (Light Gray):   #E2E7ED  // Borders, dividers
Background (Off-White): #F8F9FB  // Page background
White:                  #FFFFFF  // Cards, content area
```

**In Tailwind:** `primary`, `secondary`, `text`, `surface`, `background`, `white`

---

## Key Error Handling Patterns

### Error Types & Display
| Type | Message | Retry | Example |
|---|---|---|---|
| RLS Violation | "You don't have permission" | ❌ | User editing someone else's post |
| Network | "Connection lost. Retrying..." | ✅ | No internet / timeout |
| Validation | "Invalid [field]: [message]" | ❌ | Bad email format |
| Not Found | "Post not found. May be deleted." | ❌ | Post ID no longer exists |
| Server (500) | "Something went wrong." | ✅ | Database crash |

### Usage in Components
```typescript
import { useAdminError } from '@/contexts/AdminErrorContext';

export function MyComponent() {
  const { showError, showSuccess } = useAdminError();

  const handleSave = async () => {
    try {
      await savePost(data);
      showSuccess('Post saved successfully');
    } catch (error) {
      showError(error.message);
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

---

## Auto-Save Pattern (Post Editor)

**Timing:**
- User types → `isDirty = true`
- Wait 2 seconds of inactivity
- Auto-save triggers → `isSaving = true`
- Success: `lastSaved = now`, `isDirty = false`
- Failure: Show error toast, retry every 5 seconds

**User Indicators:**
- Unsaved indicator: "Changes not saved"
- Saving indicator: Spinner animation
- Saved indicator: "Saved 2 minutes ago"
- Error indicator: Red text "Failed to save"

**Keyboard Shortcut:**
- Ctrl+S (Cmd+S on Mac) → Explicit save (ignores debounce)

---

## Sidebar Navigation

### Desktop (md+)
- Always visible, can toggle collapse
- Expanded: 240px width, labels visible
- Collapsed: 80px width, icon-only with tooltips
- Smooth transition: 0.3s ease

### Mobile (<md)
- Hidden by default
- Hamburger menu button in header
- Click → Slide-in overlay (100% width)
- Backdrop click or swipe-right to close
- Focus trap: Tab loops within menu, Escape closes

**Active State Styling:**
```tsx
className={cn(
  'flex items-center gap-3 px-4 py-2 rounded-lg transition',
  isActive 
    ? 'bg-primary text-white'
    : 'text-secondary hover:bg-surface'
)}
```

**Local Storage Keys:**
```javascript
'ridgewood-admin-sidebar-expanded'  // boolean
'ridgewood-admin-mobile-menu-open'  // boolean (resets on reload)
```

---

## Image Upload Helper

### Validation
```typescript
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

if (file.size > MAX_SIZE_MB * 1024 * 1024) {
  throw new Error(`File too large (max ${MAX_SIZE_MB}MB)`);
}
if (!ALLOWED_FORMATS.includes(file.type)) {
  throw new Error('Invalid format. Use JPEG, PNG, or WebP');
}
```

### Upload Flow
```
File Selected
  ↓ Client-side validation
  ↓ Show progress bar (0%)
  ↓ Upload to Supabase (blog-images/{user_id}/)
  ↓ Track progress (0-100%)
  ↓ Success: Return public URL
  ↓ or Failure: Show error, allow retry (max 3x)
```

### Store Uploaded URL
```typescript
// Featured image: Save to post.cover_image field
const post = await updatePost(id, { cover_image: imageUrl });

// Editor image: Insert into editor content
editor.chain().focus().setImage({ src: imageUrl }).run();
```

---

## Slug Generation

### Auto-Generation
```typescript
import { titleToSlug } from '@/lib/admin/slugify';

const title = "Hello World!";
const slug = titleToSlug(title); // "hello-world"
```

### Handling Duplicates
```typescript
import { generateUniqueSlug } from '@/lib/admin/slugify';

const existingSlugs = ['hello-world', 'hello-world-2'];
const slug = await generateUniqueSlug('hello-world', existingSlugs);
// Returns: 'hello-world-3'
```

### Validation
```typescript
import { isValidSlug } from '@/lib/admin/slugify';

const valid = isValidSlug('hello-world-2024'); // true
const invalid = isValidSlug('Hello World!');   // false
```

---

## Date Formatting

```typescript
import { 
  formatDate, 
  formatDateTime, 
  formatRelativeTime 
} from '@/lib/admin/dates';

formatDate('2024-12-09');           // "Dec 9, 2024"
formatDateTime('2024-12-09T14:30'); // "Dec 9, 2024 at 2:30 PM"
formatRelativeTime('2024-12-09');   // "2 days ago"
```

---

## Sidebar Hook Usage

```typescript
import { useSidebarState } from '@/hooks/useSidebarState';

export function AdminLayout() {
  const { isExpanded, isMobileOpen, toggleExpand, toggleMobileMenu, closeMobileMenu } = useSidebarState();

  return (
    <div className="flex">
      {/* Sidebar */}
      <div 
        className={cn(
          'w-60 md:w-20 transition-all',
          isExpanded ? 'md:w-60' : 'md:w-20'
        )}
      >
        {/* Collapsed state hides labels */}
        {isExpanded && <span>Dashboard</span>}
      </div>

      {/* Mobile hamburger */}
      <button 
        onClick={toggleMobileMenu} 
        aria-label="Toggle navigation"
        aria-expanded={isMobileOpen}
      >
        ☰
      </button>

      {/* Mobile menu overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main content */}
      <div className="flex-1">Content</div>
    </div>
  );
}
```

---

## Settings CRUD

```typescript
import { 
  getSettings, 
  updateSetting, 
  updateSettings 
} from '@/lib/admin/settings';

// Get all settings (with defaults)
const settings = await getSettings();
console.log(settings.site_title); // "Ridgewood Insights"

// Update single setting
await updateSetting('site_title', 'New Title');

// Update multiple settings
await updateSettings({
  site_title: 'New Title',
  contact_email: 'admin@example.com'
});
```

---

## Testing Checklist Template

### Before Commit
```
- [ ] Component renders without errors
- [ ] No console warnings
- [ ] Types check out (tsc --noEmit)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Error states display correctly
- [ ] Loading states show spinners
- [ ] Touch targets are 44px minimum
```

### Before PR
```
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] Manual QA on functionality
- [ ] Accessibility check (color contrast, ARIA)
- [ ] Performance check (no unnecessary re-renders)
- [ ] Error handling tested (network, RLS, validation)
```

### Before Deployment
```
- [ ] All features in this step work end-to-end
- [ ] Integration tested with Supabase
- [ ] Tested on staging environment
- [ ] Security review (no hardcoded secrets)
- [ ] User documentation updated
- [ ] Backup taken
```

---

## Common Issues & Solutions

### Issue: "You don't have permission"
**Cause:** RLS policy blocking access  
**Solution:** Check `is_admin` flag in profiles table, verify RLS allows action

### Issue: "Connection lost. Retrying..."
**Cause:** Network failure or Supabase downtime  
**Solution:** Check internet, verify Supabase status page, auto-retry will recover

### Issue: Auto-save not working
**Cause:** usePostEditor hook not debouncing correctly  
**Solution:** Verify 2s debounce is set, check browser console for errors

### Issue: Image upload stuck on 0%
**Cause:** Large file or slow connection  
**Solution:** Show helpful message "Uploading..." with timeout (auto-retry)

### Issue: Slug conflicts
**Cause:** Duplicate slugs in database  
**Solution:** Use `generateUniqueSlug()` helper, append -2, -3, etc.

---

## Performance Targets

| Metric | Target | How to Measure |
|---|---|---|
| First Contentful Paint | < 3 seconds | Lighthouse audit |
| Lighthouse Accessibility | 95+ | DevTools → Lighthouse |
| Lighthouse Best Practices | 90+ | DevTools → Lighthouse |
| Auto-save latency | < 5 seconds | Network tab, measure time |
| Image load time | < 2 seconds | Network tab |
| Bundle size (admin only) | < 500KB | next build output |

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (lint, typecheck, manual QA)
- [ ] Environment variables set (NEXT_PUBLIC_SUPABASE_URL, etc.)
- [ ] Database backups enabled
- [ ] Error tracking configured (Sentry, if using)
- [ ] User documentation complete

### Deployment
- [ ] Push to main branch
- [ ] Vercel build succeeds
- [ ] Production build succeeds locally (`npm run build`)
- [ ] Smoke test: Create draft → Publish → Verify live

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] User feedback collection
- [ ] Keep docs updated

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Testing
npm run lint            # Check code style
npm run typecheck       # TypeScript check

# Building
npm run build           # Production build
npm start               # Start production server

# Database
# See SUPABASE_SETUP.md for SQL commands
```

---

---

## Progress Tracker

| Step | Status | Description |
|------|--------|-------------|
| 1 | ✓ Complete | Foundation & Setup (types, auth, error handling, validation) |
| 2 | ✓ Complete | Sidebar Navigation (desktop/mobile, responsive, accessible) |
| 3 | ✓ Complete | Dashboard Page (stats, activity feed, quick actions) |
| 4 | ✓ Complete | Posts List Page (filters, table, pagination) |
| 5 | ✓ Complete | Post Editor (TipTap, auto-save, image upload) |
| 6 | ✓ Complete | Categories Management (CRUD, validation) |
| 7 | ⏹ Pending | Settings Page (site config) |
| 8 | ⏹ Pending | Testing & Deployment |

---

**Last Updated:** December 10, 2025  
**Document Version:** 2.2 (Step 6 Complete)
