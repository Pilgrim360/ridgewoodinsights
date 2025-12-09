# Supabase Admin CMS Interface - Development Plan

## Overview

The Ridgewood Insights admin CMS provides a web-based interface for managing content across the marketing website. Built with Next.js and Supabase, it allows authorized administrators to manage blog posts, categories, and other dynamic content without direct database access.

---

## Part 1: Architecture & Design Foundation

### UI Architecture Overview

The admin CMS follows a two-panel layout with collapsible sidebar navigation.

#### I. Left Navigation Sidebar

This contains your routing. Since we are using a "collapsible" design, icons are crucial so they remain visible when the text is hidden.

**A. Header Section**
- **Logo/Site Name:** Top left
- **Collapse Toggle:** Icon to toggle sidebar expansion

**B. Primary Navigation Items**
- Dashboard (default view, home icon)
- Posts (manage all blog entries)
- Media (image and file library)
- Categories (content organization)
- Comments (moderation and management - coming soon)
- Settings (site configuration)
- Analytics (traffic and engagement metrics) - coming soon

**Menu Behavior**
- Expanded state shows icons with labels
- Collapsed state shows icons only with tooltips on hover
- Active route is visually highlighted
- Toggle button at top or bottom of sidebar
- Menu state persists across navigation (localStorage)

**C. Footer Section (Pinned to Bottom)**
- **User Indicator:** Circle thumbnail and small text showing logged-in user (e.g., "Admin")
- **Logout Button:** Icon with LogOut action – Critical for security

#### II. Right Panel: Display Area

The main workspace that updates based on the selected navigation item. This area should be responsive and include consistent header elements.

**Common Elements Across Views**
- Page title corresponding to current section
- Breadcrumb navigation for nested views
- Primary action button (contextual: "New Post", "Upload Media", etc.)
- Search/filter controls where applicable
- Content area with appropriate layouts for each section

### IV. Responsive Considerations

- **Mobile/Tablet:** Navigation menu collapses to hamburger icon by default
- **Dashboard Cards:** Stack vertically on smaller screens
- **Touch Targets:** Minimum 44px tap targets throughout
- **Gesture Support:** Swipe gesture to open/close navigation on mobile

### V. Visual Design Principles

- Clean, minimal interface that doesn't compete with content
- Sufficient white space for readability
- Clear visual hierarchy with typography
- Consistent color coding:
  - Primary actions (teal/primary color)
  - Destructive actions (red with warning styling)
  - Status indicators (green for published, gray for draft)
- Loading states and feedback for all actions
- Accessibility: ARIA labels, keyboard navigation, sufficient contrast

---

## Part 2: Authentication & Access Control

### Admin Portal URL

- **Development:** `http://localhost:3000/admin`
- **Production:** `https://ridgewoodinsights.com/admin`

### User Roles & Permissions

#### Admin
- Full access via `is_admin = true` in profiles table
- Can create, edit, delete all posts
- Can manage categories
- Can manage other admin users
- Can access analytics and system logs

#### Authenticated Users (Non-Admin)
- Can create and edit their own posts
- Cannot edit other users' posts
- Cannot publish directly (draft → admin approval)
- Can read their own drafts and published posts

#### Public / Unauthenticated
- Read-only access to published posts
- Can view all categories
- Cannot create or edit content

### Authentication Flow

1. Navigate to `/admin` route
2. Sign in with Supabase email/password
3. System verifies `is_admin` flag in profiles table
4. Dashboard loads with appropriate permissions
5. Session maintained via Supabase auth tokens
6. Automatic logout after 24 hours of inactivity

---

## Part 3: Content Management Sections

### 1. Blog Posts Management

**Database Table:** `posts`

**Fields (from SUPABASE_SETUP.md):**
- `id` (UUID) - Primary key
- `author_id` (UUID) - References profiles(id), cannot be null
- `category_id` (UUID, nullable) - References categories(id)
- `title` (text) - Blog post title
- `slug` (text, unique) - URL-friendly identifier
- `excerpt` (text, nullable) - Preview text for listings
- `content_html` (text, nullable) - Full article body in HTML
- `cover_image` (text, nullable) - Featured image URL
- `status` (enum) - One of: 'draft', 'published', 'scheduled'
- `published_at` (timestamptz, nullable) - Publication date
- `disclaimer_type` (enum) - One of: 'none', 'general', 'legal'
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last modification timestamp

**Validation Rules:**
- Title: Required, text
- Slug: Required, unique, auto-generated from title or manual entry
- Content: Markdown format, optional
- Category: Optional, must reference existing category
- Status: Required, one of enum values
- Published_at: Set when status changes to published

#### Admin Interface Components:

**III. Posts Management (/admin/posts)**

**Goal:** Find and manage content.

**Header:** 
- Title "Posts" + Button "Create New"

**Filter Bar:**
- Search Input: Filter by title
- Dropdown: Status (All / Published / Draft)
- Dropdown: Category

**The Data Table:**
- **Title:** Bold text
- **Status:** Badge (Green for Published, Gray for Draft)
- **Category:** Simple text tag
- **Date:** "Published on [Date]" or "Last saved [Date]"
- **Actions (Kebab Menu ...):** Edit, Delete

**Additional Features:**
- List view with filterable columns (status, category, author, date)
- Edit existing posts with side-by-side markdown preview
- Category selection dropdown (from categories table)
- Featured image upload with preview
- Status toggle (draft/published/scheduled)
- Disclaimer type selection (none/general/legal)
- View post creation/modification history
- Bulk actions (delete, change status)
- Search posts by title or content

#### Post Editor (/admin/posts/[id])

**Goal:** Distraction-free writing. This is the most complex screen.

