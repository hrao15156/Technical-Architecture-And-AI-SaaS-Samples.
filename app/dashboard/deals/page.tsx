import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import DealPipeline from "@/components/deal-pipeline"

export default async function DealsPage() {
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

  // Fetch deals, companies, and contacts
  const [{ data: deals }, { data: companies }, { data: contacts }] = await Promise.all([
    supabase
      .from("deals")
      .select(`
        *,
        companies (
          name
        ),
        contacts (
          first_name,
          last_name
        )
      `)
      .order("created_at", { ascending: false }),
    supabase.from("companies").select("id, name").order("name"),
    supabase.from("contacts").select("id, first_name, last_name, company_id").order("first_name"),
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
              <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
              <p className="text-slate-600">Manage your sales pipeline and track deal progress</p>
            </div>

            {/* Deal Pipeline */}
            <DealPipeline deals={deals || []} companies={companies || []} contacts={contacts || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
