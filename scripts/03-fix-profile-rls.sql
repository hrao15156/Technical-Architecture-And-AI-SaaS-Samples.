-- Fix RLS policies for profile creation during signup

-- Add INSERT policy for profiles to allow creation during signup
CREATE POLICY "Allow profile creation during signup" ON profiles FOR INSERT WITH CHECK (
  auth.uid() = id
);

-- Update the existing policies to be more explicit
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (
  auth.uid() = id
);

CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (
  auth.uid() = id
);
