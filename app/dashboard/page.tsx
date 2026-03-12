import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import DashboardStats from "@/components/dashboard-stats"
import RecentActivities from "@/components/recent-activities"
import DealsPipeline from "@/components/deals-pipeline"

export default async function DashboardPage() {
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

  // Fetch dashboard data
  const [
    { data: contacts, count: contactsCount },
    { data: companies, count: companiesCount },
    { data: deals, count: dealsCount },
    { data: activities },
  ] = await Promise.all([
    supabase.from("contacts").select("*", { count: "exact" }).limit(5),
    supabase.from("companies").select("*", { count: "exact" }).limit(5),
    supabase
      .from("deals")
      .select("*, companies(name)")
      .not("stage", "in", '("closed_won","closed_lost")')
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("activities")
      .select("*, contacts(first_name, last_name), companies(name)")
      .order("created_at", { ascending: false })
      .limit(8),
  ])

  // Calculate pipeline value
  const pipelineValue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0

  // Format activities for display
  const formattedActivities =
    activities?.map((activity) => ({
      id: activity.id,
      type: activity.type,
      subject: activity.subject,
      contact_name: activity.contacts
        ? `${activity.contacts.first_name} ${activity.contacts.last_name}`
        : "Unknown Contact",
      company_name: activity.companies?.name || "Unknown Company",
      created_at: activity.created_at,
      completed: activity.completed,
    })) || []

  // Format deals for display
  const formattedDeals =
    deals?.map((deal) => ({
      id: deal.id,
      title: deal.title,
      company_name: deal.companies?.name || "Unknown Company",
      value: deal.value || 0,
      stage: deal.stage,
      probability: deal.probability || 0,
      expected_close_date: deal.expected_close_date || new Date().toISOString(),
    })) || []

  const stats = {
    totalContacts: contactsCount || 0,
    totalCompanies: companiesCount || 0,
    activeDeals: dealsCount || 0,
    totalRevenue: pipelineValue,
    contactsChange: "+12% from last month",
    companiesChange: "+8% from last month",
    dealsChange: "+15% from last month",
    revenueChange: "+23% from last month",
  }

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
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Welcome back, {profile?.full_name || user.email}</p>
            </div>

            {/* Stats */}
            <div className="mb-8">
              <DashboardStats stats={stats} />
            </div>

            {/* Content grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <RecentActivities activities={formattedActivities} />
              <DealsPipeline deals={formattedDeals} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
