import { PatientReadingsForm } from "@/components/dashboard/PatientReadingsForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default async function NewPatientReadingPage({
  params
}: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">New Patient Reading</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-xl">Medical Readings</h2>
          <p className="text-muted-foreground">
            Enter the latest medical readings for this patient
          </p>
        </CardHeader>
        <CardContent>
          <PatientReadingsForm patientId={patientId} />
        </CardContent>
      </Card>
    </div>
  )
}
