-- Create a completely fresh admin user
-- This will delete and recreate everything to ensure it works

-- Clean up any existing admin users
DELETE FROM profiles WHERE email = 'admin@crm.com';
DELETE FROM auth.users WHERE email = 'admin@crm.com';

-- Create a fresh admin user with a simple approach
-- First, create in auth.users
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
  'admin-user-id-12345', -- Fixed ID for easier debugging
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@crm.com',
  '$2a$10$rQZ8K8K8K8K8K8K8K8K8K.8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', -- Simple test hash
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

-- Create the profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  'admin-user-id-12345',
  'admin@crm.com',
  'Admin User',
  'admin',
  'approved',
  now(),
  now()
);

-- Verify the user was created
SELECT 'Fresh admin created:' as info;
SELECT 
  p.id, 
  p.email, 
  p.full_name, 
  p.role, 
  p.status,
  u.email_confirmed_at
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@crm.com';




