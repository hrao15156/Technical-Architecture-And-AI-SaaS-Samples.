import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    // Test basic Supabase connection
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Test database connection
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
    
    // Test auth sign in directly
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: "test@crm.com",
      password: "test123"
    })
    
    return NextResponse.json({
      success: true,
      currentUser: user,
      profiles: profiles,
      authTest: {
        data: authData,
        error: authError
      },
      errors: {
        profilesError,
        authError
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}




