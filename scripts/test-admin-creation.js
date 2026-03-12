// Test script to create admin user using Supabase client
// This will use the proper Supabase authentication methods

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create user in auth.users using Supabase Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@crm.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User'
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    console.log('Auth user created:', authData.user?.id);

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: 'admin@crm.com',
          full_name: 'Admin User',
          role: 'admin',
          status: 'approved',
        },
      ]);

    if (profileError) {
      console.error('Profile error:', profileError);
      return;
    }

    console.log('Profile created successfully');
    console.log('Admin user created with ID:', authData.user.id);
    console.log('You can now log in with admin@crm.com / admin123');

  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser();




