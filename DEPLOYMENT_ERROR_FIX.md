# Vercel Deployment Error Root Cause & Fix

## Error Summary
```
Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

Build failed on `/admin/categories` page during Vercel deployment.

## Root Cause

### Primary Issue: Module-Level Client Instantiation
File: `src/lib/admin/supabase.ts` lines 12-15

```typescript
// BEFORE (problematic)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Why this fails in Vercel:**

1. **Build-Time Execution**: The module is loaded at **Next.js build time** when Supabase is first imported (via `src/lib/admin/categories.ts` → `src/lib/admin/supabase.ts`)
2. **Missing Environment Variables**: Vercel's build environment may not have `NEXT_PUBLIC_SUPABASE_URL` populated at the module import stage, resulting in:
   - `supabaseUrl = undefined`
   - Calling `createClient(undefined, key)` → validation error
3. **Non-Null Assertion Fails Silently**: The `!` (non-null assertion) doesn't prevent undefined values from being passed to `createClient`

### Secondary Issue: Admin Pages Are Client Components
- Admin pages use `'use client'` directive
- They import from `src/lib/admin/supabase.ts` which instantiates the client synchronously
- Server-side Supabase client should use `src/lib/supabase/server.ts` instead (already correctly implemented with lazy initialization)

## Solution

### Fixed Implementation
Implemented **lazy initialization with Proxy pattern**:

```typescript
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    return getSupabaseClient()[prop as keyof typeof supabaseClient];
  },
});
```

**How this fixes the issue:**

1. **Lazy Initialization**: Client is only created when first accessed (runtime), not at module load (build time)
2. **Runtime Environment Access**: Environment variables are available and populated by the time the client is actually used
3. **Better Error Messages**: Throws a descriptive error if env vars are missing instead of silent failures
4. **Backwards Compatible**: Proxy maintains same API surface as original `createClient` export

## Deployment Verification Checklist

### In Vercel Dashboard:
1. ✅ Navigate to Project Settings → Environment Variables
2. ✅ Verify both variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://nnnfcbmzygubyhufxwln.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_ZSCnt2zPLhDxAHVTLgglSg_YfstBeLN`
3. ✅ Ensure variables are available to "All" environments (Production + Preview)
4. ✅ Redeploy after environment variable changes

### Local Testing:
```bash
# Verify .env.local has correct values
cat .env.local

# Clean build and test
rm -rf .next
npm run build

# Test local server
npm run dev
```

## Files Changed
- `/src/lib/admin/supabase.ts` - Implemented lazy initialization pattern

## Related Files (Using This Client)
- `/src/lib/admin/categories.ts` - Category operations
- `/src/lib/admin/posts.ts` - Post operations
- `/src/lib/admin/auth.ts` - Auth operations
- `/src/app/admin/page.tsx` - Admin dashboard
- `/src/app/admin/categories/page.tsx` - Categories page (failed during build)
- `/src/app/admin/posts/page.tsx` - Posts page
- All other admin pages

## Similar Patterns to Avoid
Do NOT use this pattern elsewhere:
```typescript
// ❌ BAD: Module-level instantiation
const client = createClient(process.env.NEXT_PUBLIC_URL!, process.env.KEY!);
export { client };
```

Use this pattern instead:
```typescript
// ✅ GOOD: Lazy initialization
function getClient() {
  // ... check env vars ...
  return createClient(url, key);
}
```

## Next Steps
1. Commit this fix: `git commit -m "Fix: Lazy-initialize Supabase client to prevent build-time instantiation errors"`
2. Push and trigger redeploy in Vercel
3. Monitor build logs for completion
4. Test admin pages after deployment
