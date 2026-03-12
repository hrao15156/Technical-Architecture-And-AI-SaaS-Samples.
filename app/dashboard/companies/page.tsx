import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, DollarSign, Globe } from "lucide-react"

export default async function CompaniesPage() {
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

  // Fetch companies with contact counts
  const { data: companies } = await supabase
    .from("companies")
    .select(`
      *,
      contacts (count)
    `)
    .order("created_at", { ascending: false })

  const userProfile = {
    email: user.email,
    full_name: profile?.full_name,
    avatar_url: profile?.avatar_url,
  }

  const getSizeColor = (size: string) => {
    switch (size) {
      case "enterprise":
        return "bg-purple-100 text-purple-700"
      case "large":
        return "bg-blue-100 text-blue-700"
      case "medium":
        return "bg-green-100 text-green-700"
      case "small":
        return "bg-yellow-100 text-yellow-700"
      case "startup":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
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
              <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
              <p className="text-slate-600">Manage your company accounts and prospects</p>
            </div>

            {/* Companies Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {companies?.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {company.industry || "Industry not specified"}
                          </CardDescription>
                        </div>
                      </div>
                      {company.ai_score > 0 && (
                        <Badge className="bg-green-100 text-green-700 text-xs">AI: {company.ai_score}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{company.contacts?.[0]?.count || 0} contacts</span>
                      </div>
                      {company.size_category && (
                        <Badge className={getSizeColor(company.size_category)}>
                          {company.size_category.charAt(0).toUpperCase() + company.size_category.slice(1)}
                        </Badge>
                      )}
                    </div>

                    {company.annual_revenue && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          ${(company.annual_revenue / 1000000).toFixed(1)}M revenue
                        </span>
                      </div>
                    )}

                    {company.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 truncate"
                        >
                          {company.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}

                    {company.notes && <p className="text-sm text-slate-600 line-clamp-2">{company.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
