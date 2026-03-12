-- Create a test user account that bypasses email verification
-- This user can be used for testing the CRM functionality

-- Insert test user directly into auth.users (bypassing Supabase Auth signup)
-- Note: This is for testing purposes only
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'demo@crm.com',
  '$2a$10$8K1p/a0dhrxSHxN7.NhAuOUiTtdjHELP25qcpSzkhiFXUiVws/HSC', -- password: demo123
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo User"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
);

-- Fixed profile structure to match actual database schema
-- Create corresponding profile for the test user
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  team_id,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@crm.com',
  'Demo User',
  'sales_rep',
  '550e8400-e29b-41d4-a716-446655440001',
  null,
  NOW(),
  NOW()
);
