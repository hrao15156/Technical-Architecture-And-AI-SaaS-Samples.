import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getPendingUsers } from "@/lib/user-management"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const pendingUsers = await getPendingUsers()
    return NextResponse.json(pendingUsers)
  } catch (error) {
    console.error("Error fetching pending users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
