-- Create a simple test user that will work with Supabase Auth
-- This approach uses Supabase's built-in user creation

-- First, let's clean up any existing test users
DELETE FROM profiles WHERE email = 'testuser@crm.com';
DELETE FROM profiles WHERE email = 'simple@test.com';

-- Create a simple test user profile (this will be created when they sign up)
-- We'll use a different email to avoid conflicts
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'simple@test.com',
  'Simple Test User',
  'sales_rep',
  'approved',
  now(),
  now()
);

-- Show what we created
SELECT id, email, full_name, role, status, created_at
FROM profiles 
WHERE email = 'simple@test.com';




