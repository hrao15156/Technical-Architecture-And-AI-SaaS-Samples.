-- Test password verification for the admin user
-- This will help us verify if the password hash is correct

-- Test if the password 'admin123' matches the stored hash
SELECT 
  id,
  email,
  encrypted_password,
  CASE 
    WHEN encrypted_password = crypt('admin123', encrypted_password) 
    THEN 'PASSWORD MATCHES' 
    ELSE 'PASSWORD DOES NOT MATCH' 
  END as password_check
FROM auth.users 
WHERE email = 'admin@crm.com';

-- Also test the sales user
SELECT 
  id,
  email,
  encrypted_password,
  CASE 
    WHEN encrypted_password = crypt('sales123', encrypted_password) 
    THEN 'PASSWORD MATCHES' 
    ELSE 'PASSWORD DOES NOT MATCH' 
  END as password_check
FROM auth.users 
WHERE email = 'sales@crm.com';

-- Check if there are any issues with the user status
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
FROM auth.users 
WHERE email IN ('admin@crm.com', 'sales@crm.com');




