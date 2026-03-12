-- Comprehensive fix for testuser@crm.com authentication
-- This script ensures the user exists in both auth.users and profiles with correct setup

-- First, let's see what we have
SELECT 'Current profiles status:' as info;
SELECT id, email, full_name, role, status, approved_at, created_at
FROM profiles 
WHERE email = 'testuser@crm.com';

SELECT 'Current auth.users status:' as info;
SELECT id, email, email_confirmed_at, created_at
FROM auth.users 
WHERE email = 'testuser@crm.com';

-- If the user doesn't exist in auth.users, we need to create them there first
-- This is the root cause - Supabase Auth needs the user in auth.users table
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
  '8a50a07b-ed97-43b0-bb6a-f560d05c54cc', -- Use the same ID from profiles
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'testuser@crm.com',
  crypt('test123', gen_salt('bf')), -- Use a simple password for testing
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User first"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  updated_at = now();

-- Ensure the profile is properly set up
UPDATE profiles 
SET 
  status = 'approved',
  approved_at = now(),
  approved_by = (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
WHERE email = 'testuser@crm.com';

-- Verify everything is set up correctly
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
WHERE p.email = 'testuser@crm.com';




