import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Service role client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export interface PendingUser {
  id: string
  email: string
  full_name: string
  requested_role: "admin" | "sales_agent"
  status: "pending" | "approved" | "rejected"
  rejection_reason?: string
  approved_by?: string
  approved_at?: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: "admin" | "sales_manager" | "sales_rep"
  status: "pending" | "approved" | "rejected" | "suspended"
  team_id?: string
  created_at: string
  approved_at?: string
}

// Get all pending user requests
export async function getPendingUsers(): Promise<PendingUser[]> {
  const { data, error } = await supabaseAdmin
    .from("pending_users")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Get all users with their status
export async function getAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Approve a pending user
export async function approveUser(
  pendingUserId: string,
  approvedBy: string,
  assignedRole: "admin" | "sales_agent" = "sales_agent",
) {
  // Get pending user details
  const { data: pendingUser, error: fetchError } = await supabaseAdmin
    .from("pending_users")
    .select("*")
    .eq("id", pendingUserId)
    .single()

  if (fetchError) throw fetchError

  // Create user in auth.users
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: pendingUser.email,
    password: Math.random().toString(36).slice(-8), // Temporary password
    email_confirm: true,
    user_metadata: {
      full_name: pendingUser.full_name,
    },
  })

  if (authError) throw authError

  // Create profile
  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authUser.user.id,
    email: pendingUser.email,
    full_name: pendingUser.full_name,
    role: assignedRole === "admin" ? "admin" : "sales_rep",
    status: "approved",
    approved_by: approvedBy,
    approved_at: new Date().toISOString(),
  })

  if (profileError) throw profileError

  // Update pending user status
  const { error: updateError } = await supabaseAdmin
    .from("pending_users")
    .update({
      status: "approved",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", pendingUserId)

  if (updateError) throw updateError

  return authUser.user
}

// Reject a pending user
export async function rejectUser(pendingUserId: string, rejectedBy: string, reason: string) {
  const { error } = await supabaseAdmin
    .from("pending_users")
    .update({
      status: "rejected",
      approved_by: rejectedBy,
      rejection_reason: reason,
      approved_at: new Date().toISOString(),
    })
    .eq("id", pendingUserId)

  if (error) throw error
}

// Create user directly (admin function)
export async function createUserDirectly(
  userData: {
    email: string
    full_name: string
    role: "admin" | "sales_agent"
    password: string
  },
  createdBy: string,
) {
  // Create user in auth.users
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      full_name: userData.full_name,
    },
  })

  if (authError) throw authError

  // Create profile
  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authUser.user.id,
    email: userData.email,
    full_name: userData.full_name,
    role: userData.role === "admin" ? "admin" : "sales_rep",
    status: "approved",
    approved_by: createdBy,
    approved_at: new Date().toISOString(),
  })

  if (profileError) throw profileError

  return authUser.user
}

// Suspend/unsuspend user
export async function updateUserStatus(userId: string, status: "approved" | "suspended", updatedBy: string) {
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      status,
      approved_by: updatedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) throw error
}
