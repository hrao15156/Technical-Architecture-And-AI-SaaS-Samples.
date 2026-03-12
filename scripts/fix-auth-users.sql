-- Fix auth.users table to match the existing profile
-- This will create the user in auth.users with the correct password hash

-- First, let's check if the user exists in auth.users
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@crm.com';

-- If the above query returns no results, run this INSERT:
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
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '00000000-0000-0000-0000-000000000000',
  'admin@crm.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User"}'
);

-- Also create the sales user
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
);

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

