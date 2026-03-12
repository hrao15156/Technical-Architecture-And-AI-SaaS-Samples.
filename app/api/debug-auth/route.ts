import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    
    // Test 1: Check if we can connect to Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Test 2: Check if we can query the database
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, role, status")
      .limit(3);
    
    // Test 3: Check auth users table (if accessible)
    let authUsers = null;
    let authUsersError = null;
    try {
      const { data, error } = await supabase
        .from("auth.users")
        .select("id, email, email_confirmed_at")
        .limit(3);
      authUsers = data;
      authUsersError = error;
    } catch (e) {
      authUsersError = { message: "Cannot access auth.users table directly" };
    }
    
    // Test 4: Try to create a test user via signUp
    let signupTest = null;
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test-debug@example.com',
        password: 'test123',
        options: {
          data: {
            full_name: 'Debug Test User'
          }
        }
      });
      signupTest = { data, error };
    } catch (e) {
      signupTest = { error: { message: e instanceof Error ? e.message : 'Unknown error' } };
    }
    
    return NextResponse.json({
      success: true,
      tests: {
        current_user: user ? { id: user.id, email: user.email } : null,
        user_error: userError?.message || null,
        profiles_count: profiles?.length || 0,
        profiles_error: profilesError?.message || null,
        sample_profiles: profiles || [],
        auth_users_accessible: authUsers !== null,
        auth_users_error: authUsersError?.message || null,
        auth_users_sample: authUsers || [],
        signup_test: signupTest
      },
      environment: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
        supabase_service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}




