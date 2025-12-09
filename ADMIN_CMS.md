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

## Part 8: Step-by-Step Development Implementation

### Step 1: Foundation & Setup (2-3 hours)

**Objectives:** Set up routing structure and authentication guards

- [ ] Create `/admin` route group in Next.js App Router
- [ ] Build admin layout wrapper (`admin/layout.tsx`) with Navbar/Footer
- [ ] Create authentication middleware to verify `is_admin` flag
- [ ] Implement sign-out functionality
- [ ] Set up error boundary for admin routes
- [ ] Verify Supabase auth integration

**Files to Create:**
- `src/app/(admin)/layout.tsx`
- `src/app/(admin)/page.tsx` (dashboard stub)
- `src/middleware.ts` (updated for admin routes)

**Testing:**
- Verify non-admins cannot access `/admin`
- Test authentication flow
- Confirm session persists across page reloads

---

### Step 2: Sidebar Navigation Component (1-2 hours)

**Objectives:** Build the left navigation with collapsible state

- [ ] Create `Sidebar.tsx` component with icon buttons
- [ ] Implement expand/collapse toggle with localStorage persistence
- [ ] Style active route highlighting
- [ ] Add hover tooltips for collapsed state
- [ ] Create footer section with user info and logout button
- [ ] Ensure responsive behavior (hamburger on mobile)

**Files to Create:**
- `src/components/admin/Sidebar.tsx`
- `src/components/admin/SidebarLink.tsx`
- `src/components/admin/SidebarFooter.tsx`
- `src/hooks/useSidebarState.ts` (for localStorage sync)

**Styling:** Use design tokens from Ridgewood Palette (primary for active, secondary for headings)

**Testing:**
- Verify collapse/expand persists across navigation
- Test active link highlighting
- Check responsive hamburger menu on mobile

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

### Step 5: Post Editor Page (3-4 hours)

**Objectives:** Build the complex editor with rich text editing and HTML output

- [ ] Create `admin/posts/[id]/page.tsx` and `admin/posts/new/page.tsx`
- [ ] Build Top Action Bar (sticky):
  - Title input
  - Save Draft button
  - Publish button (admin only)
  - Status indicator
  - Last saved timestamp
- [ ] Build Main Editor Area:
  - Rich text editor (WYSIWYG) with formatting toolbar
  - Formatting controls (bold, italic, heading levels, lists, links, code blocks)
  - Word count display
  - Auto-save status indicator
- [ ] Build Sidebar (Post Metadata):
  - Category dropdown
  - Featured image upload
  - Publication date picker
  - Status selector
  - Disclaimer type selector
  - Excerpt editor
  - SEO slug editor
  - Author display
  - Created/Updated timestamps
- [ ] Implement auto-save (debounced, every 30 seconds)
- [ ] Add unsaved changes warning
- [ ] Implement keyboard shortcuts (Ctrl+S to save, etc.)
- [ ] Handle image uploads to Supabase Storage

**Files to Create:**
- `src/app/(admin)/posts/[id]/page.tsx`
- `src/app/(admin)/posts/new/page.tsx`
- `src/components/admin/PostEditor/Editor.tsx`
- `src/components/admin/PostEditor/EditorTopBar.tsx`
- `src/components/admin/PostEditor/EditorSidebar.tsx`
- `src/components/admin/PostEditor/QuillEditor.tsx`
- `src/components/admin/PostEditor/ImageUpload.tsx`
- `src/hooks/usePostEditor.ts` (state + auto-save logic)
- `src/lib/admin/html.ts` (HTML utilities)

**Dependencies to Add:**
- `react-quill` (rich text editor with HTML output)

**Database Queries:**
- Fetch post by ID
- Save/update post
- Fetch categories for dropdown
- Image upload to Supabase Storage

**Testing:**
- Test rich text editor formatting (bold, italic, headings, lists, etc.)
- Verify auto-save functionality
- Test unsaved changes warning
- Confirm image uploads work
- Check draft/publish status changes
- Verify HTML output is clean and semantic
- Test link insertion and editing

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

### Step 8: Testing & Deployment (2-3 hours)

**Objectives:** Verify functionality and prepare for production

- [ ] Test complete workflow:
  - Create post
  - Edit post
  - Publish post
  - Delete post
  - Manage categories
- [ ] Test permissions (non-admin access denied)
- [ ] Test responsive design on mobile/tablet
- [ ] Run `npm run lint` and `npm run typecheck`
- [ ] Test image uploads to Supabase
- [ ] Verify RLS policies work correctly
- [ ] Test authentication flow and logout
- [ ] Manual QA on staging environment
- [ ] Deploy to production (Vercel)

**Testing Checklist:**
- [ ] Admin authentication flow
- [ ] Dashboard stats accuracy
- [ ] Post CRUD operations
- [ ] Search/filter functionality
- [ ] Markdown preview
- [ ] Image uploads
- [ ] Status changes (draft → published)
- [ ] Category management
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Auto-save functionality

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
