import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { rejectUser } from "@/lib/user-management"

export async function POST(request: NextRequest) {
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

    const { userId, reason } = await request.json()

    if (!userId || !reason) {
      return NextResponse.json({ error: "User ID and reason are required" }, { status: 400 })
    }

    await rejectUser(userId, user.id, reason)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error rejecting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
