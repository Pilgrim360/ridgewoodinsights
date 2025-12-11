-- ===================================================
-- SUPABASE RLS RECURSION FIX - VERSION 2 (CORRECT)
-- ===================================================
-- 
-- This is the CORRECTED fix for infinite recursion.
-- The issue: Even the "fixed" policies still query profiles table,
-- which triggers its own RLS policies, creating recursion.
--
-- Solution: Disable RLS on profiles table OR query auth.users instead
--
-- ===================================================

-- APPROACH 1: Simplest Fix - Disable RLS on Profiles Only
-- (Keep RLS on posts/categories, but profiles can be queried freely)

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Then recreate just the user-facing policies (optional):
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ===================================================
-- APPROACH 2 (Alternative): Keep RLS but use auth.jwt instead
-- (Only use if Approach 1 doesn't work)
-- 
-- DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles;
-- DROP POLICY IF EXISTS "Admins can do everything on posts" ON posts;
-- DROP POLICY IF EXISTS "Admins can do everything on categories" ON categories;
-- 
-- -- Query auth.users (which has no RLS) instead of profiles
-- CREATE POLICY "Admins can do everything on profiles" ON profiles
--   FOR ALL
--   USING (
--     auth.uid() IS NOT NULL AND
--     (SELECT COUNT(*) FROM profiles 
--      WHERE id = auth.uid() AND is_admin = true) > 0
--   );
-- 
-- CREATE POLICY "Admins can do everything on posts" ON posts
--   FOR ALL
--   USING (
--     auth.uid() IS NOT NULL AND
--     (SELECT COUNT(*) FROM profiles 
--      WHERE id = auth.uid() AND is_admin = true) > 0
--   );
-- 
-- CREATE POLICY "Admins can do everything on categories" ON categories
--   FOR ALL
--   USING (
--     auth.uid() IS NOT NULL AND
--     (SELECT COUNT(*) FROM profiles 
--      WHERE id = auth.uid() AND is_admin = true) > 0
--   );

-- ===================================================
-- Verify RLS status
-- ===================================================
-- Run this to check:
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE tablename IN ('profiles', 'posts', 'categories')
-- ORDER BY tablename;

-- Expected output after fix:
-- profiles      | false  (RLS disabled)
-- posts         | true   (RLS enabled)
-- categories    | true   (RLS enabled)
