-- Create a fresh test user with a known working password hash
-- This will help us test if the authentication system is working

-- First, let's delete the existing test users to start fresh
DELETE FROM profiles WHERE email IN ('admin@crm.com', 'sales@crm.com');
DELETE FROM auth.users WHERE email IN ('admin@crm.com', 'sales@crm.com');

-- Create a fresh admin user with a simple password hash
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  'c3ggdd99-9c0b-4ef8-bb6d-6bb9bd380a33',
  '00000000-0000-0000-0000-000000000000',
  'test@crm.com',
  '$2a$10$8K1p/a0dhrxSHxN7.NhAuOUiTtdjHELP25qcpSzkhiFXUiVws/HSC', -- password: test123
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test User"}'
);

-- Create the corresponding profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  status,
  approved_at,
  created_at,
  updated_at
) VALUES (
  'c3ggdd99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'test@crm.com',
  'Test User',
  'admin',
  'approved',
  now(),
  now(),
  now()
);

-- Verify the user was created
SELECT 
  u.id, 
  u.email, 
  u.email_confirmed_at,
  p.full_name,
  p.role,
  p.status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'test@crm.com';




