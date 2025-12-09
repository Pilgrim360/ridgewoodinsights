# Admin Routes & Auth Scaffolding

**Status:** ✓ Complete  
**Date:** December 9, 2025

## Overview

Route structure and authentication middleware for the Admin CMS, enabling protected access to admin-only pages. All routes are scaffolded; content is added in subsequent steps.

## Route Structure

```
src/app/(admin)/
├── layout.tsx                    # Two-panel wrapper (sidebar + content)
├── page.tsx                      # Dashboard → Step 3
├── login/page.tsx                # Login page (public)
├── posts/
│   ├── page.tsx                  # Posts list → Step 4
│   ├── new/page.tsx              # Create post → Step 5
│   └── [id]/page.tsx             # Edit post → Step 5
├── categories/page.tsx           # Categories mgmt → Step 6
└── settings/page.tsx             # Site settings → Step 7
```

## Key Files

### 1. Middleware (`src/middleware.ts`) ✓ NEW

Protects all `/admin/*` routes except `/admin/login`:

**Logic:**
1. Checks if user is authenticated (Supabase session)
2. Verifies user is admin (checks `profiles.is_admin`)
3. Redirects unauthenticated users to `/admin/login`
4. Redirects non-admin users to home page

**Coverage:** All `/admin/*` routes (except login)

### 2. Admin Layout (`src/app/(admin)/layout.tsx`) ✓ NEW

Wraps all admin pages with:

- **`<AdminAuthProvider>`** — Manages admin user state (from Step 1)
- **`<AdminErrorProvider>`** — Global error/success toasts (from Step 1)
- **Structure:** Two-panel layout (`flex-1` for sidebar space in Step 2)
- **Placeholders:** Sidebar and header components will be added in Step 2

### 3. Login Page (`src/app/(admin)/login/page.tsx`) ✓ NEW

Public login page with:

- Email and password inputs
- Supabase authentication
- Admin status verification (prevents non-admin login)
- Redirect to `/admin` on success
- Error messages for failed login

**Notes:**
- Not wrapped in admin layout (no auth requirement)
- Uses client component (`'use client'`)
- Uses `getSupabaseClient()` from Step 1

### 4. Empty Admin Pages ✓ NEW

Scaffolded pages with placeholders:

- Dashboard (`/admin`)
- Posts list (`/admin/posts`)
- Create post (`/admin/posts/new`)
- Edit post (`/admin/posts/[id]`)
- Categories (`/admin/categories`)
- Settings (`/admin/settings`)

**Each contains:** Title + "Coming soon" message for Step reference

## Auth Flow

```
User visits /admin
        ↓
Middleware checks session
        ↓
No session? → Redirect to /admin/login
        ↓
Session exists? Check is_admin
        ↓
is_admin = false? → Redirect to home page
        ↓
is_admin = true? → Allow access to route
```

## Login Flow

```
User submits email + password on /admin/login
        ↓
Supabase authenticates (or rejects)
        ↓
If authenticated, verify user.is_admin
        ↓
is_admin = false? → Show error, stay on login
        ↓
is_admin = true? → Redirect to /admin (dashboard)
```

## Testing Routes

1. **Unauthenticated access:**
   ```
   Visit http://localhost:3000/admin/posts
   → Should redirect to http://localhost:3000/admin/login
   ```

2. **Login flow:**
   - Visit `/admin/login`
   - Enter admin email + password (from SUPABASE_SETUP.md)
   - Should redirect to `/admin` dashboard

3. **Non-admin user rejection:**
   - If you have a non-admin test user, login as that user
   - Should be redirected to home page

4. **All routes resolve:**
   - Sidebar in Step 2 will link to these routes
   - All links should work without 404s

## Dependencies

- **Step 1:** `AdminAuthProvider`, `AdminErrorProvider`, `useAdminAuth`, `getSupabaseClient`
- **Middleware:** Supabase auth + database (RLS policies)

## Environment Check

Ensure `.env.local` has:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ADMIN_EMAIL=...
```

And Supabase setup is complete (tables, RLS, auth user created).

## Next Steps

**Step 2:** Sidebar Navigation
- Create `Sidebar.tsx`, `SidebarLink.tsx`, etc.
- Add sidebar to admin layout
- Implement collapse/mobile states
- Use `useSidebarState` hook from Step 1

## Notes

- Login page is intentionally simple (MVP)
- No "forgot password" or "sign up" flows (admin-only setup via Supabase)
- Admin layout ready for Step 2 sidebar + header components
- Empty pages have placeholder text showing which step adds them
