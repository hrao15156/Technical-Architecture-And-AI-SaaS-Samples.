-- SECURE RLS FIX: Proper Row Level Security Policies for AI CRM
-- This maintains security while fixing the infinite recursion issue
-- Run this ENTIRE script in your Supabase SQL Editor

-- Step 1: Drop ALL existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update any" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can update profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can select profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

-- Step 2: Ensure RLS is enabled (security first!)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simple, secure, non-recursive policies

-- Policy 1: Users can view their own profile (simple auth.uid() check)
CREATE POLICY "profiles_select_own" ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (simple auth.uid() check)
CREATE POLICY "profiles_update_own" ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Policy 3: Allow service role to manage profiles (for admin operations)
CREATE POLICY "profiles_service_role_all" ON profiles 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Step 4: Ensure admin profile exists and is properly configured
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@crm.com',
  'Admin User',
  'admin',
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  status = 'approved',
  role = 'admin',
  updated_at = NOW();

-- Step 5: Verify the policies work
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Step 6: Test that we can select the profile
SELECT COUNT(*) as profile_count FROM profiles WHERE email = 'admin@crm.com';

-- IMPORTANT NOTES:
-- 1. RLS remains ENABLED for security
-- 2. Policies are simple and non-recursive
-- 3. Users can only access their own profiles
-- 4. Service role has full access for admin operations
-- 5. No infinite recursion possible with these policies

