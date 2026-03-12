-- Fix RLS policies that might be causing the database error
-- This will ensure the authentication system can work properly

-- First, let's check what RLS policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'auth.users');

-- Drop and recreate RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update any" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation during signup" ON profiles;

-- Create simpler, more permissive RLS policies for testing
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Also check if there are any issues with the auth.users table policies
-- (These are usually managed by Supabase, but let's make sure)
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'auth';

-- Test if we can query the profiles table directly
SELECT id, email, full_name, role, status 
FROM profiles 
WHERE email = 'test@crm.com';

-- Test if we can query auth.users table
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'test@crm.com';




