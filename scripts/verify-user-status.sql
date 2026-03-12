-- Verify the user status and check authentication setup
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  status, 
  approved_at,
  created_at
FROM profiles 
WHERE email = 'testuser@crm.com';

-- Also check if the user exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'testuser@crm.com';

-- Check if there are any RLS policies that might be blocking access
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('profiles', 'users')
ORDER BY tablename, policyname;




