import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Building2, Target, DollarSign } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
}

function StatsCard({ title, value, change, changeType, icon }: StatsCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-slate-600",
  }[changeType]

  const TrendIcon = changeType === "positive" ? TrendingUp : TrendingDown

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="text-slate-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className={`flex items-center text-xs ${changeColor}`}>
          {changeType !== "neutral" && <TrendIcon className="mr-1 h-3 w-3" />}
          {change}
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  stats: {
    totalContacts: number
    totalCompanies: number
    activeDeals: number
    totalRevenue: number
    contactsChange: string
    companiesChange: string
    dealsChange: string
    revenueChange: string
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Contacts"
        value={stats.totalContacts.toLocaleString()}
        change={stats.contactsChange}
        changeType="positive"
        icon={<Users className="h-4 w-4" />}
      />
      <StatsCard
        title="Companies"
        value={stats.totalCompanies.toLocaleString()}
        change={stats.companiesChange}
        changeType="positive"
        icon={<Building2 className="h-4 w-4" />}
      />
      <StatsCard
        title="Active Deals"
        value={stats.activeDeals.toLocaleString()}
        change={stats.dealsChange}
        changeType="positive"
        icon={<Target className="h-4 w-4" />}
      />
      <StatsCard
        title="Pipeline Value"
        value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
        change={stats.revenueChange}
        changeType="positive"
        icon={<DollarSign className="h-4 w-4" />}
      />
    </div>
  )
}
