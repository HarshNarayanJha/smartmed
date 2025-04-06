"use client"

import { createReport, generateReport } from "@/actions/report"
import { Button } from "@/components/ui/button"
import { Patient, Reading, Report, UrgencyLevel } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

interface GenerateReportButtonProps {
  slot: React.ReactNode
  reading: Reading
  doctorId: string
  patient: Patient
}

export default function GenerateReportButton({
  slot,
  reading,
  patient,
  doctorId
}: GenerateReportButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const { data } = await generateReport(reading, patient)

        console.log("Response Generated")
        console.log("Saving response into db")

        const report: Report = await createReport(
          {
            ...data,
            urgencyLevel: data.urgencyLevel.toUpperCase() as UrgencyLevel,
            id: reading.id,
            patientId: patient.id,
            doctorId
          },
          reading.diagnosedFor
        )

        router.push(`/dashboard/patients/${patient.id}/reports/${report.id}`)

        toast.success("Report Generated", {
          description: `Report for this reading has been generated successfully. It will open automatically.`
        })
      } catch (error) {
        toast.error("Error", {
          description: `There was an error in generating the report. ${error.message}`
        })
      }
    })
  }

  return (
    <Button onClick={handleGenerate} disabled={isPending}>
      {isPending ? <Loader2 className="animate-spin" /> : slot}
    </Button>
  )
}