**Top Action Bar (Sticky):**
- Title input field with slug preview/edit
- Save Draft button
- Publish button (for admins only)
- Status indicator
- Last saved timestamp
- Preview toggle

**Main Editor Area:** 
- Rich text editor (WYSIWYG) with HTML output
- Toolbar with formatting options (bold, italic, headings, lists, links, code blocks)
- Live preview of rendered HTML
- Word count display
- Auto-save status indicator

**Sidebar (Post Metadata):**
- Category dropdown with multi-select option
- Featured image upload area with preview
- Publication date picker (appears when status = 'published' or 'scheduled')
- Status selector (Draft / Published / Scheduled)
- Disclaimer type selector (None / General / Legal)
- Post excerpt editor (short text area)
- SEO slug editor
- Author display (read-only)
- Created/Updated timestamp display

**Bottom Action Area:**
- Auto-save status indicator (e.g., "Saved 2 minutes ago")
- Full-width Save Draft button
- Full-width Publish button (if admin)
- Unsaved changes warning modal on navigation away

### 2. Categories Management

**Database Table:** `categories`

**Fields (from SUPABASE_SETUP.md):**
- `id` (UUID) - Primary key
- `name` (text) - Category display name
- `slug` (text, unique) - URL-friendly identifier
- `created_at` (timestamptz) - Creation timestamp

**Validation Rules:**
- Name: Required, text
- Slug: Required, unique, lowercase alphanumeric + hyphens

**Predefined Categories (from SUPABASE_SETUP.md):**
- Tax Planning (tax-planning)
- Financial Strategy (financial-strategy)
- Business Insights (business-insights)
- Industry News (industry-news)
- Accounting Tips (accounting-tips)

**Admin Interface:**
Goal: Quick CRUD (Create, Read, Update, Delete).
Split Layout:
Left (Form): "Add New Category" (Name input + "Add" button).
Right (List): A list of existing categories with a "Delete" (trash can) icon next to each.
- List view of all categories
- Create new category form
- Edit existing categories
- Delete categories (check for posts using category first)
- Reorder categories if needed
- View how many posts in each category

### 3. Dashboard (Default View)

**When users first log in or click the dashboard link, they see an overview of their blog's status and activity.**

**Dashboard Components:**

**Quick Stats Cards** - Metrics displayed in a grid layout at the top:
- Total posts (published, draft, scheduled counts)
- Total page views (last 30 days)



**Recent Activity Feed** - Chronological list showing:
- Recently published posts
- Draft posts in progress


**Quick Actions Panel** - Prominent shortcuts to common tasks:
- Create new post
- Upload media
- View site


---

## Part 4: Image Management

### Image Upload & Storage

**Supabase Storage Bucket:** `blog-images`

**Upload Process (from SUPABASE_SETUP.md):**
1. Admin authenticates with Supabase credentials
2. Selects image from local file system
3. Uploaded to `blog-images` bucket under `{user-id}/` folder path
4. Image URL stored in `posts.cover_image` field
5. Frontend displays optimized version via next/image

**Image Optimization:**
- Use `next/image` for automatic optimization
- Multiple responsive sizes generated
- WEBP format for modern browsers
- Max file size: 5MB (recommended)
- Supported formats: JPEG, PNG, WebP

**Image Organization:**
```
blog-images/
└── {user-id}/
    └── [post-images]
```

**RLS Storage Policies (from SUPABASE_SETUP.md):**
- Public can view all images in bucket
- Authenticated users can upload under their own `{user-id}` folder
- Users can update/delete only their own images
- Admins can perform all actions

---

## Part 5: Workflow & Publishing

### Publishing Workflow

**For Admin Users:**
1. Create/edit post with title, content, category, status
2. Save as draft (status = 'draft')
3. Preview post
4. Change status to 'published' and set published_at timestamp
5. Changes appear on site within 30 seconds

**For Non-Admin Authenticated Users:**
- Can create posts (status = 'draft')
- Can edit own drafts
- Cannot change status to 'published' (requires admin)
- Can only view their own drafts via RLS

### Draft Management

- Save drafts with status = 'draft'
- Manual save option
- Auto-save handled by frontend (optional)
- Edit history tracked via created_at / updated_at
- Only author and admins can view draft posts (enforced by RLS)

### Scheduled Posts

- Create post with status = 'scheduled'
- Set future `published_at` timestamp
- Frontend/cron job publishes at scheduled time
- Change status to 'published' when ready

---

## Part 6: Frontend Integration

### Data Fetching

**Frontend pages fetch from Supabase:**
- Blog index page queries `posts` where status = 'published'
- Individual blog post pages fetch from `posts` by slug
- Category pages filter `posts` by category_id and status
- Homepage can feature recent published posts

**Caching Strategy:**
- Server-side caching with 1-hour revalidation
- ISR (Incremental Static Regeneration) for blog pages
- Cache invalidation on post updates via Supabase webhooks

### Real-time Updates

**Supabase Real-time subscriptions:**
- Admin dashboard shows live notifications of post updates
- Published posts reflect within 30 seconds on frontend
- Draft changes isolated from public site (RLS enforces)

---

## Part 7: Security & Row-Level Security (RLS)

**Security policies (from SUPABASE_SETUP.md):**

**Posts Table:**
- Public can read posts where status = 'published'
- Authors can read their own posts (all statuses)
- Authors can create posts with author_id = auth.uid()
- Authors can update their own posts
- Authors can delete their own posts
- Admins (is_admin = true) can perform all actions

**Categories Table:**
- Public can read all categories
- Admins can create/update/delete categories

**Profiles Table:**
- Users can read/update own profile
- Admins can perform all actions

