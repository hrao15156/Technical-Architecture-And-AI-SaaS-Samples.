-- Create admin and sales rep users directly in auth.users table
-- This bypasses the approval workflow for initial setup

-- Insert admin user
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
  gen_random_uuid(),
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
) ON CONFLICT (email) DO NOTHING;

-- Insert sales rep user
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
  gen_random_uuid(),
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
) ON CONFLICT (email) DO NOTHING;

-- Create corresponding profiles
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  status,
  approved_at,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN u.email = 'admin@crm.com' THEN 'Admin User'
    WHEN u.email = 'sales@crm.com' THEN 'Sales Representative'
  END,
  CASE 
    WHEN u.email = 'admin@crm.com' THEN 'admin'
    WHEN u.email = 'sales@crm.com' THEN 'sales_agent'
  END,
  'approved',
  now(),
  now(),
  now()
FROM auth.users u 
WHERE u.email IN ('admin@crm.com', 'sales@crm.com')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  approved_at = EXCLUDED.approved_at;

-- Create a default team
INSERT INTO teams (id, name, description, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Default Team',
  'Default team for CRM users',
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Update profiles with team_id
UPDATE profiles 
SET team_id = (SELECT id FROM teams WHERE name = 'Default Team' LIMIT 1)
WHERE team_id IS NULL;

-- Create sample companies
INSERT INTO companies (id, name, industry, size_category, annual_revenue, ai_score, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'TechCorp Solutions', 'Technology', 'Medium', 5000000, 85, now(), now()),
  (gen_random_uuid(), 'Global Industries', 'Manufacturing', 'Large', 50000000, 92, now(), now()),
  (gen_random_uuid(), 'StartupXYZ', 'Software', 'Small', 500000, 78, now(), now())
ON CONFLICT DO NOTHING;

-- Create sample contacts
INSERT INTO contacts (id, company_id, first_name, last_name, email, job_title, ai_score, assigned_to, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  c.id,
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 'John'
    WHEN c.name = 'Global Industries' THEN 'Sarah'
    WHEN c.name = 'StartupXYZ' THEN 'Mike'
  END,
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 'Smith'
    WHEN c.name = 'Global Industries' THEN 'Johnson'
    WHEN c.name = 'StartupXYZ' THEN 'Wilson'
  END,
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 'john@techcorp.com'
    WHEN c.name = 'Global Industries' THEN 'sarah@global.com'
    WHEN c.name = 'StartupXYZ' THEN 'mike@startupxyz.com'
  END,
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 'CTO'
    WHEN c.name = 'Global Industries' THEN 'VP Sales'
    WHEN c.name = 'StartupXYZ' THEN 'Founder'
  END,
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 88
    WHEN c.name = 'Global Industries' THEN 95
    WHEN c.name = 'StartupXYZ' THEN 82
  END,
  (SELECT id FROM profiles WHERE role = 'sales_agent' LIMIT 1),
  now(),
  now()
FROM companies c
ON CONFLICT DO NOTHING;

-- Create sample deals
INSERT INTO deals (id, title, company_id, contact_id, assigned_to, value, probability, stage, ai_score, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 'Enterprise Software License'
    WHEN c.name = 'Global Industries' THEN 'Manufacturing Partnership'
    WHEN c.name = 'StartupXYZ' THEN 'Startup Package Deal'
  END,
  c.id,
  ct.id,
  (SELECT id FROM profiles WHERE role = 'sales_agent' LIMIT 1),
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 150000
    WHEN c.name = 'Global Industries' THEN 500000
    WHEN c.name = 'StartupXYZ' THEN 25000
  END,
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 75
    WHEN c.name = 'Global Industries' THEN 90
    WHEN c.name = 'StartupXYZ' THEN 60
  END,
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 'proposal'
    WHEN c.name = 'Global Industries' THEN 'negotiation'
    WHEN c.name = 'StartupXYZ' THEN 'qualified'
  END,
  CASE 
    WHEN c.name = 'TechCorp Solutions' THEN 85
    WHEN c.name = 'Global Industries' THEN 92
    WHEN c.name = 'StartupXYZ' THEN 78
  END,
  now(),
  now()
FROM companies c
JOIN contacts ct ON ct.company_id = c.id
ON CONFLICT DO NOTHING;
