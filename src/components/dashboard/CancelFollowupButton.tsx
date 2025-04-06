"use client"

import { unscheduleFollowupById } from "@/actions/report"
import { Button } from "@/components/ui/button"
import { Report } from "@prisma/client"
import { Loader2, X } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

export default function CancelFollowupButton({ report }: { report: Report }) {
  const [isPending, startTransition] = useTransition()

  const handleCancel = async () => {
    startTransition(async () => {
      try {
        await unscheduleFollowupById(report.jobId, report.id)
        toast.success("Followup cancelled", {
          description: "The followup schedule has been successfully cancelled."
        })
      } catch (error) {
        toast.error("Error", {
          description: "Failed to cancel followup schedule. Please try again."
        })
        console.error("Error cancelling followup:", error)
      }
    })
  }

  if (!report.followupSchedule) return null

  return (
    <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <X className="mr-2 h-4 w-4" />
      )}
      {isPending ? "Cancelling..." : "Cancel Followup Schedule"}
    </Button>
  )
}
