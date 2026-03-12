import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { type, dateRange, metrics, format, filters } = await request.json()

    // Get authenticated user
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch data based on report type and filters
    let reportData: any = {}

    switch (type) {
      case "sales_performance":
        const { data: deals } = await supabase
          .from("deals")
          .select(`
            *,
            companies (name),
            contacts (first_name, last_name)
          `)
          .gte("created_at", dateRange?.from || "2024-01-01")
          .lte("created_at", dateRange?.to || "2024-12-31")

        reportData = {
          title: "Sales Performance Report",
          deals: deals || [],
          summary: {
            totalDeals: deals?.length || 0,
            totalValue: deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0,
            avgDealSize: deals?.length ? deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length : 0,
            winRate: deals?.length ? (deals.filter((d) => d.stage === "closed_won").length / deals.length) * 100 : 0,
          },
        }
        break

      case "pipeline_analysis":
        const { data: pipelineDeals } = await supabase
          .from("deals")
          .select("*")
          .not("stage", "in", '("closed_won","closed_lost")')

        reportData = {
          title: "Pipeline Analysis Report",
          pipeline: pipelineDeals || [],
          stageBreakdown: {
            prospecting: pipelineDeals?.filter((d) => d.stage === "prospecting").length || 0,
            qualification: pipelineDeals?.filter((d) => d.stage === "qualification").length || 0,
            proposal: pipelineDeals?.filter((d) => d.stage === "proposal").length || 0,
            negotiation: pipelineDeals?.filter((d) => d.stage === "negotiation").length || 0,
          },
        }
        break

      case "ai_insights":
        const { data: aiInsights } = await supabase
          .from("ai_insights")
          .select("*")
          .gte("created_at", dateRange?.from || "2024-01-01")
          .lte("created_at", dateRange?.to || "2024-12-31")

        reportData = {
          title: "AI Insights Report",
          insights: aiInsights || [],
          summary: {
            totalInsights: aiInsights?.length || 0,
            avgConfidence: aiInsights?.length
              ? aiInsights.reduce((sum, insight) => sum + (insight.confidence_score || 0), 0) / aiInsights.length
              : 0,
          },
        }
        break

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Generate the actual report file (PDF, Excel, CSV)
    // 2. Store it temporarily or send it directly
    // 3. Return download URL or file data

    return NextResponse.json({
      success: true,
      reportId: `report_${Date.now()}`,
      data: reportData,
      downloadUrl: `/api/reports/download/${type}_${Date.now()}.${format}`,
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 })
  }
}