**Storage Objects (blog-images):**
- Public can view all images
- Authenticated users can upload to own {user-id}/ folder
- Users can update/delete own images
- Admins can perform all actions

---

## Part 7.5: Type Definitions & State Management Strategy

### TypeScript Interfaces

Create `src/types/admin.d.ts`:

```typescript
// Post-related types
export interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content_html?: string;
  cover_image?: string;
  category_id?: string;
  status: 'draft' | 'published' | 'scheduled';
  disclaimer_type: 'none' | 'general' | 'legal';
  published_at?: string;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PostFormState extends PostData {
  isDirty: boolean;
  lastSaved?: Date;
  isSaving?: boolean;
  saveError?: string;
}

// Category-related types
export interface CategoryData {
  id?: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface CategoryWithPostCount extends CategoryData {
  post_count: number;
}

// Dashboard types
export interface DashboardStats {
  total_posts: number;
  published_count: number;
  draft_count: number;
  scheduled_count: number;
  total_page_views: number;
}

export interface RecentActivity {
  id: string;
  type: 'post_published' | 'post_drafted' | 'post_updated';
  post_title: string;
  post_id: string;
  created_at: string;
}

// Admin context types
export interface AdminContextType {
  isLoading: boolean;
  error?: string;
}

// Filter state
export interface PostFilters {
  search?: string;
  status?: 'all' | 'draft' | 'published' | 'scheduled';
  category_id?: string;
  page?: number;
  per_page?: number;
}

// Upload types
export interface UploadProgress {
  isUploading: boolean;
  progress: number; // 0-100
  error?: string;
}
```

### State Management Strategy

**Approach:** Context API + React Hooks (minimal, component-local state for MVP)

**Rationale:**
- No complex cross-component state needed for MVP
- Reduces dependencies (no Zustand/Redux required)
- Local state (useState) for sidebar collapse, modals, filters
- Context for admin auth user + global error boundary
- Custom hooks for reusable logic (usePostEditor, useSidebarState)

**Key contexts to create:**
1. `AdminAuthContext` – Logged-in admin user, logout handler
2. `AdminErrorContext` – Global error handling and toast notifications

---

## Part 8: Step-by-Step Development Implementation

### Step 1: Foundation & Setup (3-4 hours)

**Objectives:** Set up routing, authentication, contexts, error handling, and types

#### 1.1 Create Type Definitions
- [ ] Create `src/types/admin.d.ts` with all interfaces from Part 7.5

#### 1.2 Authentication & Routing
- [ ] Create `/admin` route group in Next.js App Router
- [ ] Build admin layout wrapper (`src/app/(admin)/layout.tsx`) with two-panel structure
- [ ] Create authentication middleware to verify `is_admin` flag and redirect non-admins
- [ ] Implement sign-out functionality in header/sidebar
- [ ] Verify Supabase auth integration with session persistence

#### 1.3 Error Handling & Contexts
- [ ] Create error boundary component (`src/components/admin/ErrorBoundary.tsx`):
  - Catches component errors (null children, missing data, RLS violations)
  - Displays user-friendly error UI with retry button
  - Logs technical errors for debugging
- [ ] Create `AdminAuthContext` (`src/contexts/AdminAuthContext.tsx`):
  - Provides logged-in user data
  - Manages auth state and logout
  - Wraps admin layout
- [ ] Create `AdminErrorContext` (`src/contexts/AdminErrorContext.tsx`):
  - Global error/success toast notifications
  - useError/useSuccess hooks for components
  - Auto-dismiss toasts after 5 seconds
  - Wraps admin layout beneath ErrorBoundary

#### 1.4 Supabase Query Abstraction Layer
- [ ] Create `src/lib/admin/supabase.ts`:
  - Initialize Supabase client with proper auth headers
  - Document pattern for all queries (queries return data OR throw error with message)
  - Add error-handling wrapper (catch RLS violations, network errors, format messages)

#### 1.5 Shared Admin Utilities
- [ ] Create `src/lib/admin/slugify.ts`:
  - Converts title → slug (lowercase, hyphens, remove special chars)
  - Handle slug conflicts (append `-2`, `-3` if not unique)
- [ ] Create `src/lib/admin/dates.ts`:
  - Format dates consistently (e.g., "Dec 9, 2025")
  - Format relative times (e.g., "2 minutes ago")
- [ ] Create `src/hooks/useSidebarState.ts`:
  - Manage sidebar collapse state with localStorage persistence
  - useCallback for toggle to prevent unnecessary re-renders

#### 1.6 Settings MVP (Minimal)
- [ ] Create settings table entry structure in Supabase (or use config)
- [ ] Create `src/lib/admin/settings.ts` with getSettings() and updateSetting() queries
- [ ] Plan minimal settings scope: Site Title, Tagline, Contact Email (just CRUD, no JSON editor for MVP)
- [ ] Defer `/admin/settings` page to Step 7 (after core features)

**Files to Create:**
- `src/types/admin.d.ts`
- `src/app/(admin)/layout.tsx`
- `src/app/(admin)/page.tsx` (dashboard stub)
- `src/components/admin/ErrorBoundary.tsx`
- `src/contexts/AdminAuthContext.tsx`
- `src/contexts/AdminErrorContext.tsx`
- `src/middleware.ts` (updated for admin routes)
- `src/lib/admin/supabase.ts`
- `src/lib/admin/slugify.ts`
- `src/lib/admin/dates.ts`
- `src/lib/admin/settings.ts`
- `src/hooks/useSidebarState.ts`

**Error Handling Patterns (document in lib):**

