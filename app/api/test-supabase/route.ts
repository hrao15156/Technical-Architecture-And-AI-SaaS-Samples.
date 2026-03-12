import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    
    // Test basic connection
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Test database connection
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, role, status")
      .limit(5);
    
    return NextResponse.json({
      success: true,
      supabase_connected: true,
      current_user: user ? { id: user.id, email: user.email } : null,
      user_error: userError?.message || null,
      profiles_count: profiles?.length || 0,
      profiles_error: profilesError?.message || null,
      sample_profiles: profiles || []
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      supabase_connected: false
    }, { status: 500 });
  }
}




