-- Get all pending users that need admin approval
SELECT 
  id,
  email,
  full_name,
  role,
  status,
  created_at
FROM profiles 
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Approve a specific user (replace 'user@example.com' with actual email)
-- UPDATE profiles 
-- SET 
--   status = 'approved',
--   approved_at = now(),
--   approved_by = (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
-- WHERE email = 'user@example.com';




