import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import ContactsTable from "@/components/contacts-table"

export default async function ContactsPage() {
  // If Supabase is not configured, show setup message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch contacts and companies
  const [{ data: contacts }, { data: companies }] = await Promise.all([
    supabase
      .from("contacts")
      .select(`
        *,
        companies (
          name
        )
      `)
      .order("created_at", { ascending: false }),
    supabase.from("companies").select("id, name").order("name"),
  ])

  const userProfile = {
    email: user.email,
    full_name: profile?.full_name,
    avatar_url: profile?.avatar_url,
  }

  return (
    <div>
      <DashboardNav user={userProfile} />

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
              <p className="text-slate-600">Manage your contact database and relationships</p>
            </div>

            {/* Contacts Table */}
            <ContactsTable contacts={contacts || []} companies={companies || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
