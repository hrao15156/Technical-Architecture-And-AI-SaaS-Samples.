"use server"

import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

// Use the centralized server helper so cookie/session handling is consistent
const getSupabaseClient = () => {
  return createServerClient()
}

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Sign in action
export async function signIn(prevState: any, formData: FormData) {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured. Please check your environment variables." }
  }

  if (!formData) {
    console.log("[v0] Form data is missing")
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Input validation and sanitization
  if (!email || !password) {
    console.log("[v0] Email or password missing")
    return { error: "Email and password are required" }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.toString())) {
    return { error: "Please enter a valid email address" }
  }

  // Validate password length
  if (password.toString().length < 6) {
    return { error: "Password must be at least 6 characters long" }
  }

  // Sanitize inputs
  const sanitizedEmail = email.toString().toLowerCase().trim()
  const sanitizedPassword = password.toString()

  try {
    console.log("[v0] Attempting login for:", email?.toString())
    console.log("[v0] Supabase configured:", isSupabaseConfigured)
    const supabase = getSupabaseClient()

    // Diagnostic: ensure auth methods exist on the client
    try {
      console.log("[v0] supabase.auth available:", typeof (supabase as any).auth)
      console.log(
        "[v0] supabase.auth.signInWithPassword:",
        typeof (supabase as any).auth?.signInWithPassword
      )
    } catch (diagErr) {
      console.error("[v0] Diagnostic error inspecting supabase client:", diagErr)
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password: sanitizedPassword,
    })

    console.log("[v0] Auth response detail:", {
      user: data?.user ? { id: data.user.id, email: data.user.email } : null,
      error: error ? { message: error.message, status: (error as any)?.status } : null,
    })

    if (error) {
      console.error("[v0] Auth error object:", error)
      return { error: "Invalid login credentials" }
    }

    if (!data?.user) {
      console.error("[v0] No user returned from auth, data:", data)
      return { error: "Invalid login credentials" }
    }

    console.log("[v0] Checking profile for user:", data.user.id)

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("status, role")
      .eq("id", data.user.id)
      .single()

    console.log("[v0] Profile fetch result:", { profile, profileError })

    if (profileError || !profile) {
      console.error("[v0] Profile not found or error", profileError)
      try {
        await supabase.auth.signOut()
      } catch (signOutErr) {
        console.error("[v0] Error signing out after missing profile:", signOutErr)
      }
      return { error: "Your account is not approved or does not exist." }
    }

    if (profile.status !== "approved") {
      console.warn("[v0] Profile not approved, status:", profile.status)
      try {
        await supabase.auth.signOut()
      } catch (signOutErr) {
        console.error("[v0] Error signing out after unapproved profile:", signOutErr)
      }
      return { error: "Your account is not approved or does not exist." }
    }

    console.log("[v0] Login successful for user with role:", profile.role)
    // Return success so the client component can redirect and show state
    return { success: "Logged in", role: profile.role }
  } catch (err) {
    console.error("[v0] Login error (catch):", err instanceof Error ? err.stack || err.message : err)
    return { error: "Invalid login credentials" }
  }
}

// Sign up action
export async function signUp(prevState: any, formData: FormData) {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured. Please check your environment variables." }
  }

  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")

  // Validate required fields
  if (!email || !password || !fullName) {
    return { error: "Email, password, and full name are required" }
  }

  // Input validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.toString())) {
    return { error: "Please enter a valid email address" }
  }

  if (password.toString().length < 6) {
    return { error: "Password must be at least 6 characters long" }
  }

  if (fullName.toString().trim().length < 2) {
    return { error: "Full name must be at least 2 characters long" }
  }

  // Sanitize inputs
  const sanitizedEmail = email.toString().toLowerCase().trim()
  const sanitizedPassword = password.toString()
  const sanitizedFullName = fullName.toString().trim()

  try {
    const supabase = getSupabaseClient()

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", sanitizedEmail)
      .single()

    if (existingProfile) {
      return { error: "An account with this email already exists." }
    }

    // Use Supabase's built-in sign-up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password: sanitizedPassword,
      options: {
        data: {
          full_name: sanitizedFullName,
        },
      },
    })

    if (authError) {
      console.error("Auth signup error:", authError)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: "Failed to create user account." }
    }

    // Create profile for the new user
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authData.user.id,
          email: sanitizedEmail,
          full_name: sanitizedFullName,
          role: "sales_rep",
          status: "pending", // New users need admin approval
        },
      ])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Try to clean up the auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        console.error("Error cleaning up auth user:", cleanupError)
      }
      return { error: "Failed to create user profile. Please try again." }
    }

    return {
      success: "Your account has been created! An administrator will review and approve your account shortly.",
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign out action
export async function signOut() {
  const supabase = getSupabaseClient()

  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.error("[v0] Error during signOut:", err)
  }
  redirect("/auth/login")
}
