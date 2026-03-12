-- Approve the existing testuser@crm.com user
-- This will allow them to log in if they exist in auth.users

-- First, let's see what users we have
SELECT 'Current profiles:' as info;
SELECT id, email, full_name, role, status, created_at
FROM profiles 
WHERE email IN ('testuser@crm.com', 'simple@test.com')
ORDER BY created_at DESC;

-- Approve any pending users
UPDATE profiles 
SET 
  status = 'approved',
  approved_at = now(),
  approved_by = (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
WHERE email IN ('testuser@crm.com', 'simple@test.com')
AND status = 'pending';

-- Show final status
SELECT 'Final status:' as info;
SELECT id, email, full_name, role, status, approved_at
FROM profiles 
WHERE email IN ('testuser@crm.com', 'simple@test.com')
ORDER BY created_at DESC;




