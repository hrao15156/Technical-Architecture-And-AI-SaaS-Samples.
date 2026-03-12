-- Simple user creation script that works with existing database
-- This creates admin and sales users without complex conflict handling

-- First, let's check what tables exist and create users step by step

-- Create admin user in auth.users
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
  recovery_token
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
  ''
);

-- Create sales user in auth.users
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
  recovery_token
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
  ''
);

-- Create admin profile
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
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@crm.com',
  'Admin User',
  'admin',
  'approved',
  now(),
  now(),
  now()
);

-- Create sales profile
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
);

-- Create a default team if it doesn't exist
INSERT INTO teams (id, name, description, created_at, updated_at)
VALUES (
  'c2ggdd99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'Default Team',
  'Default team for CRM users',
  now(),
  now()
);

-- Update profiles with team_id
UPDATE profiles 
SET team_id = 'c2ggdd99-9c0b-4ef8-bb6d-6bb9bd380a33'
WHERE id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1ffcc99-9c0b-4ef8-bb6d-6bb9bd380a22');

