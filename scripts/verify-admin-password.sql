-- Verify and fix admin password if needed
-- This will check if the password hash is correct and fix it if necessary

-- Check current admin user details
SELECT 
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'admin@crm.com';

-- Update the admin password with a fresh hash
UPDATE auth.users 
SET 
  encrypted_password = crypt('admin123', gen_salt('bf')),
  updated_at = now()
WHERE email = 'admin@crm.com';

-- Verify the password was updated
SELECT 
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  updated_at
FROM auth.users 
WHERE email = 'admin@crm.com';

-- Also check the profile
SELECT 
  id,
  email,
  full_name,
  role,
  status,
  approved_at
FROM profiles 
WHERE email = 'admin@crm.com';




