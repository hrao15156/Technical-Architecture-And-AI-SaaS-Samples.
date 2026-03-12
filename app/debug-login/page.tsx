"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function DebugLoginPage() {
  const [email, setEmail] = useState("admin@crm.com")
  const [password, setPassword] = useState("123456")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testLogin = async () => {
    setLoading(true)
    setResult(null)
    setLogs([])
    
    try {
      addLog("Starting login test...")
      
      const supabase = createClient()
      addLog("Supabase client created")
      
      addLog(`Attempting login with email: ${email}`)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      
      if (error) {
        addLog(`❌ Authentication failed: ${error.message}`)
        setResult({ success: false, error: error.message })
        return
      }
      
      addLog("✅ Authentication successful!")
      addLog(`User ID: ${data.user.id}`)
      
      // Test profile access
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()
      
      if (profileError) {
        addLog(`❌ Profile access failed: ${profileError.message}`)
        setResult({ success: false, error: profileError.message })
        return
      }
      
      addLog("✅ Profile access successful!")
      addLog(`Profile status: ${profile.status}`)
      addLog(`Profile role: ${profile.role}`)
      
      setResult({ 
        success: true, 
        user: data.user,
        profile: profile 
      })
      
      addLog("🎉 Login test completed successfully!")
      
    } catch (err: any) {
      addLog(`❌ Unexpected error: ${err.message}`)
      setResult({ success: false, error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Login Debug Tool</CardTitle>
            <CardDescription>
              Test the login functionality and see detailed logs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@crm.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123456"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={testLogin} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Testing..." : "Test Login"}
              </Button>
              <Button 
                onClick={clearLogs} 
                variant="outline"
                disabled={loading}
              >
                Clear Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className={result.success ? "text-green-600" : "text-red-600"}>
                {result.success ? "✅ Login Successful" : "❌ Login Failed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📋 Debug Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-auto">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>🔧 Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>If login fails:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Check if the development server is running (<code>npm run dev</code>)</li>
              <li>Verify environment variables are set correctly</li>
              <li>Check browser console for JavaScript errors</li>
              <li>Try clearing browser cache and cookies</li>
              <li>Test in an incognito/private window</li>
            </ul>
            
            <p className="pt-4"><strong>If login succeeds here but not in the main app:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Check for hydration errors in browser console</li>
              <li>Look for JavaScript errors during form submission</li>
              <li>Verify the main login form is working correctly</li>
              <li>Check if middleware is blocking requests</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

