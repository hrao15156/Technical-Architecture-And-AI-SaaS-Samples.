-- Seed sample data for CRM demo

-- Insert sample teams
INSERT INTO teams (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Sales Team Alpha', 'Primary sales team for enterprise clients'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sales Team Beta', 'SMB and mid-market focused team');

-- Insert sample companies
INSERT INTO companies (id, name, domain, industry, size_category, annual_revenue, phone, website, ai_score) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'techcorp.com', 'Technology', 'large', 50000000, '+1-555-0101', 'https://techcorp.com', 85),
  ('660e8400-e29b-41d4-a716-446655440002', 'Green Energy Inc', 'greenenergy.com', 'Energy', 'medium', 15000000, '+1-555-0102', 'https://greenenergy.com', 72),
  ('660e8400-e29b-41d4-a716-446655440003', 'StartupXYZ', 'startupxyz.io', 'SaaS', 'startup', 2000000, '+1-555-0103', 'https://startupxyz.io', 90),
  ('660e8400-e29b-41d4-a716-446655440004', 'Manufacturing Plus', 'mfgplus.com', 'Manufacturing', 'large', 75000000, '+1-555-0104', 'https://mfgplus.com', 65);

-- Insert sample contacts
INSERT INTO contacts (id, company_id, first_name, last_name, email, phone, job_title, department, lead_source, ai_score) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'John', 'Smith', 'john.smith@techcorp.com', '+1-555-1001', 'CTO', 'Technology', 'Website', 88),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah.johnson@techcorp.com', '+1-555-1002', 'VP of Sales', 'Sales', 'Referral', 82),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Mike', 'Davis', 'mike.davis@greenenergy.com', '+1-555-2001', 'CEO', 'Executive', 'LinkedIn', 75),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'Emily', 'Chen', 'emily.chen@startupxyz.io', '+1-555-3001', 'Founder', 'Executive', 'Cold Outreach', 92),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', 'Robert', 'Wilson', 'robert.wilson@mfgplus.com', '+1-555-4001', 'Procurement Manager', 'Operations', 'Trade Show', 68);

-- Insert sample deals
INSERT INTO deals (id, title, company_id, contact_id, value, stage, probability, expected_close_date, lead_source, description, ai_score) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'TechCorp Enterprise License', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 250000.00, 'proposal', 75, '2025-03-15', 'Website', 'Enterprise software licensing deal for 500+ users', 85),
  ('880e8400-e29b-41d4-a716-446655440002', 'Green Energy Consulting', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', 75000.00, 'qualification', 45, '2025-04-01', 'LinkedIn', 'Sustainability consulting project', 72),
  ('880e8400-e29b-41d4-a716-446655440003', 'StartupXYZ Growth Package', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', 50000.00, 'negotiation', 85, '2025-02-28', 'Cold Outreach', 'Growth acceleration package for scaling startup', 90),
  ('880e8400-e29b-41d4-a716-446655440004', 'Manufacturing Automation', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440005', 500000.00, 'prospecting', 25, '2025-06-01', 'Trade Show', 'Factory automation and digitization project', 65);

-- Insert sample activities
INSERT INTO activities (id, type, subject, description, contact_id, deal_id, company_id, completed, scheduled_at) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', 'call', 'Discovery Call with John Smith', 'Initial discovery call to understand technical requirements', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', true, '2025-01-15 14:00:00+00'),
  ('990e8400-e29b-41d4-a716-446655440002', 'email', 'Follow-up on Proposal', 'Send detailed proposal and pricing information', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', true, '2025-01-16 09:00:00+00'),
  ('990e8400-e29b-41d4-a716-446655440003', 'meeting', 'Demo Presentation', 'Product demonstration for stakeholders', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', false, '2025-01-25 15:00:00+00'),
  ('990e8400-e29b-41d4-a716-446655440004', 'task', 'Prepare ROI Analysis', 'Create detailed ROI analysis for manufacturing automation project', '770e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', false, '2025-01-30 10:00:00+00');

-- Insert sample AI insights
INSERT INTO ai_insights (entity_type, entity_id, insight_type, content, confidence_score) VALUES
  ('contact', '770e8400-e29b-41d4-a716-446655440001', 'lead_score', '{"score": 88, "factors": ["High engagement", "Decision maker", "Budget confirmed"], "recommendation": "Priority follow-up"}', 0.92),
  ('deal', '880e8400-e29b-41d4-a716-446655440001', 'next_action', '{"action": "Schedule technical deep-dive", "reasoning": "Customer showed strong interest in advanced features", "urgency": "high"}', 0.85),
  ('contact', '770e8400-e29b-41d4-a716-446655440004', 'opportunity', '{"type": "upsell", "description": "Potential for additional modules based on growth trajectory", "value_estimate": 25000}', 0.78),
  ('deal', '880e8400-e29b-41d4-a716-446655440004', 'risk_assessment', '{"risk_level": "medium", "factors": ["Long sales cycle", "Multiple stakeholders"], "mitigation": "Engage procurement early"}', 0.81);
