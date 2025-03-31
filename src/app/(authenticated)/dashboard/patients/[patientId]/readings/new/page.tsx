import { getPatientById } from "@/actions/patient"
import { PatientReadingsForm } from "@/components/dashboard/PatientReadingsForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Patient } from "@prisma/client"

export default async function NewPatientReadingPage({
  params
}: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const patient: Patient | null = await getPatientById(patientId)

  if (!patient) {
    throw new Error("Patient not found")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">New Reading for {patient.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-xl">Medical Readings</h2>
          <p className="text-muted-foreground">
            Enter the latest medical readings for {patient.name}
          </p>
        </CardHeader>
        <CardContent>
          <PatientReadingsForm patientId={patientId} />
        </CardContent>
      </Card>
    </div>
  )
}
