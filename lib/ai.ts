import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface ContactAnalysis {
  leadScore: number
  insights: string[]
  nextActions: string[]
  riskFactors: string[]
}

export interface DealAnalysis {
  winProbability: number
  insights: string[]
  recommendations: string[]
  riskAssessment: string
}

export interface CompanyAnalysis {
  score: number
  insights: string[]
  opportunities: string[]
  challenges: string[]
}

export async function analyzeContact(contact: any, company: any, activities: any[]): Promise<ContactAnalysis> {
  try {
    // Input validation and sanitization
    if (!contact || typeof contact !== 'object') {
      throw new Error('Invalid contact data')
    }

    // Sanitize contact data
    const sanitizedContact = {
      first_name: String(contact.first_name || '').trim().substring(0, 100),
      last_name: String(contact.last_name || '').trim().substring(0, 100),
      job_title: String(contact.job_title || '').trim().substring(0, 200),
      department: String(contact.department || '').trim().substring(0, 100),
      lead_source: String(contact.lead_source || '').trim().substring(0, 100)
    }

    // Sanitize company data
    const sanitizedCompany = company ? {
      name: String(company.name || '').trim().substring(0, 200),
      industry: String(company.industry || '').trim().substring(0, 100),
      size_category: String(company.size_category || '').trim().substring(0, 50)
    } : null

    // Limit activities array size
    const limitedActivities = Array.isArray(activities) ? activities.slice(0, 50) : []

    const prompt = `
Analyze this sales contact and provide insights:

Contact: ${sanitizedContact.first_name} ${sanitizedContact.last_name}
Title: ${sanitizedContact.job_title || "Unknown"}
Department: ${sanitizedContact.department || "Unknown"}
Company: ${sanitizedCompany?.name || "Unknown"}
Industry: ${sanitizedCompany?.industry || "Unknown"}
Company Size: ${sanitizedCompany?.size_category || "Unknown"}
Lead Source: ${sanitizedContact.lead_source || "Unknown"}
Recent Activities: ${limitedActivities.length} interactions

Based on this information, provide:
1. Lead score (0-100)
2. Key insights about this contact
3. Recommended next actions
4. Potential risk factors

Respond in JSON format:
{
  "leadScore": number,
  "insights": ["insight1", "insight2"],
  "nextActions": ["action1", "action2"],
  "riskFactors": ["risk1", "risk2"]
}
`

    const { text } = await groq.generateText({
      model: "llama-3.1-70b-versatile",
      prompt,
      temperature: 0.3,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing contact:", error)
    return {
      leadScore: 50,
      insights: ["Analysis unavailable"],
      nextActions: ["Follow up with contact"],
      riskFactors: ["No specific risks identified"],
    }
  }
}

export async function analyzeDeal(deal: any, contact: any, company: any, activities: any[]): Promise<DealAnalysis> {
  try {
    const prompt = `
Analyze this sales deal and provide insights:

Deal: ${deal.title}
Value: ${deal.currency} ${deal.value || 0}
Stage: ${deal.stage}
Current Probability: ${deal.probability}%
Expected Close: ${deal.expected_close_date || "Not set"}
Company: ${company?.name || "Unknown"}
Industry: ${company?.industry || "Unknown"}
Company Size: ${company?.size_category || "Unknown"}
Contact: ${contact?.first_name} ${contact?.last_name} (${contact?.job_title || "Unknown"})
Recent Activities: ${activities.length} interactions
Description: ${deal.description || "No description"}

Based on this information, provide:
1. Realistic win probability (0-100)
2. Key insights about the deal
3. Specific recommendations to improve chances
4. Risk assessment summary

Respond in JSON format:
{
  "winProbability": number,
  "insights": ["insight1", "insight2"],
  "recommendations": ["rec1", "rec2"],
  "riskAssessment": "summary of risks"
}
`

    const { text } = await groq.generateText({
      model: "llama-3.1-70b-versatile",
      prompt,
      temperature: 0.3,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing deal:", error)
    return {
      winProbability: deal.probability || 50,
      insights: ["Analysis unavailable"],
      recommendations: ["Continue regular follow-up"],
      riskAssessment: "No specific risks identified",
    }
  }
}

export async function analyzeCompany(company: any, contacts: any[], deals: any[]): Promise<CompanyAnalysis> {
  try {
    const totalDealValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
    const activeDealCount = deals.filter((deal) => !["closed_won", "closed_lost"].includes(deal.stage)).length

    const prompt = `
Analyze this company for sales opportunities:

Company: ${company.name}
Industry: ${company.industry || "Unknown"}
Size: ${company.size_category || "Unknown"}
Annual Revenue: ${company.annual_revenue ? `$${company.annual_revenue.toLocaleString()}` : "Unknown"}
Website: ${company.website || "Unknown"}
Contacts: ${contacts.length} people
Active Deals: ${activeDealCount} deals worth $${totalDealValue.toLocaleString()}
Notes: ${company.notes || "No notes"}

Based on this information, provide:
1. Company score (0-100) for sales potential
2. Key insights about the company
3. Potential opportunities
4. Challenges to consider

Respond in JSON format:
{
  "score": number,
  "insights": ["insight1", "insight2"],
  "opportunities": ["opp1", "opp2"],
  "challenges": ["challenge1", "challenge2"]
}
`

    const { text } = await groq.generateText({
      model: "llama-3.1-70b-versatile",
      prompt,
      temperature: 0.3,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing company:", error)
    return {
      score: 50,
      insights: ["Analysis unavailable"],
      opportunities: ["Explore additional services"],
      challenges: ["No specific challenges identified"],
    }
  }
}

export async function generateEmailSuggestion(
  contact: any,
  company: any,
  context: string,
  purpose: "follow_up" | "proposal" | "check_in" | "introduction",
): Promise<string> {
  try {
    const prompt = `
Generate a professional sales email for:

To: ${contact.first_name} ${contact.last_name} (${contact.job_title || "Unknown"})
Company: ${company?.name || "Unknown"}
Industry: ${company?.industry || "Unknown"}
Purpose: ${purpose.replace("_", " ")}
Context: ${context}

Write a personalized, professional email that:
- Uses the contact's name and company
- References their industry/role appropriately
- Has a clear call-to-action
- Is concise and engaging
- Follows sales best practices

Return only the email content (subject and body).
`

    const { text } = await groq.generateText({
      model: "llama-3.1-70b-versatile",
      prompt,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating email:", error)
    return "Unable to generate email suggestion at this time."
  }
}
