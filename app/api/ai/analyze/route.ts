import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { analyzeContact, analyzeDeal, analyzeCompany } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const { type, id, data } = await request.json()

    // Get authenticated user
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let analysis

    switch (type) {
      case "contact": {
        // Fetch related data
        const [{ data: company }, { data: activities }] = await Promise.all([
          supabase.from("companies").select("*").eq("id", data.company_id).single(),
          supabase.from("activities").select("*").eq("contact_id", id).limit(10),
        ])

        analysis = await analyzeContact(data, company, activities || [])

        // Update contact AI score
        await supabase.from("contacts").update({ ai_score: analysis.leadScore }).eq("id", id)

        break
      }

      case "deal": {
        // Fetch related data
        const [{ data: company }, { data: contact }, { data: activities }] = await Promise.all([
          supabase.from("companies").select("*").eq("id", data.company_id).single(),
          supabase.from("contacts").select("*").eq("id", data.contact_id).single(),
          supabase.from("activities").select("*").eq("deal_id", id).limit(10),
        ])

        analysis = await analyzeDeal(data, contact, company, activities || [])

        // Update deal AI score and probability
        await supabase
          .from("deals")
          .update({
            ai_score: analysis.winProbability,
            probability: Math.max(analysis.winProbability, data.probability || 0),
          })
          .eq("id", id)

        break
      }

      case "company": {
        // Fetch related data
        const [{ data: contacts }, { data: deals }] = await Promise.all([
          supabase.from("contacts").select("*").eq("company_id", id),
          supabase.from("deals").select("*").eq("company_id", id),
        ])

        analysis = await analyzeCompany(data, contacts || [], deals || [])

        // Update company AI score
        await supabase.from("companies").update({ ai_score: analysis.score }).eq("id", id)

        break
      }

      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 })
    }

    // Store insights in database
    await supabase.from("ai_insights").insert({
      entity_type: type,
      entity_id: id,
      insight_type: "analysis",
      content: analysis,
      confidence_score: 0.85,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("AI analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
