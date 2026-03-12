"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Brain } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function AlternativeLoginForm() {
  const [email, setEmail] = useState("admin@crm.com")
  const [password, setPassword] = useState("123456")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      console.log("Attempting login with:", email)
      
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        console.error("Login error:", error)
        setError(error.message)
        return
      }

      if (!data.user) {
        setError("No user returned from authentication")
        return
      }

      console.log("Authentication successful, checking profile...")

      // Check profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("status, role")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile) {
        console.error("Profile error:", profileError)
        setError("Profile not found or error accessing profile")
        await supabase.auth.signOut()
        return
      }

      if (profile.status !== "approved") {
        console.error("Profile not approved:", profile.status)
        setError("Your account is not approved or does not exist.")
        await supabase.auth.signOut()
        return
      }

      console.log("Login successful, redirecting...")
      setSuccess(true)
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)

    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 border-emerald-200/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-full shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Alternative Login
            </CardTitle>
            <CardDescription className="text-slate-600">Direct authentication test</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ✅ Login successful! Redirecting to dashboard...
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@crm.com"
                required
                className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium h-11 shadow-lg transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm text-slate-600">
              <Link
                href="/auth/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Back to main login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

