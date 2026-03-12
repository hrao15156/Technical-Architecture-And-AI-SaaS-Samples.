import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, Users, ArrowRight, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Brain className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Connect Supabase to get started</h1>
          <p className="text-muted-foreground">Configure your database integration to begin using AI CRM</p>
        </div>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">AI CRM</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Sales Intelligence
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground leading-tight">
              Transform Your Sales with
              <span className="text-primary block sm:inline"> Intelligent CRM</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Supercharge your sales process with AI-driven insights, automated workflows, and predictive analytics that
              help you close more deals faster than ever before.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-border hover:bg-muted/50 transition-all duration-200 w-full sm:w-auto bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="mt-20 sm:mt-32 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-8 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="bg-primary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">AI-Powered Insights</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get intelligent recommendations and predictive analytics to identify your best opportunities and optimize
              your sales strategy.
            </p>
          </div>

          <div className="group p-8 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">Advanced Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track performance, forecast revenue, and optimize your sales process with detailed reports and real-time
              dashboards.
            </p>
          </div>

          <div className="group p-8 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="bg-secondary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">Team Collaboration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Keep your entire sales team aligned with shared pipelines, real-time updates, and collaborative workflows.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
