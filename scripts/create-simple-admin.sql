-- Create a simple admin user with a known working password hash
-- This uses a pre-computed hash for 'admin123'

-- Clean up existing admin
DELETE FROM profiles WHERE email = 'admin@crm.com';
DELETE FROM auth.users WHERE email = 'admin@crm.com';

-- Create admin user with a known working password hash
-- Password: admin123
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
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@crm.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- This is 'admin123'
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
  '11111111-1111-1111-1111-111111111111',
  'admin@crm.com',
  'Admin User',
  'admin',
  'approved',
  now(),
  now()
);

-- Verify the user was created
SELECT 'Simple admin created:' as info;
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




