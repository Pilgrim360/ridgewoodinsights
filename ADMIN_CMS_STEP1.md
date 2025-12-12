# Admin CMS: Step 1 - Foundation & Setup

**Status:** ✓ Complete  
**Date:** December 9, 2025

## Overview

Step 1 establishes the foundational infrastructure for the Admin CMS. This includes types, authentication, error handling, validation, and Supabase client setup. All subsequent steps depend on this foundation.

## Deliverables

### 1. Type System (`src/types/admin.d.ts`)

Comprehensive TypeScript interfaces for all admin data structures:

- **Post-related:** `PostData`, `PostFormState`, `PostWithAuthor`
- **Category-related:** `CategoryData`, `CategoryWithPostCount`
- **Dashboard:** `DashboardStats`, `RecentActivity`
- **Context/Auth:** `AdminUser`, `AdminContextType`, `AdminErrorContextType`
- **Filters:** `PostFilters`, `PaginationMeta`, `PaginatedResult<T>`
- **Uploads:** `UploadProgress`, `ImageUploadResult`
- **Sidebar:** `SidebarState`, `NavItem`
- **Modals:** `ConfirmDialogProps`
- **Settings:** `SiteSettings`
- **Errors:** `AdminError`, `AdminErrorType`

**Status:** ✓ Complete

### 2. Supabase Client Setup

#### Server-side client (`src/lib/supabase/server.ts`)
- Uses `@supabase/ssr` for cookie management
- Handles auth session persistence
- Compatible with Next.js 15 async cookies

**Status:** ✓ Already exists

#### Client-side client (`src/lib/supabase/client.ts`) ✓ NEW
- Singleton browser client instance
- Direct access to Supabase from client components
- `getSupabaseClient()` function

### 3. Authentication (`src/lib/admin/auth.ts`) ✓ NEW

Server-side auth utilities:

- `getCurrentAdminUser()` — Fetch current authenticated admin user with admin verification
- `getCurrentUser()` — Fetch current authenticated user (any user)
- `requireAdminUser()` — Enforce admin-only access (throws on non-admin)

**Use in:** Server components, server actions, API routes.

### 4. Error Handling (`src/lib/admin/error-handler.ts`) ✓ NEW

**AdminErrorHandler class** with static methods:

- `parse(error)` — Convert Supabase/app errors to `AdminError` objects
- `getMessage(error)` — Extract user-friendly message
- `isRetryable(error)` — Determine if error can be retried
- `log(error)` — Log error for debugging

**Handles:**
- RLS violations (403 → "permission denied")
- Network errors (retryable)
- Validation errors
- Duplicate conflicts
- Not found (404)
- Server errors (5xx)

**Usage:**
```typescript
try {
  // Supabase operation
} catch (error) {
  const parsedError = AdminErrorHandler.parse(error);
  console.error(parsedError.message); // User-friendly message
  if (AdminErrorHandler.isRetryable(parsedError)) {
    // Offer retry
  }
}
```

### 5. Form Validation (`src/lib/admin/validators.ts`) ✓ NEW

Zod schemas for all admin forms:

- `PostFormSchema` — Post title, slug, content, metadata validation
- `CategoryFormSchema` — Category name and slug validation
- `SettingsFormSchema` — Site settings (title, tagline, email)
- `validateImageUpload()` — File type and size validation (5MB max, JPEG/PNG/WebP/GIF)
- `generateSlug()` — Auto-generate URL-safe slugs from titles

**Usage:**
```typescript
import { PostFormSchema } from '@/lib/admin/validators';

const result = PostFormSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
  const errors = result.error.flatten().fieldErrors;
}
```

### 6. Image Storage (`src/lib/admin/storage.ts`) ✓ NEW

Handle image uploads to Supabase Storage:

- `uploadImage(file, userId, onProgress)` — Upload to `blog-images/userId/fileName`
- `deleteImage(storagePath)` — Remove image from storage
- `getImageUrl(storagePath)` — Get public URL for image

**Bucket:** `blog-images` (public)  
**Organization:** Files stored as `/userId/fileName` for user isolation

### 7. Auth Context (`src/contexts/AdminAuthContext.tsx`) ✓ NEW

