import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import AnalyticsCharts from "@/components/analytics-charts"
import ReportsGenerator from "@/components/reports-generator"

export default async function AnalyticsPage() {
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

  // Fetch analytics data
  const [{ data: deals }, { data: contacts }, { data: companies }, { data: activities }] = await Promise.all([
    supabase.from("deals").select("*"),
    supabase.from("contacts").select("*"),
    supabase.from("companies").select("*"),
    supabase.from("activities").select("*"),
  ])

  // Process data for analytics
  const dealsByStage = [
    {
      stage: "Prospecting",
      count: deals?.filter((d) => d.stage === "prospecting").length || 0,
      value: deals?.filter((d) => d.stage === "prospecting").reduce((sum, d) => sum + (d.value || 0), 0) || 0,
    },
    {
      stage: "Qualification",
      count: deals?.filter((d) => d.stage === "qualification").length || 0,
      value: deals?.filter((d) => d.stage === "qualification").reduce((sum, d) => sum + (d.value || 0), 0) || 0,
    },
    {
      stage: "Proposal",
      count: deals?.filter((d) => d.stage === "proposal").length || 0,
      value: deals?.filter((d) => d.stage === "proposal").reduce((sum, d) => sum + (d.value || 0), 0) || 0,
    },
    {
      stage: "Negotiation",
      count: deals?.filter((d) => d.stage === "negotiation").length || 0,
      value: deals?.filter((d) => d.stage === "negotiation").reduce((sum, d) => sum + (d.value || 0), 0) || 0,
    },
    {
      stage: "Closed Won",
      count: deals?.filter((d) => d.stage === "closed_won").length || 0,
      value: deals?.filter((d) => d.stage === "closed_won").reduce((sum, d) => sum + (d.value || 0), 0) || 0,
    },
    {
      stage: "Closed Lost",
      count: deals?.filter((d) => d.stage === "closed_lost").length || 0,
      value: deals?.filter((d) => d.stage === "closed_lost").reduce((sum, d) => sum + (d.value || 0), 0) || 0,
    },
  ]

  const revenueOverTime = [
    { month: "Jan", revenue: 45000, deals: 12 },
    { month: "Feb", revenue: 52000, deals: 15 },
    { month: "Mar", revenue: 48000, deals: 13 },
    { month: "Apr", revenue: 61000, deals: 18 },
    { month: "May", revenue: 55000, deals: 16 },
    { month: "Jun", revenue: 67000, deals: 20 },
  ]

  const leadSources = [
    { source: "Website", count: contacts?.filter((c) => c.lead_source === "Website").length || 0, value: 0 },
    { source: "LinkedIn", count: contacts?.filter((c) => c.lead_source === "LinkedIn").length || 0, value: 0 },
    { source: "Referral", count: contacts?.filter((c) => c.lead_source === "Referral").length || 0, value: 0 },
    {
      source: "Cold Outreach",
      count: contacts?.filter((c) => c.lead_source === "Cold Outreach").length || 0,
      value: 0,
    },
    { source: "Trade Show", count: contacts?.filter((c) => c.lead_source === "Trade Show").length || 0, value: 0 },
  ]

  const topPerformers = [
    { name: "Sarah Johnson", deals: 15, revenue: 245000 },
    { name: "Mike Davis", deals: 12, revenue: 198000 },
    { name: "Emily Chen", deals: 10, revenue: 156000 },
    { name: "Robert Wilson", deals: 8, revenue: 134000 },
  ]

  const conversionRates = [
    { stage: "prospecting", rate: 65 },
    { stage: "qualification", rate: 45 },
    { stage: "proposal", rate: 35 },
    { stage: "negotiation", rate: 25 },
    { stage: "closed_won", rate: 18 },
  ]

  const aiScoreDistribution = [
    {
      range: "0-20",
      contacts: contacts?.filter((c) => c.ai_score >= 0 && c.ai_score <= 20).length || 0,
      deals: deals?.filter((d) => d.ai_score >= 0 && d.ai_score <= 20).length || 0,
    },
    {
      range: "21-40",
      contacts: contacts?.filter((c) => c.ai_score >= 21 && c.ai_score <= 40).length || 0,
      deals: deals?.filter((d) => d.ai_score >= 21 && d.ai_score <= 40).length || 0,
    },
    {
      range: "41-60",
      contacts: contacts?.filter((c) => c.ai_score >= 41 && c.ai_score <= 60).length || 0,
      deals: deals?.filter((d) => d.ai_score >= 41 && d.ai_score <= 60).length || 0,
    },
    {
      range: "61-80",
      contacts: contacts?.filter((c) => c.ai_score >= 61 && c.ai_score <= 80).length || 0,
      deals: deals?.filter((d) => d.ai_score >= 61 && d.ai_score <= 80).length || 0,
    },
    {
      range: "81-100",
      contacts: contacts?.filter((c) => c.ai_score >= 81 && c.ai_score <= 100).length || 0,
      deals: deals?.filter((d) => d.ai_score >= 81 && d.ai_score <= 100).length || 0,
    },
  ]

  const analyticsData = {
    dealsByStage,
    revenueOverTime,
    leadSources,
    topPerformers,
    conversionRates,
    aiScoreDistribution,
  }

  const userProfile = {
    email: user.email,
    full_name: profile?.full_name,
    avatar_url: profile?.avatar_url,
  }

  const handleGenerateReport = async (config: any) => {
    // In a real app, this would generate and download the report
    console.log("Generating report with config:", config)
    alert("Report generation would be implemented here!")
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
              <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
              <p className="text-slate-600">Comprehensive insights into your sales performance</p>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-4">
              {/* Analytics Charts */}
              <div className="lg:col-span-3">
                <AnalyticsCharts data={analyticsData} />
              </div>

              {/* Reports Generator */}
              <div>
                <ReportsGenerator onGenerateReport={handleGenerateReport} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
