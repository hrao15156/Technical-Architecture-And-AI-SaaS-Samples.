import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.searchParams.get("origin") || "/dashboard"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(new URL("/auth/login?error=auth_callback_failed", request.url))
      }

      if (data.user) {
        // Check if profile exists, if not create it
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single()

        if (!existingProfile) {
          // Create profile for new user
          const { error: profileError } = await supabase.from("profiles").insert([
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
              role: "sales_rep",
              status: "approved", // Auto-approve for OAuth users
            },
          ])

          if (profileError) {
            console.error("Profile creation error:", profileError)
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(new URL("/auth/login?error=unexpected_error", request.url))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(origin, request.url))
}
