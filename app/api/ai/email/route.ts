import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateEmailSuggestion } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactId, context, purpose } = body

    // Input validation
    if (!contactId || typeof contactId !== 'string') {
      return NextResponse.json({ error: "Valid contact ID is required" }, { status: 400 })
    }

    if (!context || typeof context !== 'string' || context.trim().length === 0) {
      return NextResponse.json({ error: "Context is required" }, { status: 400 })
    }

    if (!purpose || !['follow_up', 'proposal', 'check_in', 'introduction'].includes(purpose)) {
      return NextResponse.json({ error: "Valid purpose is required" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedContactId = contactId.trim()
    const sanitizedContext = context.trim()
    const sanitizedPurpose = purpose.trim()

    // Get authenticated user
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to access this contact
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    
    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Fetch contact and company data with proper authorization check
    const { data: contact } = await supabase
      .from("contacts")
      .select(`
        *,
        companies (*)
      `)
      .eq("id", sanitizedContactId)
      .single()

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    // Check if user has permission to access this contact (admin or assigned to user)
    if (profile.role !== 'admin' && contact.assigned_to !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const email = await generateEmailSuggestion(contact, contact.companies, sanitizedContext, sanitizedPurpose as any)

    return NextResponse.json({ email })
  } catch (error) {
    console.error("Email generation error:", error)
    return NextResponse.json({ error: "Email generation failed" }, { status: 500 })
  }
}
