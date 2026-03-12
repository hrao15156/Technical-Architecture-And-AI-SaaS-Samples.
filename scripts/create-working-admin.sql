-- Create a working admin user that can actually log in
-- This will create the admin in both auth.users and profiles tables

-- First, let's clean up any existing admin users
DELETE FROM profiles WHERE email = 'admin@crm.com';
DELETE FROM auth.users WHERE email = 'admin@crm.com';

-- Create the admin user in auth.users (required for Supabase Auth)
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
  'admin@crm.com',
  crypt('admin123', gen_salt('bf')), -- Simple password for testing
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Get the admin user ID we just created
WITH admin_user AS (
  SELECT id FROM auth.users WHERE email = 'admin@crm.com'
)
-- Create the admin profile
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
  admin_user.id,
  'admin@crm.com',
  'Admin User',
  'admin',
  'approved',
  now(),
  now()
FROM admin_user;

-- Verify the admin user was created correctly
SELECT 'Admin user created:' as info;
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
WHERE p.email = 'admin@crm.com';

-- Also create a simple test user for the admin to approve
DELETE FROM profiles WHERE email = 'test@example.com';
DELETE FROM auth.users WHERE email = 'test@example.com';

-- Create test user in auth.users
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
  'test@example.com',
  crypt('test123', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Get the test user ID and create profile
WITH test_user AS (
  SELECT id FROM auth.users WHERE email = 'test@example.com'
)
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
  test_user.id,
  'test@example.com',
  'Test User',
  'sales_rep',
  'pending', -- This user needs admin approval
  now(),
  now()
FROM test_user;

-- Show all users
SELECT 'All users:' as info;
SELECT 
  p.id, 
  p.email, 
  p.full_name, 
  p.role, 
  p.status,
  CASE WHEN u.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_auth_user
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;




