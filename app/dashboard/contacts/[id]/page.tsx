import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import AIInsightsPanel from "@/components/ai-insights-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Building2, User, Calendar } from "lucide-react"

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile and contact data
  const [{ data: profile }, { data: contact }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("contacts")
      .select(`
        *,
        companies (*)
      `)
      .eq("id", params.id)
      .single(),
  ])

  if (!contact) {
    notFound()
  }

  // Get recent activities
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("contact_id", params.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const userProfile = {
    email: user.email,
    full_name: profile?.full_name,
    avatar_url: profile?.avatar_url,
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div>
      <DashboardNav user={userProfile} />

      <div className="lg:pl-72">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Contact Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                          {getInitials(contact.first_name, contact.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-2xl">
                          {contact.first_name} {contact.last_name}
                        </CardTitle>
                        <CardDescription className="text-lg">{contact.job_title}</CardDescription>
                        <div className="flex items-center space-x-4 mt-2">
                          {contact.companies && (
                            <div className="flex items-center space-x-1 text-sm text-slate-600">
                              <Building2 className="h-4 w-4" />
                              <span>{contact.companies.name}</span>
                            </div>
                          )}
                          {contact.ai_score > 0 && (
                            <Badge className="bg-green-100 text-green-700">AI Score: {contact.ai_score}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {contact.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                      )}
                      {contact.department && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">{contact.department}</span>
                        </div>
                      )}
                      {contact.lead_source && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600">Lead Source:</span>
                          <Badge variant="secondary">{contact.lead_source}</Badge>
                        </div>
                      )}
                    </div>
                    {contact.notes && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                        <p className="text-sm text-slate-600">{contact.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activities && activities.length > 0 ? (
                      <div className="space-y-3">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                            <Calendar className="h-4 w-4 text-slate-400 mt-1" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{activity.subject}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(activity.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No recent activities</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights */}
              <div>
                <AIInsightsPanel entityType="contact" entityId={params.id} entityData={contact} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
