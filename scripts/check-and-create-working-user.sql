-- Check what users exist and create a working test user
-- This will create a user that can actually log in

-- First, let's see what users we have
SELECT 'All profiles:' as info;
SELECT id, email, full_name, role, status, created_at
FROM profiles 
ORDER BY created_at DESC;

-- Check if there are any users in auth.users
SELECT 'Auth users:' as info;
SELECT id, email, email_confirmed_at, created_at
FROM auth.users 
ORDER BY created_at DESC;

-- Let's create a simple working test user
-- First, delete any existing test users to avoid conflicts
DELETE FROM profiles WHERE email = 'working@test.com';
DELETE FROM auth.users WHERE email = 'working@test.com';

-- Create a user in auth.users (this is what Supabase Auth needs)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'working@test.com',
  crypt('test123', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Working Test User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Get the user ID we just created
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'working@test.com'
)
-- Create the profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  status,
  created_at,
  updated_at
)
SELECT 
  new_user.id,
  'working@test.com',
  'Working Test User',
  'sales_rep',
  'approved',
  now(),
  now()
FROM new_user;

-- Verify everything was created correctly
SELECT 'Final verification:' as info;
SELECT 
  p.id, 
  p.email, 
  p.full_name, 
  p.role, 
  p.status, 
  p.approved_at,
  u.email_confirmed_at
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'working@test.com';




