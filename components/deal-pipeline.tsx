"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Calendar, DollarSign, Building2, User } from "lucide-react"
import DealForm from "./deal-form"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Deal {
  id: string
  title: string
  company_id: string
  contact_id: string
  value: number
  currency: string
  stage: string
  probability: number
  expected_close_date: string
  lead_source: string
  description: string
  companies: {
    name: string
  } | null
  contacts: {
    first_name: string
    last_name: string
  } | null
}

interface Company {
  id: string
  name: string
}

interface Contact {
  id: string
  first_name: string
  last_name: string
  company_id: string
}

interface DealPipelineProps {
  deals: Deal[]
  companies: Company[]
  contacts: Contact[]
}

const stages = [
  { key: "prospecting", label: "Prospecting", color: "bg-slate-100 text-slate-700" },
  { key: "qualification", label: "Qualification", color: "bg-blue-100 text-blue-700" },
  { key: "proposal", label: "Proposal", color: "bg-yellow-100 text-yellow-700" },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-100 text-orange-700" },
  { key: "closed_won", label: "Closed Won", color: "bg-green-100 text-green-700" },
  { key: "closed_lost", label: "Closed Lost", color: "bg-red-100 text-red-700" },
]

export default function DealPipeline({ deals, companies, contacts }: DealPipelineProps) {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal)
    setShowForm(true)
  }

  const handleDelete = async (dealId: string) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      try {
        const { error } = await supabase.from("deals").delete().eq("id", dealId)
        if (error) throw error
        router.refresh()
      } catch (error) {
        console.error("Error deleting deal:", error)
      }
    }
  }

  const handleStageChange = async (dealId: string, newStage: string) => {
    try {
      const updateData: any = {
        stage: newStage,
        updated_at: new Date().toISOString(),
      }

      // Set close date for won/lost deals
      if (newStage === "closed_won" || newStage === "closed_lost") {
        updateData.actual_close_date = new Date().toISOString().split("T")[0]
      }

      const { error } = await supabase.from("deals").update(updateData).eq("id", dealId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error updating deal stage:", error)
    }
  }

  const getStageDeals = (stageKey: string) => {
    return deals.filter((deal) => deal.stage === stageKey)
  }

  const getStageValue = (stageKey: string) => {
    return getStageDeals(stageKey).reduce((sum, deal) => sum + (deal.value || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Sales Pipeline</h2>
          <p className="text-sm text-slate-600">Drag deals between stages or use the dropdown menu</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Add Deal</Button>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = getStageDeals(stage.key)
          const stageValue = getStageValue(stage.key)

          return (
            <div key={stage.key} className="space-y-3">
              {/* Stage Header */}
              <div className="bg-white border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{stage.label}</h3>
                  <Badge className={stage.color}>{stageDeals.length}</Badge>
                </div>
                <p className="text-sm text-slate-600">${(stageValue / 1000).toFixed(0)}K</p>
              </div>

              {/* Stage Deals */}
              <div className="space-y-3 min-h-[400px]">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium line-clamp-2">{deal.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(deal)}>
                              <Edit className="mr-2 h-3 w-3" />
                              Edit
                            </DropdownMenuItem>
                            {stages
                              .filter((s) => s.key !== deal.stage)
                              .map((targetStage) => (
                                <DropdownMenuItem
                                  key={targetStage.key}
                                  onClick={() => handleStageChange(deal.id, targetStage.key)}
                                >
                                  Move to {targetStage.label}
                                </DropdownMenuItem>
                              ))}
                            <DropdownMenuItem onClick={() => handleDelete(deal.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-3 w-3" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2 text-xs text-slate-600">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{deal.companies?.name || "No Company"}</span>
                      </div>

                      {deal.contacts && (
                        <div className="flex items-center space-x-2 text-xs text-slate-600">
                          <User className="h-3 w-3" />
                          <span className="truncate">
                            {deal.contacts.first_name} {deal.contacts.last_name}
                          </span>
                        </div>
                      )}

                      {deal.value && (
                        <div className="flex items-center space-x-2 text-sm font-medium text-slate-900">
                          <DollarSign className="h-3 w-3" />
                          <span>
                            {deal.currency} {deal.value.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {deal.probability > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Probability</span>
                            <span className="font-medium">{deal.probability}%</span>
                          </div>
                          <Progress value={deal.probability} className="h-1" />
                        </div>
                      )}

                      {deal.expected_close_date && (
                        <div className="flex items-center space-x-2 text-xs text-slate-600">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Deal Form Dialog */}
      <DealForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open)
          if (!open) setEditingDeal(null)
        }}
        companies={companies}
        contacts={contacts}
        deal={editingDeal}
      />
    </div>
  )
}
