import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Calendar, FileText, Users } from "lucide-react"

interface Activity {
  id: string
  type: "call" | "email" | "meeting" | "note" | "task" | "demo"
  subject: string
  contact_name: string
  company_name: string
  created_at: string
  completed: boolean
}

interface RecentActivitiesProps {
  activities: Activity[]
}

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  task: FileText,
  demo: Users,
}

const activityColors = {
  call: "bg-blue-100 text-blue-700",
  email: "bg-green-100 text-green-700",
  meeting: "bg-purple-100 text-purple-700",
  note: "bg-yellow-100 text-yellow-700",
  task: "bg-orange-100 text-orange-700",
  demo: "bg-pink-100 text-pink-700",
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest interactions with your contacts and deals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]
            const colorClass = activityColors[activity.type]

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 truncate">{activity.subject}</p>
                    {activity.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    {activity.contact_name} • {activity.company_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(activity.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
