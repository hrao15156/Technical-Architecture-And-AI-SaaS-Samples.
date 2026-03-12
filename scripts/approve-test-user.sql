-- Approve the test user that was just created
-- This will allow them to log in

-- First, let's see what users are pending approval
SELECT id, email, full_name, status, created_at 
FROM profiles 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- Approve the test user
UPDATE profiles 
SET 
  status = 'approved',
  approved_at = now(),
  approved_by = (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
WHERE email = 'testuser@crm.com';

-- Also check if there's a pending_users entry to approve
SELECT id, email, full_name, status, created_at 
FROM pending_users 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- If there's a pending_users entry, approve it too
UPDATE pending_users 
SET 
  status = 'approved',
  approved_at = now(),
  approved_by = (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
WHERE email = 'testuser@crm.com';

-- Verify the user is now approved
SELECT id, email, full_name, role, status, approved_at 
FROM profiles 
WHERE email = 'testuser@crm.com';




