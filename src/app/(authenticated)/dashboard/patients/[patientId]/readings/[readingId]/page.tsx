import { getDoctorById } from "@/actions/doctor"
import { getPatientById } from "@/actions/patient"
import { getReadingById } from "@/actions/reading"
import { getReportById } from "@/actions/report"
import DeleteReadingButton from "@/components/dashboard/DeleteReadingButton"
import GenerateReportButton from "@/components/dashboard/GenerateReportButton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { calculateBmi, formatDateTime } from "@/lib/utils"
import getUser from "@/utils/supabase/server"
import { Doctor, Patient, Reading, Report } from "@prisma/client"
import {
  Activity,
  Droplet,
  Gauge,
  HeartPulse,
  type LucideIcon,
  Percent,
  Ruler,
  Scale,
  Sparkles,
  Thermometer,
  Wind
} from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

export async function generateMetadata({
  params
}: { params: Promise<{ patientId: string }> }): Promise<Metadata> {
  const { patientId } = await params
  const patient: Patient = await getPatientById(patientId)

  return {
    title: `Reading for ${patient.name} | SmartMed`
  }
}

export default async function ReadingPage({
  params
}: { params: Promise<{ patientId: string; readingId: string }> }) {
  const { patientId, readingId } = await params

  const user = await getUser()
  if (!user) redirect("/auth/login")

  const doctor: Doctor | null = await getDoctorById(user.id)
  if (!doctor) redirect("/auth/login")

  const reading: Reading | null = await getReadingById(readingId)
  const patient: Patient | null = await getPatientById(patientId)
  const report: Report | null = await getReportById(readingId)

  if (!reading) {
    notFound()
  }

  if (!patient) {
    notFound()
  }

  return (
    <>
      {pageBreadcrumbs(patientId, patient.name, reading.id)}
      <div className="container mx-auto max-w-4xl">
        <Suspense fallback={<ReadingSkeleton />}>
          <Card className="mb-8 overflow-hidden shadow-lg">
            <CardHeader className="flex flex-row justify-between border-b">
              <div>
                <CardTitle className="font-bold font-title text-2xl text-primary">
                  {patient.name}'s Reading Details
                </CardTitle>
                <CardDescription className="pt-1 text-muted-foreground">
                  <span className="font-medium">Diagnosed for:</span>{" "}
                  {reading.diagnosedFor} <br />
                  <span className="font-medium">Recorded on:</span>{" "}
                  {formatDateTime(reading.createdAt)}
                </CardDescription>
              </div>
              <div>
                {report ? (
                  <Button asChild>
                    <Link
                      href={`/dashboard/patients/${patient.id}/reports/${report.id}`}
                    >
                      View Report
                    </Link>
                  </Button>
                ) : (
                  <GenerateReportButton
                    doctorId={doctor.id}
                    patient={patient}
                    reading={reading}
                    slot={
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    }
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold text-foreground text-lg">
                Vital Signs & Measurements
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ReadingItem
                  Icon={Thermometer}
                  title="Temperature"
                  value={
                    reading.temperature ? `${reading.temperature} °C` : "N/A"
                  }
                  hoverColor="hover:bg-red-100 dark:hover:bg-red-900/30"
                />
                <ReadingItem
                  Icon={HeartPulse}
                  title="Heart Rate"
                  value={reading.heartRate ? `${reading.heartRate} bpm` : "N/A"}
                  hoverColor="hover:bg-pink-100 dark:hover:bg-pink-900/30"
                />
                <ReadingItem
                  Icon={Activity}
                  title="Blood Pressure"
                  value={
                    reading.bpSystolic && reading.bpDiastolic
                      ? `${reading.bpSystolic}/${reading.bpDiastolic} mmHg`
                      : "N/A"
                  }
                  hoverColor="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                />
                <ReadingItem
                  Icon={Wind}
                  title="Respiratory Rate"
                  value={
                    reading.respiratoryRate
                      ? `${reading.respiratoryRate} breaths/min`
                      : "N/A"
                  }
                  hoverColor="hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
                />
                <ReadingItem
                  Icon={Percent}
                  title="Oxygen Saturation"
                  value={
                    reading.oxygenSaturation
                      ? `${reading.oxygenSaturation}%`
                      : "N/A"
                  }
                  hoverColor="hover:bg-sky-100 dark:hover:bg-sky-900/30"
                />
                <ReadingItem
                  Icon={Droplet}
                  title="Glucose Level"
                  value={
                    reading.glucoseLevel
                      ? `${reading.glucoseLevel} mg/dL`
                      : "N/A"
                  }
                  hoverColor="hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                />
                <ReadingItem
                  Icon={Ruler}
                  title="Height"
                  value={reading.height ? `${reading.height} cm` : "N/A"}
                  hoverColor="hover:bg-green-100 dark:hover:bg-green-900/30"
                />
                <ReadingItem
                  Icon={Scale}
                  title="Weight"
                  value={reading.weight ? `${reading.weight} kg` : "N/A"}
                  hoverColor="hover:bg-amber-100 dark:hover:bg-amber-900/30"
                />
                <ReadingItem
                  Icon={Gauge}
                  title="BMI"
                  value={
                    reading.weight && reading.height
                      ? `${calculateBmi(reading.weight, reading.height)} kg/m²`
                      : "N/A"
                  }
                  hoverColor="hover:bg-orange-100 dark:hover:bg-orange-900/30"
                />
              </div>
            </CardContent>
          </Card>
          <DeleteReadingButton reading={reading} />
        </Suspense>
      </div>
    </>
  )
}

function ReadingSkeleton() {
  const skeletonItems = 8 // Number of ReadingItems
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="border-b bg-muted/50">
          <Skeleton className="h-8 w-3/5 rounded" />
          <Skeleton className="mt-2 h-4 w-4/5 rounded" />
          <Skeleton className="mt-1 h-4 w-2/5 rounded" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="mb-4 h-6 w-1/3 rounded" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(skeletonItems)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 rounded-lg border bg-background p-4"
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-5 w-1/2 rounded" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ReadingItemProps {
  Icon: LucideIcon
  title: string
  value: string | number | null | undefined
  hoverColor?: string
}

function ReadingItem({
  Icon,
  title,
  value,
  hoverColor = "hover:bg-muted/50"
}: ReadingItemProps) {
  const displayValue = value ?? "N/A"
  return (
    <div
      className={`flex items-center space-x-4 rounded-lg border bg-background p-4 transition-colors ${hoverColor}`}
    >
      <Icon className="h-7 w-7 flex-shrink-0 text-primary" strokeWidth={1.5} />
      <div className="flex-1">
        <h3 className="font-medium text-muted-foreground text-sm">{title}</h3>
        <p className="font-semibold text-foreground text-lg">{displayValue}</p>
      </div>
    </div>
  )
}

function pageBreadcrumbs(
  patientId: string,
  patientName: string,
  readingName: string
) {
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
          <BreadcrumbPage>{readingName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
