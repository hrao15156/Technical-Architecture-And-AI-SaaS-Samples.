-- Create admin and sales rep users with proper authentication
-- First, create the users in auth.users table

-- Admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
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
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Sales rep user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
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
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create profiles for the users
WITH admin_user AS (
  SELECT id FROM auth.users WHERE email = 'admin@crm.com'
),
sales_user AS (
  SELECT id FROM auth.users WHERE email = 'sales@crm.com'
)
INSERT INTO profiles (id, email, full_name, role, status, created_at, updated_at, approved_at, approved_by)
SELECT 
  admin_user.id,
  'admin@crm.com',
  'System Administrator',
  'admin',
  'approved',
  now(),
  now(),
  now(),
  admin_user.id
FROM admin_user
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  status = 'approved',
  approved_at = now();

INSERT INTO profiles (id, email, full_name, role, status, created_at, updated_at, approved_at, approved_by)
SELECT 
  sales_user.id,
  'sales@crm.com',
  'Sales Representative',
  'sales_agent',
  'approved',
  now(),
  now(),
  now(),
  (SELECT id FROM auth.users WHERE email = 'admin@crm.com')
FROM (SELECT id FROM auth.users WHERE email = 'sales@crm.com') sales_user
ON CONFLICT (id) DO UPDATE SET
  role = 'sales_agent',
  status = 'approved',
  approved_at = now();

-- Create sample companies
INSERT INTO companies (id, name, industry, size_category, annual_revenue, website, phone, email, address, city, state, country, postal_code, ai_score, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'TechCorp Solutions', 'Technology', 'Medium', 5000000, 'https://techcorp.com', '+1-555-0101', 'contact@techcorp.com', '123 Tech Street', 'San Francisco', 'CA', 'USA', '94105', 85, now(), now()),
  (gen_random_uuid(), 'Global Manufacturing Inc', 'Manufacturing', 'Large', 50000000, 'https://globalmanuf.com', '+1-555-0102', 'info@globalmanuf.com', '456 Industrial Ave', 'Detroit', 'MI', 'USA', '48201', 78, now(), now()),
  (gen_random_uuid(), 'StartupX', 'Software', 'Small', 500000, 'https://startupx.io', '+1-555-0103', 'hello@startupx.io', '789 Innovation Blvd', 'Austin', 'TX', 'USA', '73301', 92, now(), now());

-- Create sample contacts
WITH companies_data AS (
  SELECT id, name FROM companies WHERE name IN ('TechCorp Solutions', 'Global Manufacturing Inc', 'StartupX')
),
sales_rep AS (
  SELECT id FROM profiles WHERE email = 'sales@crm.com'
)
INSERT INTO contacts (id, first_name, last_name, email, phone, job_title, department, company_id, assigned_to, lead_source, ai_score, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  first_name,
  last_name,
  email,
  phone,
  job_title,
  department,
  company_id,
  sales_rep.id,
  lead_source,
  ai_score,
  now(),
  now()
FROM (
  VALUES 
    ('John', 'Smith', 'john.smith@techcorp.com', '+1-555-1001', 'CTO', 'Engineering', (SELECT id FROM companies_data WHERE name = 'TechCorp Solutions'), 'Website', 88),
    ('Sarah', 'Johnson', 'sarah.j@globalmanuf.com', '+1-555-1002', 'VP Sales', 'Sales', (SELECT id FROM companies_data WHERE name = 'Global Manufacturing Inc'), 'Referral', 82),
    ('Mike', 'Chen', 'mike@startupx.io', '+1-555-1003', 'CEO', 'Executive', (SELECT id FROM companies_data WHERE name = 'StartupX'), 'LinkedIn', 95)
) AS contact_data(first_name, last_name, email, phone, job_title, department, company_id, lead_source, ai_score)
CROSS JOIN sales_rep;

-- Create sample deals
WITH contacts_data AS (
  SELECT id, first_name, last_name, company_id FROM contacts WHERE email IN ('john.smith@techcorp.com', 'sarah.j@globalmanuf.com', 'mike@startupx.io')
),
sales_rep AS (
  SELECT id FROM profiles WHERE email = 'sales@crm.com'
)
INSERT INTO deals (id, title, description, value, currency, stage, probability, expected_close_date, company_id, contact_id, assigned_to, lead_source, ai_score, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  title,
  description,
  value,
  'USD',
  stage,
  probability,
  expected_close_date,
  company_id,
  contact_id,
  sales_rep.id,
  'Website',
  ai_score,
  now(),
  now()
FROM (
  VALUES 
    ('Enterprise Software License', 'Annual software licensing deal for 500 users', 125000, 'negotiation', 75, '2024-03-15'::date, (SELECT id FROM contacts_data WHERE first_name = 'John'), 87),
    ('Manufacturing Equipment', 'Custom manufacturing equipment procurement', 250000, 'proposal', 60, '2024-04-20'::date, (SELECT id FROM contacts_data WHERE first_name = 'Sarah'), 79),
    ('Startup Consulting Package', 'Complete business development consulting', 75000, 'qualified', 90, '2024-02-28'::date, (SELECT id FROM contacts_data WHERE first_name = 'Mike'), 93)
) AS deal_data(title, description, value, stage, probability, expected_close_date, contact_id, ai_score)
CROSS JOIN sales_rep
JOIN contacts_data ON contacts_data.id = deal_data.contact_id;

-- Create sample activities
WITH deals_data AS (
  SELECT id, title, contact_id, company_id FROM deals WHERE title IN ('Enterprise Software License', 'Manufacturing Equipment', 'Startup Consulting Package')
),
sales_rep AS (
  SELECT id FROM profiles WHERE email = 'sales@crm.com'
)
INSERT INTO activities (id, type, subject, description, scheduled_at, completed, contact_id, deal_id, company_id, assigned_to, ai_generated, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  type,
  subject,
  description,
  scheduled_at,
  completed,
  contact_id,
  deal_id,
  company_id,
  sales_rep.id,
  ai_generated,
  now(),
  now()
FROM (
  VALUES 
    ('call', 'Follow-up Call', 'Discuss technical requirements and implementation timeline', now() + interval '2 days', false, (SELECT id FROM deals_data WHERE title = 'Enterprise Software License'), true),
    ('email', 'Proposal Review', 'Send detailed proposal with pricing breakdown', now() + interval '1 day', false, (SELECT id FROM deals_data WHERE title = 'Manufacturing Equipment'), true),
    ('meeting', 'Strategy Session', 'In-person meeting to finalize consulting scope', now() + interval '3 days', false, (SELECT id FROM deals_data WHERE title = 'Startup Consulting Package'), false)
) AS activity_data(type, subject, description, scheduled_at, completed, deal_id, ai_generated)
CROSS JOIN sales_rep
JOIN deals_data ON deals_data.id = activity_data.deal_id;
