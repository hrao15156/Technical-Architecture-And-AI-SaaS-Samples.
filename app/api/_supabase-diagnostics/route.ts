import { NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    const diagnostics: any = {
      isSupabaseConfigured,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      clientShape: {
        auth: typeof (supabase as any).auth,
        signInWithPassword: typeof (supabase as any).auth?.signInWithPassword,
        getUser: typeof (supabase as any).auth?.getUser,
      },
    }

    return NextResponse.json(diagnostics)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
