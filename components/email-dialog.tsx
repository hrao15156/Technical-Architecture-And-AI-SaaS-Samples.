"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Copy, Send } from "lucide-react"

interface EmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export default function EmailDialog({ open, onOpenChange, email }: EmailDialogProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI-Generated Email</DialogTitle>
          <DialogDescription>Review and customize the email before sending</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea value={email} readOnly rows={12} className="font-mono text-sm" />
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Open in Email Client
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
