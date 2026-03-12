import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Deal {
  id: string
  title: string
  company_name: string
  value: number
  stage: string
  probability: number
  expected_close_date: string
}

interface DealsPipelineProps {
  deals: Deal[]
}

const stageColors = {
  prospecting: "bg-slate-100 text-slate-700",
  qualification: "bg-blue-100 text-blue-700",
  proposal: "bg-yellow-100 text-yellow-700",
  negotiation: "bg-orange-100 text-orange-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
}

export default function DealsPipeline({ deals }: DealsPipelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Deals</CardTitle>
        <CardDescription>Your current sales pipeline</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deals.map((deal) => (
            <div key={deal.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{deal.title}</h4>
                  <p className="text-sm text-slate-600">{deal.company_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">${deal.value.toLocaleString()}</p>
                  <Badge className={stageColors[deal.stage as keyof typeof stageColors] || stageColors.prospecting}>
                    {deal.stage.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Probability</span>
                  <span className="font-medium">{deal.probability}%</span>
                </div>
                <Progress value={deal.probability} className="h-2" />
              </div>
              <p className="text-xs text-slate-500">
                Expected close: {new Date(deal.expected_close_date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