| Error Type | Display | Action |
|---|---|---|
| RLS Violation | "You don't have permission for this action" | Log, no retry |
| Network Error | "Connection lost. Retrying..." | Auto-retry 3x, then "Failed. Reload page" |
| Validation Error | "Invalid [field]: [message]" | Show in-form, user corrects |
| Server Error (500) | "Something went wrong. Contact support." | Log, offer reload |
| Not Found (404) | "Post not found. It may have been deleted." | Go back button |

**Testing:**
- Verify non-admins are redirected away from `/admin`
- Test authentication flow and session persistence
- Confirm error boundary catches and displays errors
- Test error context toasts (trigger toast, verify auto-dismiss)
- Verify localStorage persists sidebar state across reload
- Test slug generation with duplicates and special characters

---

### Step 2: Sidebar Navigation Component (2-3 hours)

**Objectives:** Build the left navigation with collapsible state and mobile responsiveness

#### 2.1 Desktop Sidebar (Expanded & Collapsed States)
- [ ] Create `src/components/admin/Sidebar.tsx`:
  - Two-panel layout container (sidebar + main content wrapper)
  - Sidebar width: expanded 240px, collapsed 80px
  - Smooth transition on collapse/expand (0.3s ease)
  - Uses primary color (#006466) for active states, secondary for hover states
- [ ] Create `src/components/admin/SidebarHeader.tsx`:
  - Logo/Site name (visible when expanded, hidden when collapsed)
  - Collapse toggle button (always visible, changes icon Chevron ← / →)
  - Sticky to top
- [ ] Create `src/components/admin/SidebarLink.tsx`:
  - Icon + Label (label hidden when sidebar collapsed)
  - Active state: `bg-primary text-white`, inactive: `text-secondary hover:bg-surface`
  - Tooltip on hover (when collapsed only, use title attribute + Headless UI Popover)
  - Touch targets minimum 44px (important for mobile)
- [ ] Create `src/components/admin/SidebarFooter.tsx`:
  - Pinned to bottom of sidebar
  - User avatar circle + name (name hidden when collapsed)
  - Logout button (icon-only when collapsed, text when expanded)
  - Divider above footer

#### 2.2 Mobile Responsiveness (< md breakpoint)
- [ ] Implement mobile hamburger menu (Tailwind `hidden md:block`):
  - Sidebar hidden by default on mobile (<768px)
  - Hamburger icon in header (always visible)
  - On click, sidebar overlays content with:
    - Semi-transparent backdrop (bg-black/50)
    - Sidebar slides in from left (100% width or 240px max)
    - Smooth transition (0.3s ease)
    - Click backdrop to close
    - Swipe-to-close gesture (detect right swipe, trigger close)
- [ ] Handle focus management on mobile:
  - When menu opens, focus first nav link
  - Trap focus within sidebar (Tab loops to close button)
  - When menu closes, return focus to hamburger button
  - Test with screen readers
- [ ] Touch gesture support:
  - Left-swipe gesture to close sidebar
  - Minimum 20px drag distance to trigger
  - Use React event handlers (onTouchStart, onTouchMove, onTouchEnd)

#### 2.3 Responsive Navigation Items
- [ ] Navigation items layout:
  - Desktop (md+): Sidebar always visible or collapsed, can expand by toggle
  - Tablet (sm-md): Sidebar collapses to icons by default, toggle to expand
  - Mobile (<sm): Sidebar hidden, hamburger menu only
- [ ] Breakpoint strategy:
  - `hidden md:flex` for desktop sidebar
  - `fixed md:relative` for mobile hamburger overlay
  - Z-index: sidebar 40, backdrop 30, so sidebar floats above

#### 2.4 State & Persistence
- [ ] Use `useSidebarState()` hook (created in Step 1):
  - `isExpanded` state
  - `toggleSidebar()` function
  - `isMobileOpen` state (for mobile hamburger)
  - `toggleMobileMenu()` function
  - localStorage key: `ridgewood-admin-sidebar-expanded` (boolean)
  - localStorage key: `ridgewood-admin-mobile-menu-open` (boolean, resets on page reload for UX)

**Files to Create:**
- `src/components/admin/Sidebar.tsx`
- `src/components/admin/SidebarHeader.tsx`
- `src/components/admin/SidebarLink.tsx`
- `src/components/admin/SidebarFooter.tsx`
- Update `src/hooks/useSidebarState.ts` to include mobile menu state

**Styling Patterns:**
```tsx
// Sidebar width transitions
className={cn(
  'w-80 md:w-20 transition-all duration-300',
  isExpanded && 'md:w-60'
)}

// Icon + Label layout
className={cn(
  'flex items-center gap-3',
  !isExpanded && 'justify-center'
)}

// Active state colors
className={cn(
  'text-secondary',
  isActive && 'bg-primary text-white',
  !isActive && 'hover:bg-surface'
)}
```

**Accessibility Requirements:**
- Use semantic `<nav>` with `aria-label="Admin navigation"`
- SidebarLink uses `<a>` or `<Link>` with proper href
- Active link has `aria-current="page"`
- Hamburger button has `aria-label="Toggle navigation"` and `aria-expanded` attribute
- Tooltips use `title` attribute (avoid complex tooltips on mobile)
- Ensure 4.5:1 contrast for text on sidebar (primary bg)

**Testing:**
- Verify expand/collapse persists across page navigation
- Test active route highlighting matches current URL
- Check collapse transition smoothness (no janky reflow)
- Mobile: Test hamburger open/close, backdrop click, swipe gesture
- Mobile: Test keyboard focus trap (Tab through menu, Escape closes)
- Verify tooltips only appear on hover (desktop), not on touch (mobile)
- Test responsive layout at sm, md, lg breakpoints
- Verify touch targets are 44px minimum

---

### Step 3: Dashboard Page (2-3 hours)

**Objectives:** Build the default landing page with stats and quick actions

- [ ] Create `admin/page.tsx` as Dashboard component
- [ ] Build Quick Stats Cards section (4-column grid responsive)
- [ ] Build Recent Activity Feed (chronological list)
- [ ] Build Quick Actions Panel (4 primary CTA buttons)
- [ ] Fetch real data from Supabase:
  - Post counts by status (published, draft, scheduled)
  - Recent activity from posts/comments tables
- [ ] Add loading skeletons for each section
- [ ] Implement error states

**Files to Create:**
- `src/app/(admin)/page.tsx`
- `src/components/admin/Dashboard/StatsCard.tsx`
- `src/components/admin/Dashboard/ActivityFeed.tsx`
- `src/components/admin/Dashboard/QuickActions.tsx`
- `src/lib/admin/stats.ts` (queries for dashboard)

**Database Queries:**
- Count published/draft/scheduled posts
- Fetch recent posts with pagination
- Count pending comments

**Testing:**
- Verify stats update correctly after post changes
- Test skeleton loading state
- Confirm responsive grid layout

---

### Step 4: Posts List Page (2-3 hours)

**Objectives:** Build the Posts Management interface with filtering and table

- [ ] Create `admin/posts/page.tsx`
- [ ] Build Filter Bar:
  - Search input (filter by title)
  - Status dropdown (All / Published / Draft)
  - Category dropdown
- [ ] Build Data Table with columns:
  - Title (bold)
  - Status (badge)
  - Category (text tag)
  - Date
  - Actions (kebab menu: Edit, Delete)
- [ ] Implement pagination
- [ ] Add "Create New Post" button
- [ ] Implement search/filter state management
- [ ] Add delete confirmation modal
- [ ] Fetch posts data from Supabase with RLS

**Files to Create:**
- `src/app/(admin)/posts/page.tsx`
- `src/components/admin/Posts/PostsTable.tsx`
- `src/components/admin/Posts/FilterBar.tsx`
- `src/components/admin/Posts/PostRow.tsx`
- `src/lib/admin/posts.ts` (CRUD queries)

**Database Queries:**
- Fetch posts with filters (status, category, search)
- Count total posts for pagination

**Testing:**
- Test filter functionality
- Verify pagination
- Confirm delete works with warning modal
- Check status badges render correctly

---

### Step 5: Post Editor Page (4-5 hours)

**Objectives:** Build the complex editor with rich text editing, auto-save, and image uploads

#### 5.1 Auto-Save Implementation Strategy

**Design Pattern:**
- User edits post → onChange fires → component state updates instantly (optimistic UI)
- Debounced auto-save triggers after 2 seconds of inactivity
- Auto-save persists to Supabase (status remains 'draft')
- Success: lastSaved timestamp updates, auto-save indicator briefly shows "Saved"
- Failure (network/RLS): Save indicator shows error, retry automatically every 5 seconds until success
- Unsaved changes indicator: Shows if form is dirty AND lastSaved is older than current state
- On navigation away: Modal warning if isDirty AND not yet saved, with options "Save & Leave" or "Discard"

**Conflict Resolution:**
- If multiple tabs open same post and both edit, last save wins (server timestamp resolution)
- On conflict, show toast: "This post was updated in another tab. Reload to see changes." with reload button
- User can choose to reload (discard local changes) or keep editing locally
- For MVP, keep strategy simple: last-write-wins (Supabase's default behavior)

**Auto-Save State Machine:**
```
Idle → User Edits → Debouncing (2s) → Saving → Saved ✓
                ↓                            ↓
             (cancel)                   Error (auto-retry 5s)
```

#### 5.2 Rich Text Editor (TipTap 2)

**Choice Rationale:** TipTap 2 (vs. react-quill)
- Smaller bundle (~50KB vs. 200KB for Quill)
- Modular extensions system
- Clean HTML output (no wrapper divs or extra markup)
- Better TypeScript support
- Headless: gives us complete control over toolbar UI

**Dependencies to Add:**
```json
"@tiptap/react": "^2.0.0",
"@tiptap/starter-kit": "^2.0.0",
"@tiptap/extension-link": "^2.0.0",
"@tiptap/extension-image": "^2.0.0"
```

**Editor Features:**
- Toolbar: Bold, Italic, Strikethrough, Code
- Block formatting: H2, H3, H4, Bullet list, Ordered list, Code block, Blockquote
- Links: Insert/edit links with URL validation
- Images: Embed images from uploads (see Section 5.4)
- Character count: Real-time word and character count
- Placeholder: "Start writing..."
- Auto-focus on load (if editing existing post)
- Height: min-height 400px, expandable via scroll
- Scrollable content area with sticky toolbar
- Readonly view for published posts

#### 5.3 Top Action Bar (Sticky)

- [ ] Title input:
  - Full-width input, large font (24px)
  - Placeholder: "Post title"
  - Auto-generate slug from title (update slug field in sidebar, debounced)
  - Clear button (X) to reset title
- [ ] Action buttons (right side):
  - "Save Draft" button: Primary button, always visible, saves without publishing
  - "Publish" button: Secondary button, admin-only, changes to "Update" if already published
  - Status badge: Shows "Draft", "Published", or "Scheduled"
  - Last saved timestamp: "Saved 2 minutes ago" (updates on each successful save)
  - Auto-save indicator: Discrete spinner/checkmark that appears during save, auto-hides

**Styling:**
- Sticky top: `sticky top-0 z-20 bg-white shadow-sm border-b`
- Flexbox layout with space-between for responsive wrapping on mobile
- On mobile: Stack buttons vertically, make them full-width

#### 5.4 Main Editor Area (Two-Column Layout on Desktop)

**Left Column (Editor, 70% on desktop):**
- Rich text editor (TipTap) with toolbar
- Toolbar sticks to top of editor area
- Character/word count below editor (small gray text)
- Editor fills remaining vertical space with scroll

**Right Column (Metadata Sidebar, 30% on desktop, hidden on mobile):**
- Featured image upload (see Section 5.5)
- Category dropdown (fetch from categories table)
- Publication date picker (hidden unless status = published/scheduled)
- Status selector (Draft / Published / Scheduled dropdown)
- Disclaimer type selector (None / General / Legal)
- Excerpt text area (2-3 sentence preview)
- SEO slug editor (manual override of auto-generated slug)
- Author display (read-only)
- Created/Updated timestamps (read-only)
- Delete button (admin only, red warning style, confirmation modal)

**Mobile Behavior:**
- Stack vertically (editor on top, sidebar below)
- Sidebar becomes collapsible sections or stacked blocks

#### 5.5 Image Upload Component

**Upload Flow:**
1. User clicks "Upload image" button in sidebar or image insert from editor toolbar
2. File picker opens (accept: image/jpeg, image/png, image/webp)
3. On file select:
   - Client-side validation: size < 5MB, format check
   - Show error toast if invalid
   - Show upload progress bar (0-100%)
4. Upload to Supabase `blog-images/{user_id}/` folder
5. On success:
   - Return image URL
   - Featured image upload: Store URL in `cover_image` field
   - Editor image insert: Insert `<img src={url} alt="">` into editor
   - Show success toast
6. On failure:
   - Show error toast with retry button
   - Clear progress
   - Retry available for up to 3 attempts

**Image Optimization:**
- Next/Image will handle optimization on frontend display
- Store original in Supabase (no server-side resizing for MVP)
- Recommended: Compress before upload (use TinyPNG or canvas compression)

**Upload Component Details:**
- [ ] Create `src/components/admin/PostEditor/ImageUpload.tsx`:
  - Drag-and-drop area or file input button
  - Progress bar during upload
  - Error states with retry
  - Show uploaded image preview (featured image)
- [ ] Create image upload helper: `src/lib/admin/uploads.ts`:
  - Validate file (size, format)
  - Upload to Supabase storage (with progress callback)
  - Generate Supabase public URL
  - Handle errors and retries

#### 5.6 Post Editor Hook (usePostEditor)

**State Management:**
```typescript
const [form, setForm] = useState<PostFormState>(initialPost);
const [isDirty, setIsDirty] = useState(false);
const [lastSaved, setLastSaved] = useState<Date | null>(initialPost?.updated_at);
const [isSaving, setIsSaving] = useState(false);
const [saveError, setSaveError] = useState<string | null>(null);

// Auto-save debounce
const debouncedAutoSave = useCallback(
  debounce(async (data: PostData) => {
    setIsSaving(true);
    try {
      const result = await savePost(data, { publish: false });
      setLastSaved(new Date());
      setIsDirty(false);
      setSaveError(null);
    } catch (err) {
      setSaveError(err.message);
      // Auto-retry in 5s
      setTimeout(() => debouncedAutoSave(data), 5000);
    } finally {
      setIsSaving(false);
    }
  }, 2000),
  []
);

// Handle unsaved changes warning
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);

// Keyboard shortcut Ctrl+S to save
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveDraft();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [form]);

return {
  form,
  setForm,
  isDirty,
  lastSaved,
  isSaving,
  saveError,
  handleSaveDraft: async () => { /* explicit save */ },
  handlePublish: async () => { /* publish post */ },
  handleDelete: async () => { /* delete post */ },
};
```

**Files to Create:**
- `src/app/(admin)/posts/[id]/page.tsx`
- `src/app/(admin)/posts/new/page.tsx`
- `src/components/admin/PostEditor/Editor.tsx` (main container)
- `src/components/admin/PostEditor/EditorTopBar.tsx` (sticky top)
- `src/components/admin/PostEditor/EditorSidebar.tsx` (right panel)
- `src/components/admin/PostEditor/TipTapEditor.tsx` (TipTap wrapper)
- `src/components/admin/PostEditor/ImageUpload.tsx` (upload component)
- `src/hooks/usePostEditor.ts` (state + auto-save logic)
- `src/lib/admin/uploads.ts` (image upload helpers)
- `src/lib/admin/html.ts` (HTML sanitization and utilities)

**Database Queries:**
- `getPost(id)` – Fetch post by ID, check ownership/admin
- `createPost(data)` – Create new draft post with author_id
- `updatePost(id, data)` – Update post (can only change own posts, unless admin)
- `deletePost(id)` – Delete post (can only delete own, unless admin)
- `publishPost(id, data)` – Publish post (admin only, sets status and published_at)
- `uploadImage(file, folder)` – Upload to Supabase storage, return public URL

**Testing:**
- Test rich text formatting: bold, italic, headings, lists, code blocks, blockquotes
- Test link insertion and editing (manual URL entry)
- Test image upload: drag-drop, file picker, progress bar, error handling, retry
- Test auto-save: trigger save after 2s of inactivity, verify state updates, test failure/retry
- Test unsaved changes warning: edit post, try to navigate away, verify modal appears
- Test keyboard shortcut Ctrl+S (or Cmd+S on Mac)
- Test title-to-slug auto-generation (debounced)
- Test status changes: draft → published, verify published_at set, test scheduled status
- Test delete button: verify confirmation modal, verify post deleted from DB
- Test on mobile: verify editor is usable, sidebar stacks properly, buttons are touch-friendly
- Test featured image upload: upload, preview display, delete option
- Verify HTML output is clean and semantic (no extra wrapper divs)

---

### Step 6: Categories Management Page (1.5-2 hours)

**Objectives:** Build CRUD interface for categories

- [ ] Create `admin/categories/page.tsx`
- [ ] Build Categories List:
  - Table with Name, Slug, Post Count columns
  - Edit and Delete actions
- [ ] Build Create Category Form (modal or page):
  - Name input (required)
  - Slug input (auto-generated or manual)
- [ ] Build Edit Category Form
- [ ] Implement validation
- [ ] Add delete confirmation with post count warning
- [ ] Fetch categories from Supabase

**Files to Create:**
- `src/app/(admin)/categories/page.tsx`
- `src/components/admin/Categories/CategoriesList.tsx`
- `src/components/admin/Categories/CategoryForm.tsx`
- `src/components/admin/Categories/CategoryModal.tsx`
- `src/lib/admin/categories.ts` (CRUD queries)

**Database Queries:**
- Fetch all categories
- Count posts per category
- Create/update/delete category

**Testing:**
- Test CRUD operations
- Verify slug auto-generation
- Confirm post count warning on delete
- Check unique slug validation

---

### Step 7: Settings Page (Optional, Future) (1-2 hours)

**Objectives:** Provide basic site configuration interface

- [ ] Create `admin/settings/page.tsx`
- [ ] Build Key-Value Form Interface for simple settings
- [ ] Implement JSON editor for complex configurations
- [ ] Store settings in Supabase settings table or JSON column
- [ ] Add change history/audit trail
- [ ] Implement rollback capability (optional)

**Files to Create:**
- `src/app/(admin)/settings/page.tsx`
- `src/components/admin/Settings/SettingsForm.tsx`
- `src/lib/admin/settings.ts`

**Defer this step:** Implement only if core features are stable.

---

### Step 7.5: Real-Time Subscriptions (Optional - Out of Scope for MVP)

**Note:** Real-time subscriptions to show live updates across tabs/users are **deferred** for MVP.

**Why deferred:**
- Adds complexity to state management
- Supabase Realtime requires additional configuration and client setup
- MVP can achieve 95% UX with polling and manual refresh
- Can be added post-launch without breaking changes

**If you implement later:**
- Use Supabase Realtime to subscribe to `posts` table changes
- Show toast when post is updated in another tab: "This post was updated elsewhere. Reload?"
- Consider polling dashboard for stats updates (every 30s) instead of real-time
- Keep complexity out of post editor (one writer at a time)

---

### Step 8: Testing & Deployment (3-4 hours)

**Objectives:** Verify functionality, accessibility, and security before production

#### 8.1 Comprehensive Testing Checklist

**Core Workflows:**
- [ ] Admin authentication flow (sign in, sign out, persist session)
- [ ] Dashboard stats accuracy (post counts match DB, page views tracking)
- [ ] Post CRUD operations (create, edit, publish, delete, all status changes)
- [ ] Search/filter functionality (by title, status, category, pagination)
- [ ] Image uploads (featured image, editor images, progress, error recovery)
- [ ] Category management (CRUD, slug generation, delete with post count warning)
- [ ] Auto-save functionality (verify saves after 2s inactivity, retry on failure)
- [ ] Unsaved changes warning (try navigate away without saving, modal appears)
- [ ] Keyboard shortcuts (Ctrl+S to save)

**Permissions & Security:**
- [ ] Non-admin users cannot access `/admin` (redirect to login)
- [ ] Non-admin users can create drafts but cannot publish (admin-only button)
- [ ] Non-admin users can only edit their own posts (not others')
- [ ] RLS policies enforced (test with direct Supabase queries if needed)
- [ ] Session timeout after inactivity (if configured)
- [ ] Logout removes auth token and clears session

**Responsive Design:**
- [ ] Mobile (<sm): Hamburger menu, stacked layout, full-width buttons
- [ ] Tablet (sm-md): Sidebar collapses to icons, toggle to expand
- [ ] Desktop (md+): Full sidebar visible, can collapse/expand
- [ ] Touch targets minimum 44px on mobile
- [ ] Forms legible on small screens
- [ ] Tables scroll horizontally on mobile without breaking

**Error Handling & Edge Cases:**
- [ ] Network errors show appropriate toast (retry available)
- [ ] RLS violations show "You don't have permission" message
- [ ] Deleted posts show "Not found" message
- [ ] Conflicts with multiple tabs: show "Updated elsewhere. Reload?" toast
- [ ] Failed image uploads: show error toast with retry
- [ ] Form validation errors: highlight invalid fields, show inline messages
- [ ] Empty states: show helpful messages (e.g., "No posts yet. Create one!")

**Accessibility:**
- [ ] Keyboard navigation: Tab through all form fields and buttons
- [ ] Focus indicators visible (not removed, Tailwind/CSS focused)
- [ ] Form labels associated with inputs (htmlFor)
- [ ] Error messages linked to inputs (aria-describedby)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Screen reader test: Navigate sidebar, read post title, understand form structure
- [ ] Modal focus trap: Cannot tab outside modal, Escape closes
- [ ] ARIA labels on buttons with icons (aria-label="Delete post")
- [ ] Semantic HTML: headings, nav, article, footer

**Code Quality:**
- [ ] `npm run lint` – No linting errors
- [ ] `npm run typecheck` – No TypeScript errors
- [ ] No console errors or warnings in DevTools
- [ ] No unused variables or imports
- [ ] Consistent code style (file naming, component patterns)

#### 8.2 Performance & Optimization

**Lighthouse Audit:**
- [ ] Run Lighthouse audit in DevTools (on `/admin` pages)
- [ ] Target: Accessibility 95+, Best Practices 90+
- [ ] Performance: < 3s First Contentful Paint

**Load Time Optimization:**
- [ ] Images lazy-loaded (next/image with loading="lazy")
- [ ] Unused CSS removed or tree-shaken
- [ ] Large components code-split (dynamic imports for optional sections)
- [ ] Supabase queries optimized (use .select() to fetch only needed fields)
- [ ] No unnecessary re-renders (useCallback, memoization where needed)

#### 8.3 Data Integrity & Backups

- [ ] Verify Supabase backups are configured (automatic daily backups)
- [ ] Test delete operations (soft delete or backup before hard delete for MVP?)
- [ ] Verify timestamps accurate (created_at, updated_at, published_at)
- [ ] Test concurrent edits behavior (last-write-wins is acceptable for MVP)

#### 8.4 Staging & Deployment

- [ ] Deploy to staging environment (optional, or test on localhost)
- [ ] Test all workflows on staging with real Supabase data
- [ ] Get sign-off from stakeholders (content team, management)
- [ ] Create deployment plan (gradual rollout or all-at-once?)
- [ ] Set up monitoring/error tracking (Sentry or Supabase logs)
- [ ] Deploy to production (Vercel):
  - [ ] Set environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY if needed)
  - [ ] Run `npm run build` locally to verify no errors
  - [ ] Push to main branch (or deploy button in Vercel)
  - [ ] Verify production deployment succeeded
  - [ ] Smoke test: Create draft post, publish, verify on live site

#### 8.5 Handoff & Documentation

- [ ] Document admin portal URL, login credentials (securely)
- [ ] Create user guide for content team:
  - How to create/edit posts
  - How to upload images
  - How to manage categories
  - How to publish and schedule posts
  - Troubleshooting common issues
- [ ] Create admin guide for technical support:
  - Common RLS issues and solutions
  - How to debug Supabase query failures
  - How to reset admin permissions
  - Backup and restore procedures

**Testing Checklist Summary:**
- [ ] Authentication (sign in, sign out, permissions)
- [ ] Dashboard (stats, activity feed, quick actions)
- [ ] Post CRUD (create, edit, publish, delete, all fields)
- [ ] Categories CRUD
- [ ] Search/filter (all fields, pagination)
- [ ] Image uploads (featured, editor, progress, errors)
- [ ] Auto-save (2s debounce, retry, conflict handling)
- [ ] Keyboard navigation (Tab, Enter, Escape, Ctrl+S)
- [ ] Mobile responsiveness (hamburger, stacked layout, touch targets)
- [ ] Error handling (network, RLS, validation, not found)
- [ ] Accessibility (color contrast, focus, ARIA, screen reader)
- [ ] Performance (Lighthouse, load time, no console errors)
- [ ] Code quality (lint, typecheck, no unused code)
- [ ] Production readiness (backups, monitoring, documentation)

---

## Part 9: Best Practices

### Content Guidelines

- **Blog posts:** Write clear, value-focused content for accounting/finance audience
- **HTML Editor:** Use the rich text editor to format content; it automatically generates clean, semantic HTML
- **Formatting:** Use proper heading hierarchy (H1, H2, H3), bold, italics, lists, and code blocks as needed
- **Excerpts:** Provide compelling preview text (2-3 sentences)
- **Categories:** Use predefined categories from SUPABASE_SETUP.md
- **Disclaimers:** Add appropriate disclaimer_type for compliance
- **Cover images:** Use professional, consistent visual style

### SEO Best Practices

- Use descriptive post titles
- Write slug as lowercase with hyphens
- Include relevant keywords naturally in content
- Use proper markdown heading hierarchy (#, ##, ###)
- Provide meaningful excerpts
- Publish consistently (at least bi-weekly for blog)

### Maintenance Schedule

- **Weekly:** Review new draft posts, moderate if needed
- **Monthly:** Audit analytics, plan content calendar
- **Quarterly:** Review and update categories if needed
- **Annually:** Comprehensive content audit, SEO review

---

## Part 10: Troubleshooting

### Common Issues

**Images not uploading:**
- Verify authentication with Supabase
- Check file size (max ~5MB)
- Ensure file format is supported (JPEG, PNG, WebP)
- Verify bucket name is `blog-images`
- Check storage policies (should allow authenticated upload)

**Changes not appearing on site:**
- Wait up to 30 seconds for cache invalidation
- Clear browser cache
- Verify post status is 'published'
- Check RLS policies (ensure user has read access)

**Cannot edit post:**
- Verify you are the author or an admin
- Check that post exists in posts table
- Verify authentication token is valid
- RLS enforces edit permissions per policies

**Slow admin interface:**
- Close unused browser tabs
- Clear browser cache
- Check internet connection
- Contact support if persistent

---

## Part 11: Support & Resources

### Admin Help

- Reference SUPABASE_SETUP.md for schema details
- Use Supabase dashboard SQL Editor for direct queries
- Check application logs for errors

### RLS Debugging

**Check all posts policies:**
```sql
select schemaname, tablename, policyname from pg_policies where tablename = 'posts';
```

**Check user is admin:**
```sql
select id, email, is_admin from profiles where email = 'user@email.com';
```

**Verify post visibility:**
```sql
select id, title, status, author_id from posts where slug = 'post-slug';
```

---

**Last Updated:** December 2025  
**Document Version:** 2.0  
**Schema Reference:** SUPABASE_SETUP.md (Phase 2: Database Schema)
