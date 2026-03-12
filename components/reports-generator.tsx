"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Mail, Calendar, Loader2 } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface ReportsGeneratorProps {
  onGenerateReport: (config: ReportConfig) => void
}

interface ReportConfig {
  type: string
  dateRange: DateRange | undefined
  metrics: string[]
  format: string
  filters: {
    stage?: string
    leadSource?: string
    assignedTo?: string
  }
}

const reportTypes = [
  { value: "sales_performance", label: "Sales Performance Report" },
  { value: "pipeline_analysis", label: "Pipeline Analysis Report" },
  { value: "lead_conversion", label: "Lead Conversion Report" },
  { value: "ai_insights", label: "AI Insights Report" },
  { value: "activity_summary", label: "Activity Summary Report" },
]

const availableMetrics = [
  { id: "revenue", label: "Revenue" },
  { id: "deal_count", label: "Deal Count" },
  { id: "conversion_rate", label: "Conversion Rate" },
  { id: "avg_deal_size", label: "Average Deal Size" },
  { id: "sales_cycle", label: "Sales Cycle Length" },
  { id: "ai_scores", label: "AI Scores" },
  { id: "activity_count", label: "Activity Count" },
  { id: "lead_sources", label: "Lead Sources" },
]

export default function ReportsGenerator({ onGenerateReport }: ReportsGeneratorProps) {
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [format, setFormat] = useState("pdf")
  const [loading, setLoading] = useState(false)

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics((prev) => (prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]))
  }

  const handleGenerateReport = async () => {
    if (!reportType || selectedMetrics.length === 0) return

    setLoading(true)
    try {
      await onGenerateReport({
        type: reportType,
        dateRange,
        metrics: selectedMetrics,
        format,
        filters: {},
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Report Generator</span>
        </CardTitle>
        <CardDescription>Create custom reports with your CRM data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Date Range</label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        {/* Metrics Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Metrics to Include</label>
          <div className="grid grid-cols-2 gap-2">
            {availableMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={() => handleMetricToggle(metric.id)}
                />
                <label htmlFor={metric.id} className="text-sm text-slate-700">
                  {metric.label}
                </label>
              </div>
            ))}
          </div>
          {selectedMetrics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedMetrics.map((metricId) => {
                const metric = availableMetrics.find((m) => m.id === metricId)
                return (
                  <Badge key={metricId} variant="secondary" className="text-xs">
                    {metric?.label}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Export Format</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              <SelectItem value="csv">CSV Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateReport}
          disabled={!reportType || selectedMetrics.length === 0 || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>

        {/* Quick Actions */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-3 w-3" />
              Email Report
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-3 w-3" />
              Schedule Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
