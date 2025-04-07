import { getPatientById } from "@/actions/patient"
import { PatientReadingsForm } from "@/components/dashboard/PatientReadingsForm"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Patient } from "@prisma/client"
import { Metadata } from "next"
import Link from "next/link"

export async function generateMetadata({
  params
}: { params: { patientId: string } }): Promise<Metadata> {
  const patient: Patient = await getPatientById(params.patientId)

  return {
    title: `New Reading for ${patient.name} | SmartMed`
  }
}

export default async function NewPatientReadingPage({
  params
}: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const patient: Patient | null = await getPatientById(patientId)

  if (!patient) {
    throw new Error("Patient not found")
  }

  return (
    <div className="container mx-auto px-4">
      {pageBreadcrumbs(patientId, patient.name)}

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

function pageBreadcrumbs(patientId: string, patientName: string) {
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard/patients">Patients</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/dashboard/patients/${patientId}`}>{patientName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/dashboard/patients/${patientId}/readings`}>
              Readings
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>New</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
