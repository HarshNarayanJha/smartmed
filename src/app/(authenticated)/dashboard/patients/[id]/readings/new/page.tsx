// import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import { PatientReadingsForm } from "@/components/dashboard/PatientReadingsForm"

export default function NewPatientReadingPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* <Breadcrumb className="mb-6">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/patients">Patients</Breadcrumb.Item>
        <Breadcrumb.Item>New Reading</Breadcrumb.Item>
      </Breadcrumb> */}

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
          <PatientReadingsForm />
        </CardContent>
      </Card>
    </div>
  )
}
