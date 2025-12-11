-- ===================================================
-- SUPABASE RLS RECURSION FIX
-- ===================================================
-- 
-- This script fixes the infinite recursion issue with the is_admin() function
-- 
-- Problem: is_admin() function calls itself through RLS policies
-- Solution: Replace is_admin() calls with direct profile queries
--
-- Run this in Supabase SQL Editor
-- ===================================================

-- Step 1: Drop existing problematic policies
-- (These use is_admin() which causes recursion)
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can do everything on posts" ON posts;
DROP POLICY IF EXISTS "Admins can do everything on categories" ON categories;
DROP POLICY IF EXISTS "Admins can do everything on storage" ON storage.objects;

-- Step 2: Create fixed admin policies without is_admin() function
-- 
-- These use direct profile queries instead of calling is_admin()
-- This avoids the infinite recursion problem

-- Profiles: Admins can manage all profiles
CREATE POLICY "Admins can do everything on profiles" ON profiles
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Posts: Admins can manage all posts
CREATE POLICY "Admins can do everything on posts" ON posts
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Categories: Admins can manage all categories
CREATE POLICY "Admins can do everything on categories" ON categories
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Storage: Admins can manage all storage objects
CREATE POLICY "Admins can do everything on storage" ON storage.objects
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Step 3: (Optional) Remove the is_admin() function if not used elsewhere
-- DROP FUNCTION IF EXISTS is_admin();

-- ===================================================
-- VERIFICATION
-- ===================================================
--
-- After running this script:
--
-- 1. Test via CLI:
--    node scripts/insert-test-post.js
--
-- 2. If successful, test via dashboard:
--    npm run dev
--    Visit http://localhost:3000/admin
--
-- 3. If still failing:
--    - Check that admin user exists and is_admin = true
--    - Verify you're logged in as the admin user
--    - Check auth.uid() returns a valid UUID
--
-- ===================================================
