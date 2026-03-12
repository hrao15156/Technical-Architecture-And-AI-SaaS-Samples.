"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profile)
      }
      setLoading(false)
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-600 mt-2">Manage your account preferences and CRM configuration</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="border-emerald-200/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  defaultValue={profile?.full_name || ""}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ""} disabled className="bg-slate-50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  {profile?.role || "Sales Rep"}
                </Badge>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-emerald-200/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-slate-600">Receive email updates about deals and activities</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-insights">AI Insights</Label>
                <p className="text-sm text-slate-600">Get AI-powered recommendations and alerts</p>
              </div>
              <Switch id="ai-insights" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="deal-updates">Deal Updates</Label>
                <p className="text-sm text-slate-600">Notifications when deals change status</p>
              </div>
              <Switch id="deal-updates" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-emerald-200/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" className="border-emerald-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" className="border-emerald-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" className="border-emerald-200 focus:border-emerald-500" />
            </div>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card className="border-emerald-200/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              <CardTitle>AI Configuration</CardTitle>
            </div>
            <CardDescription>Customize AI features and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-scoring">Automatic Lead Scoring</Label>
                <p className="text-sm text-slate-600">Enable AI to automatically score new leads</p>
              </div>
              <Switch id="auto-scoring" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-suggestions">Email Suggestions</Label>
                <p className="text-sm text-slate-600">Get AI-generated email templates</p>
              </div>
              <Switch id="email-suggestions" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="deal-insights">Deal Insights</Label>
                <p className="text-sm text-slate-600">Receive AI analysis on deal probability</p>
              </div>
              <Switch id="deal-insights" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
