"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Lightbulb, AlertTriangle, TrendingUp, Mail, Loader2 } from "lucide-react"

interface AIInsightsPanelProps {
  entityType: "contact" | "deal" | "company"
  entityId: string
  entityData: any
  onEmailGenerated?: (email: string) => void
}

export default function AIInsightsPanel({ entityType, entityId, entityData, onEmailGenerated }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailContext, setEmailContext] = useState("")
  const [emailPurpose, setEmailPurpose] = useState<"follow_up" | "proposal" | "check_in" | "introduction">("follow_up")

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: entityType,
          id: entityId,
          data: entityData,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateEmail = async () => {
    if (!emailContext.trim()) return

    setEmailLoading(true)
    try {
      const response = await fetch("/api/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: entityType === "contact" ? entityId : entityData.contact_id,
          context: emailContext,
          purpose: emailPurpose,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onEmailGenerated?.(data.email)
      }
    } catch (error) {
      console.error("Error generating email:", error)
    } finally {
      setEmailLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [entityId])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700"
    if (score >= 60) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span>AI Insights</span>
        </CardTitle>
        <CardDescription>AI-powered analysis and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="email">Email Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            {insights && (
              <>
                {/* Score */}
                {(insights.leadScore || insights.winProbability || insights.score) && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {entityType === "contact" && "Lead Score"}
                      {entityType === "deal" && "Win Probability"}
                      {entityType === "company" && "Company Score"}
                    </span>
                    <Badge className={getScoreColor(insights.leadScore || insights.winProbability || insights.score)}>
                      {insights.leadScore || insights.winProbability || insights.score}
                      {entityType === "deal" ? "%" : "/100"}
                    </Badge>
                  </div>
                )}

                {/* Insights */}
                {insights.insights && insights.insights.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-slate-700">Key Insights</span>
                    </div>
                    <ul className="space-y-1">
                      {insights.insights.map((insight: string, index: number) => (
                        <li key={index} className="text-sm text-slate-600 pl-6 relative">
                          <span className="absolute left-0 top-1 w-1 h-1 bg-slate-400 rounded-full"></span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Actions / Recommendations */}
                {(insights.nextActions || insights.recommendations || insights.opportunities) && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {entityType === "contact" && "Next Actions"}
                        {entityType === "deal" && "Recommendations"}
                        {entityType === "company" && "Opportunities"}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {(insights.nextActions || insights.recommendations || insights.opportunities)?.map(
                        (item: string, index: number) => (
                          <li key={index} className="text-sm text-slate-600 pl-6 relative">
                            <span className="absolute left-0 top-1 w-1 h-1 bg-green-400 rounded-full"></span>
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Risk Factors / Challenges */}
                {(insights.riskFactors || insights.riskAssessment || insights.challenges) && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {entityType === "contact" && "Risk Factors"}
                        {entityType === "deal" && "Risk Assessment"}
                        {entityType === "company" && "Challenges"}
                      </span>
                    </div>
                    {insights.riskAssessment ? (
                      <p className="text-sm text-slate-600 pl-6">{insights.riskAssessment}</p>
                    ) : (
                      <ul className="space-y-1">
                        {(insights.riskFactors || insights.challenges)?.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-slate-600 pl-6 relative">
                            <span className="absolute left-0 top-1 w-1 h-1 bg-red-400 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Email Purpose</label>
                <select
                  value={emailPurpose}
                  onChange={(e) => setEmailPurpose(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="follow_up">Follow Up</option>
                  <option value="proposal">Proposal</option>
                  <option value="check_in">Check In</option>
                  <option value="introduction">Introduction</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Context</label>
                <Textarea
                  value={emailContext}
                  onChange={(e) => setEmailContext(e.target.value)}
                  placeholder="Provide context for the email (e.g., recent meeting, proposal sent, etc.)"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <Button onClick={generateEmail} disabled={!emailContext.trim() || emailLoading} className="w-full">
                {emailLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Generate Email
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
