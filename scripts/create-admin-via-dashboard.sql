-- Instructions for creating admin user via Supabase Dashboard
-- Since manual database insertion isn't working, let's use the proper method

-- Step 1: Go to your Supabase Dashboard
-- Step 2: Navigate to Authentication > Users
-- Step 3: Click "Add user" or "Invite user"
-- Step 4: Create a user with:
--   Email: admin@crm.com
--   Password: admin123
--   Auto Confirm User: Yes (checked)

-- Step 5: After creating the user, run this script to create their profile
-- (Replace 'USER_ID_FROM_DASHBOARD' with the actual user ID from the dashboard)

-- First, let's see what users exist in auth.users
SELECT 'Current auth users:' as info;
SELECT id, email, email_confirmed_at, created_at
FROM auth.users 
ORDER BY created_at DESC;

-- If you see admin@crm.com in the list above, note the ID and use it below
-- Otherwise, create the user via the dashboard first

-- Example: If the user ID is 'abc123-def456-ghi789', uncomment and run:
-- INSERT INTO profiles (
--   id,
--   email,
--   full_name,
--   role,
--   status,
--   created_at,
--   updated_at
-- ) VALUES (
--   'abc123-def456-ghi789', -- Replace with actual user ID
--   'admin@crm.com',
--   'Admin User',
--   'admin',
--   'approved',
--   now(),
--   now()
-- );

-- Show current profiles
SELECT 'Current profiles:' as info;
SELECT id, email, full_name, role, status
FROM profiles 
ORDER BY created_at DESC;




