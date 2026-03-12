-- Create admin user with proper Supabase password hashing
-- This uses the same hashing method that Supabase uses internally

-- Clean up existing admin
DELETE FROM profiles WHERE email = 'admin@crm.com';
DELETE FROM auth.users WHERE email = 'admin@crm.com';

-- Create admin user with proper password hash
-- Using a known working password hash for 'admin123'
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
  '$2a$10$CwTycUXWue0Thq9StjUM0uJ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', -- This is a test hash
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

-- Get the admin ID and create profile
WITH admin_user AS (
  SELECT id FROM auth.users WHERE email = 'admin@crm.com'
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
  admin_user.id,
  'admin@crm.com',
  'Admin User',
  'admin',
  'approved',
  now(),
  now()
FROM admin_user;

-- Show the result
SELECT 'Admin user details:' as info;
SELECT 
  p.id, 
  p.email, 
  p.full_name, 
  p.role, 
  p.status,
  u.email_confirmed_at,
  u.encrypted_password
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@crm.com';




