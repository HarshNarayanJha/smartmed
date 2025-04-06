import { getDoctorById } from "@/actions/doctor"
import { getPatientById } from "@/actions/patient"
import { getReadingById } from "@/actions/reading"
import { getReportById } from "@/actions/report"
import CancelFollowupButton from "@/components/dashboard/CancelFollowupButton"
import GenerateReportButton from "@/components/dashboard/GenerateReportButton"
import ReportPDFDownloadButton from "@/components/dashboard/ReportPDFDownloadButton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { calculateAge, formatDate, formatDateTime } from "@/lib/utils"
import getUser from "@/utils/supabase/server"
import { Doctor, Patient, Reading, Report, UrgencyLevel } from "@prisma/client"
import cronstrue from "cronstrue"
import {
  Eye,
  FlaskConical,
  ListChecks,
  Microscope,
  Sparkles,
  Stethoscope,
  StickyNote,
  Text
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ReportDetailPage({
  params
}: { params: Promise<{ patientId: string; reportId: string }> }) {
  const { patientId, reportId } = await params

  const user = await getUser()
  if (!user) redirect("/auth/login")

  const doctor: Doctor | null = await getDoctorById(user.id)
  if (!doctor) redirect("/auth/login")

  if (!patientId || !reportId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Patient ID or Report ID is missing.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const [reportResult, patientResult, readingResult] = await Promise.allSettled(
    [
      getReportById(reportId),
      getPatientById(patientId),
      getReadingById(reportId)
    ]
  )

  const report: Report | null =
    reportResult.status === "fulfilled" ? reportResult.value : null
  const patient: Patient | null =
    patientResult.status === "fulfilled" ? patientResult.value : null
  const reading: Reading =
    readingResult.status === "fulfilled" ? readingResult.value : null

  if (reportResult.status === "rejected") {
    console.error("Failed to fetch report:", reportResult.reason)
  }
  if (patientResult.status === "rejected") {
    console.error("Failed to fetch patient:", patientResult.reason)
  }
  if (readingResult.status === "rejected") {
    console.error("Failed to fetch readings:", readingResult.reason)
  }

  if (!patient) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-md border border-dashed text-center">
        <h3 className="font-semibold text-lg">Patient Not Found</h3>
        <p className="text-muted-foreground text-sm">
          The patient with the provided ID could not be found.
        </p>
      </div>
    )
  }

  if (!report || !reading) {
    return (
      <>
        {pageBreadcrumbs(patientId, patient.name, "")}
        <Card className="mt-4">
          <CardContent className="py-8">
            <div className="py-4 text-center">
              <h3 className="font-semibold text-lg">
                Report Not Generated Yet
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                The report for this reading has not been generated.
              </p>
              <GenerateReportButton
                slot={
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Report Now
                  </>
                }
                reading={reading}
                patient={patient}
                doctorId={doctor.id}
              />
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  if (report.patientId !== patient.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Report Not Found</AlertTitle>
          <AlertDescription>
            The report with the provided ID could not be found.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const formatUrgency = (level: UrgencyLevel) => {
    switch (level) {
      case "LOW":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Low
          </Badge>
        )
      case "MEDIUM":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Medium
          </Badge>
        )
      case "HIGH":
        return <Badge variant="destructive">High</Badge>
      default:
        return <Badge variant="outline">{level || "N/A"}</Badge>
    }
  }

  return (
    <div className="container mx-auto space-y-8 px-4">
      {pageBreadcrumbs(patientId, patient.name, report.id)}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:gap-0">
        <h1 className="font-bold text-3xl tracking-tight">
          Medical Report Details
        </h1>
        <div className="flex items-center gap-4">
          <ReportPDFDownloadButton
            report={report}
            reading={reading}
            patient={patient}
            doctor={doctor}
          />
          <CancelFollowupButton report={report} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-title text-xl">
                    Report Overview
                  </CardTitle>
                  <CardDescription>
                    Report ID: {report.id.substring(0, 6)}
                  </CardDescription>
                </div>
                {formatUrgency(report.urgencyLevel)}
              </div>
              <div className="pt-2 text-muted-foreground text-sm">
                Generated on {formatDateTime(report.createdAt)} | Last Updated:{" "}
                {formatDateTime(report.updatedAt)}
                <br />
                {!patient.cured && report.followupSchedule && (
                  <span>
                    Scheduled: {cronstrue.toString(report.followupSchedule)}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <h3 className="mb-1 flex items-center font-semibold text-md">
                  <Text className="mr-2 h-4 w-4" /> Summary
                </h3>
                <p className="pl-6 text-sm">
                  {report.summary || "No summary provided."}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 flex items-center font-semibold text-md">
                  <Microscope className="mr-2 h-4 w-4" /> Detailed Analysis
                </h3>
                <p className="whitespace-pre-wrap pl-6 text-sm">
                  {report.detailedAnalysis || "No detailed analysis provided."}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 flex items-center font-semibold text-md">
                  <Stethoscope className="mr-2 h-4 w-4" /> Diagnosis
                </h3>
                <p className="whitespace-pre-wrap pl-6 text-sm">
                  {report.diagnosis || "No diagnosis provided."}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 flex items-center font-semibold text-md">
                  <ListChecks className="mr-2 h-4 w-4" /> Recommendations
                </h3>
                <p className="whitespace-pre-wrap pl-6 text-sm">
                  {report.recommendations || "No recommendations provided."}
                </p>
              </div>
              {report.tests && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-1 flex items-center font-semibold text-md">
                      <FlaskConical className="mr-2 h-4 w-4" /> Tests
                    </h3>
                    <p className="whitespace-pre-wrap pl-6 text-sm">
                      {report.tests}
                    </p>
                  </div>
                </>
              )}
              {report.additionalNotes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-1 flex items-center font-semibold text-md">
                      <StickyNote className="mr-2 h-4 w-4" /> Additional Notes
                    </h3>
                    <p className="whitespace-pre-wrap pl-6 text-sm">
                      {report.additionalNotes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">
                Report generated by AI based on readings by Dr. {doctor.name}{" "}
                (ID: {report.doctorId.substring(0, 6)})
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-title text-xl">
                Patient Information
              </CardTitle>
              <CardDescription>
                Patient ID: {patient.id.substring(0, 6)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {patient.name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {formatDate(patient.dob)} (
                {calculateAge(patient.dob)} y/o)
              </p>
              <p>
                <strong>Gender:</strong> {patient.gender || "N/A"}
              </p>
              <p>
                <strong>Contact:</strong> {patient.phoneNumber} /{" "}
                {patient.email}
              </p>
              <p>
                <strong>Blood Group:</strong> {patient.bloodGroup || "N/A"}
              </p>
              <p>
                <strong>Smoking Status:</strong>{" "}
                {patient.smokingStatus || "N/A"}
              </p>
              <p>
                <strong>Cured:</strong> {patient.cured ? "Yes" : "No"}
              </p>
              <Separator className="my-3" />
              <div>
                <p className="mb-1 font-semibold">Medical History:</p>
                <p className="whitespace-pre-wrap text-muted-foreground text-xs">
                  {patient.medicalHistory || "N/A"}
                </p>
              </div>
              <Separator className="my-3" />
              <div>
                <p className="mb-1 font-semibold">Allergies:</p>
                <ul className="whitespace-pre-wrap text-muted-foreground text-xs">
                  {patient.allergies
                    .split(",")
                    .map((allergy, index) => <li key={index}>{allergy}</li>) ||
                    "N/A"}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" asChild>
                <Link href={`/dashboard/patients/${patientId}`}>
                  <Eye />
                  View Patient
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-title text-xl">
                Associated Reading
              </CardTitle>
              <CardDescription>
                Reading ID: {reading.id.substring(0, 6)} (Taken:{" "}
                {formatDateTime(reading.createdAt)})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="max-w-full truncate">
                <strong>Context:</strong> {reading.diagnosedFor || "N/A"}
              </p>
              <p>
                <strong>Temp:</strong> {reading.temperature?.toFixed(1)} °C
              </p>
              <p>
                <strong>Heart Rate:</strong> {reading.heartRate} bpm
              </p>
              {reading.bpSystolic !== null && reading.bpDiastolic !== null && (
                <p>
                  <strong>BP:</strong> {reading.bpSystolic}/
                  {reading.bpDiastolic} mmHg
                </p>
              )}
              {reading.respiratoryRate !== null && (
                <p>
                  <strong>Resp. Rate:</strong> {reading.respiratoryRate}{" "}
                  breaths/min
                </p>
              )}
              {reading.oxygenSaturation !== null && (
                <p>
                  <strong>O2 Sat:</strong> {reading.oxygenSaturation}%
                </p>
              )}
              {reading.glucoseLevel !== null && (
                <p>
                  <strong>Glucose:</strong> {reading.glucoseLevel} mg/dL
                </p>
              )}
              {reading.height !== null && (
                <p>
                  <strong>Height:</strong> {reading.height} cm
                </p>
              )}
              {reading.weight !== null && (
                <p>
                  <strong>Weight:</strong> {reading.weight} kg
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button size="sm" asChild>
                <Link
                  href={`/dashboard/patients/${patientId}/readings/${reading.id}`}
                >
                  <Eye />
                  View Reading
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function pageBreadcrumbs(
  patientId: string,
  patientName: string,
  reportName: string
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
            <Link href={`/dashboard/patients/${patientId}/reports`}>
              Reports
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{reportName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
