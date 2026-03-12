-- COMPREHENSIVE FIX for Row Level Security policies
-- This will completely reset and fix the RLS policies for the profiles table
-- Run this ENTIRE script in your Supabase SQL Editor

-- Step 1: Disable RLS temporarily to fix the policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update any" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can update profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can select profiles" ON profiles;

-- Step 3: Ensure the admin profile exists and is properly configured
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

-- Step 4: Create simple, non-recursive RLS policies
-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create basic policies that don't cause recursion
CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (
  auth.uid() = id OR 
  auth.role() = 'service_role'
);

CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE USING (
  auth.uid() = id OR 
  auth.role() = 'service_role'
);

CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (
  auth.role() = 'service_role'
);

-- Step 5: Verify the profile exists and can be accessed
SELECT 
  id,
  email,
  full_name,
  role,
  status,
  created_at
FROM profiles 
WHERE email = 'admin@crm.com';

-- Step 6: Test that the policy works by checking if we can select the profile
-- This should return the admin profile without errors
SELECT COUNT(*) as profile_count FROM profiles WHERE email = 'admin@crm.com';

