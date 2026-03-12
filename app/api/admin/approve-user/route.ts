import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { approveUser } from "@/lib/user-management"

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

    const body = await request.json()
    const { userId, role } = body

    // Input validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: "Valid user ID is required" }, { status: 400 })
    }

    if (!role || !['admin', 'sales_agent'].includes(role)) {
      return NextResponse.json({ error: "Valid role is required" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedUserId = userId.trim()
    const sanitizedRole = role.trim()

    const approvedUser = await approveUser(sanitizedUserId, user.id, sanitizedRole as any)
    return NextResponse.json({ success: true, user: approvedUser })
  } catch (error) {
    console.error("Error approving user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
