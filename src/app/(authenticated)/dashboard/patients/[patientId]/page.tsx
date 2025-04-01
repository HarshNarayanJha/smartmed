import { getDoctorById } from "@/actions/doctor"
import { getPatientById } from "@/actions/patient"
import { getNumReadingsByPatientId } from "@/actions/reading"
import { getNumReportsByPatientId } from "@/actions/report"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateAge } from "@/lib/utils"
import getUser from "@/utils/supabase/server"
import { Doctor, Patient, SmokingStatus } from "@prisma/client"
import {
  Clipboard,
  Eye,
  FileText,
  Heart,
  HeartPulse,
  Mail,
  Phone,
  Plus,
  User
} from "lucide-react"
import Link from "next/link"

export default async function PatientPage({
  params
}: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const user = await getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const doctor: Doctor | null = await getDoctorById(user.id)

  if (!doctor) {
    throw new Error("Doctor not found")
  }

  const patient: Patient | null = await getPatientById(patientId)

  if (!patient || patient.doctorId !== doctor.id) {
    return (
      <div className="container mx-auto">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="">
            <p className="text-center font-medium">Patient record not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const numReports = await getNumReportsByPatientId(patient.id)
  const numReadings = await getNumReadingsByPatientId(patient.id)

  return (
    <div className="container mx-auto">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/dashboard/patients">Patients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{patient.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">Patient Information</h1>
        <div>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            ID: {patient.id.substring(0, 8)}
          </Badge>
          <Button size="sm" asChild>
            <Link href={`/dashboard/patients/${patient.id}/readings/new`}>
              <Plus />
              New Readings
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                Patient Profile
              </CardTitle>
              <Badge
                variant={patient.cured ? "default" : "secondary"}
                className={`${patient.cured ? "bg-green-700" : ""}`}
              >
                {patient.cured ? "Cured" : "Under Treatment"}
              </Badge>
            </div>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="mb-6 flex flex-col items-center">
              <Avatar className="mb-4 h-28 w-28 ring-2 ring-primary/20 ring-offset-2">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
                />
                <AvatarFallback className="bg-primary/10 text-2xl">
                  {patient.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-center font-semibold text-xl">
                {patient.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                Patient since {patient.createdAt?.toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-muted/30 p-2">
                  <Link href={`/dashboard/patients/${patient.id}/reports`}>
                    <p className="font-medium text-muted-foreground text-xs">
                      Reports
                    </p>
                    <p className="flex items-center font-semibold">
                      <FileText className="mr-1 h-4 w-4 text-primary" />
                      {numReports}
                    </p>
                  </Link>
                </div>
                <div className="rounded-md bg-muted/30 p-2">
                  <Link href={`/dashboard/patients/${patient.id}/readings`}>
                    <p className="font-medium text-muted-foreground text-xs">
                      Readings
                    </p>
                    <p className="flex items-center font-semibold">
                      <HeartPulse className="mr-1 h-4 w-4 text-primary" />
                      {numReadings}
                    </p>
                  </Link>
                </div>
              </div>

              <div className="pt-4">
                <p className="font-medium text-muted-foreground text-sm">
                  Date of Birth
                </p>
                <p className="flex justify-between">
                  {patient.dob.toLocaleDateString()}
                  <span className="text-muted-foreground text-sm">
                    {calculateAge(patient.dob)} years old
                  </span>
                </p>
              </div>
              <div className="pt-4">
                <p className="font-medium text-muted-foreground text-sm">
                  Gender
                </p>
                <p className="flex items-center capitalize">
                  {patient.gender.charAt(0).toUpperCase() +
                    patient.gender.slice(1).toLowerCase()}
                </p>
              </div>
              <div className="pt-4">
                <p className="font-medium text-muted-foreground text-sm">
                  Blood Group
                </p>
                <p className="flex items-center">
                  <Heart className="mr-1 h-4 w-4 text-red-500" />
                  {patient.bloodGroup}
                </p>
              </div>
              <div className="pt-4">
                <p className="font-medium text-muted-foreground text-sm">
                  Smoking Status
                </p>
                <Badge
                  variant={
                    patient.smokingStatus === SmokingStatus.NEVER
                      ? "outline"
                      : patient.smokingStatus === SmokingStatus.PAST
                        ? "secondary"
                        : "destructive"
                  }
                  className={
                    patient.smokingStatus === SmokingStatus.NEVER
                      ? "bg-green-100 font-semibold text-green-800"
                      : patient.smokingStatus === SmokingStatus.PAST
                        ? "bg-amber-100 font-semibold text-amber-800"
                        : "bg-red-400 font-semibold text-red-800"
                  }
                >
                  {patient.smokingStatus}
                </Badge>
              </div>
              <div className="pt-4">
                <p className="font-medium text-muted-foreground text-sm">
                  Contact
                </p>
                <p className="flex items-center">
                  <Phone className="mr-1 h-4 w-4 text-primary" />
                  {patient.phoneNumber}
                </p>
              </div>
              <div className="pt-4">
                <p className="font-medium text-muted-foreground text-sm">
                  Email
                </p>
                <p className="flex items-center break-words">
                  <Mail className="mr-1 h-4 w-4 text-primary" />
                  {patient.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Clipboard className="mr-2 h-5 w-5 text-primary" />
                Medical Information
              </CardTitle>
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="font-normal">
                  Last updated:{" "}
                  {patient.updatedAt?.toLocaleDateString() || "Unknown"}
                </Badge>
              </div>
            </div>
            <CardDescription>
              Complete medical profile and clinical data
            </CardDescription>
          </CardHeader>
          <Separator className="mb-2" />
          <CardContent>
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-4">
                <TabsTrigger value="history">Medical History</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
              </TabsList>

              <TabsContent value="history">
                <Card>
                  <CardContent className="p-4">
                    {patient.medicalHistory ? (
                      <div className="prose max-w-none">
                        <p>{patient.medicalHistory}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No medical history recorded.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="allergies">
                <Card>
                  <CardContent className="p-4">
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div>
                        <ul className="list-disc space-y-2 pl-6">
                          {patient.allergies
                            .split(",")
                            .map((allergy, index) => (
                              <li key={index} className="font-medium">
                                {allergy.trim()}
                              </li>
                            ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No allergies recorded.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