Client-side auth provider:

- Syncs with Supabase auth state
- Provides `useAdminAuth()` hook
- Auto-checks admin status on mount
- Handles logout

**Usage:**
```typescript
'use client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export function DashboardHeader() {
  const { user, isLoading, logout } = useAdminAuth();
  
  if (isLoading) return <Loading />;
  if (!user) return <Redirect to="/admin/login" />;
  
  return <header>Welcome, {user.email}</header>;
}
```

### 8. Error Context (`src/contexts/AdminErrorContext.tsx`)

Global toast notifications (error/success):

- `useAdminError()` hook
- Auto-dismiss after 5 seconds
- Fixed toast display

**Already exists** ✓

### 9. Mutation Hook (`src/hooks/useAdminMutation.ts`) ✓ NEW

Encapsulate async operations with loading/error states:

```typescript
const { mutate, isLoading, error, reset } = useAdminMutation(
  async () => {
    return await createPost(formData);
  },
  {
    autoShowError: true,
    autoShowSuccess: true,
    successMessage: 'Post created!',
    onSuccess: () => {
      // Refresh data
    }
  }
);

await mutate(); // Execute
```

Automatically integrates with `AdminErrorContext` for toasts.

### 10. Admin Utilities Export (`src/lib/admin/index.ts`) ✓ NEW

Barrel export for easy imports:

```typescript
import {
  getCurrentAdminUser,
  AdminErrorHandler,
  uploadImage,
  PostFormSchema,
  generateSlug,
} from '@/lib/admin';
```

## Architecture Decisions

### Types First
All types defined upfront to guide development and enable TypeScript strict mode.

### Error Standardization
All errors parsed through `AdminErrorHandler` for consistent user-facing messages and retry logic.

### Validation Centralization
Zod schemas define both client and server validation rules in one place, reducing duplication.

### Separation of Concerns
- **Server utilities** (`auth.ts`, `server.ts`) — Only for server components/actions
- **Client utilities** (`client.ts`, `storage.ts`) — For browser operations
- **Shared utilities** (`validators.ts`, `error-handler.ts`) — Used everywhere

### Auth Flow
1. User logs in via Supabase (outside this step)
2. `AdminAuthProvider` syncs session and verifies admin status
3. Protected routes/components use `useAdminAuth()` hook
4. Server actions use `requireAdminUser()` for enforcement

## Dependency Map

```
types/admin.d.ts (root)
  ↓
contexts/
  ├─ AdminErrorContext (depends on types)
  └─ AdminAuthContext (depends on types, client.ts)
      ↓
lib/admin/
  ├─ auth.ts (depends on types, server.ts)
  ├─ error-handler.ts (depends on types)
  ├─ validators.ts (depends on types)
  ├─ storage.ts (depends on types, client.ts, validators, error-handler)
  └─ index.ts (exports all)
      ↓
hooks/
  └─ useAdminMutation.ts (depends on types, error-handler, AdminErrorContext)
```

## Testing Checklist

Run this to verify Step 1 setup:

```bash
npm run typecheck
npm run lint
```

Both should pass with no errors.

### Manual Testing (Optional)

1. **Auth context initialization:**
   - Wrap a component in `<AdminAuthProvider>`
   - Call `useAdminAuth()` in component
   - Should show loading → user (if logged in) or null

2. **Error handling:**
   - Trigger a test mutation with a known error
   - Should parse and display user-friendly toast message

3. **Validation:**
   ```typescript
   import { PostFormSchema } from '@/lib/admin/validators';
   
   const invalid = PostFormSchema.safeParse({ title: '', slug: 'test' });
   console.log(invalid.error?.flatten());
   ```

## Environment Requirements

Ensure `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ADMIN_EMAIL=...
```

Supabase setup must be complete (database, RLS, storage bucket).

## Next Steps

→ **Step 2:** Sidebar Navigation  
Focus: Desktop/mobile responsive navigation with state management

## Notes

- All code is TypeScript with strict mode enabled
- Components use React 19+ syntax
- Tailwind CSS for styling (not added in this step)
- No external state management (React Context only)
- Error messages are user-friendly (no stack traces to users)
