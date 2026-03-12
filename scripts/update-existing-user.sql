-- Update existing user in auth.users with correct password and status
-- This will fix the existing user instead of creating a new one

-- First, let's see what's in the auth.users table
SELECT id, email, email_confirmed_at, encrypted_password, created_at 
FROM auth.users 
WHERE email = 'admin@crm.com';

-- Update the existing admin user with correct password and confirmed email
UPDATE auth.users 
SET 
  encrypted_password = crypt('admin123', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now(),
  raw_app_meta_data = '{"provider": "email", "providers": ["email"]}',
  raw_user_meta_data = '{"full_name": "Admin User"}'
WHERE email = 'admin@crm.com';

-- Check if sales user exists, if not create it
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
) 
SELECT 
  'b1ffcc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  '00000000-0000-0000-0000-000000000000',
  'sales@crm.com',
  crypt('sales123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sales Representative"}'
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sales@crm.com');

-- Create sales profile if it doesn't exist
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
  'b1ffcc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'sales@crm.com',
  'Sales Representative',
  'sales_agent',
  'approved',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Verify the users exist and are properly configured
SELECT 
  u.id, 
  u.email, 
  u.email_confirmed_at,
  p.full_name,
  p.role,
  p.status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin@crm.com', 'sales@crm.com');

