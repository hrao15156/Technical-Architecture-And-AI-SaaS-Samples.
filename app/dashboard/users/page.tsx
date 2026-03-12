import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { UserManagementTable } from "@/components/user-management-table"

export default async function UsersPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="p-6">
      <UserManagementTable />
    </div>
  )
}
