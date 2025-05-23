import { getDoctorById } from "@/actions/doctor"
import {
  getCuredPatientsCountByDoctorId,
  getPatientsCountByDoctorId
} from "@/actions/patient"
import { getNumReadingsByDoctorId } from "@/actions/reading"
import { getNumReportsByDoctorId } from "@/actions/report"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import {
  ActivityIcon,
  HeartPulse,
  NotebookIcon,
  UserPlus2Icon,
  Users
} from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard | SmartMed",
    description: "Your SmartMed Dashboard."
  }
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userData: Doctor | null = await getDoctorById(user.id)

  if (!userData) redirect("/auth/login")

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">Welcome, Dr. {userData.name}</h1>
        <p className="text-muted-foreground">{formatDate(new Date())}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <PatientCard userId={user.id} />
        </Suspense>

        <Suspense fallback={<CardSkeleton />}>
          <CuredPatientCard userId={user.id} />
        </Suspense>

        <Suspense fallback={<CardSkeleton />}>
          <ReportsCard userId={user.id} />
        </Suspense>

        <Suspense fallback={<CardSkeleton />}>
          <ReadingsCard userId={user.id} />
        </Suspense>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium font-title">
              Schedule Status
            </CardTitle>
            <ActivityIcon className="h-4 w-4 animate-pulse text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">Available</div>
            <p className="text-muted-foreground text-xs">
              Current availability
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<AppointmentsCardSkeleton />}>
          <Card>
            <CardHeader>
              <CardTitle className="font-title">Recent Appointments</CardTitle>
              <CardDescription>Your upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-6 text-center text-muted-foreground">
                No upcoming appointments
              </p>
            </CardContent>
          </Card>
        </Suspense>

        <Suspense fallback={<ActivityCardSkeleton />}>
          <Card>
            <CardHeader>
              <CardTitle className="font-title">Activity Overview</CardTitle>
              <CardDescription>
                Your activity for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">
                  Activity data will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  )
}

async function PatientCard({ userId }: { userId: string }) {
  const patientsCount = await getPatientsCountByDoctorId(userId)

  return (
    <Link href="/dashboard/patients">
      <Card className="scale-100 transition-transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium font-title">Patients</CardTitle>
          <Users className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{patientsCount}</div>
          <p className="text-muted-foreground text-xs">Registered patients</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function CardSkeleton() {
  return (
    <Card className="scale-100 transition-transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-1 h-8 w-12" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

async function CuredPatientCard({ userId }: { userId: string }) {
  const curedPatientsCount = await getCuredPatientsCountByDoctorId(userId)

  return (
    <Link href="/dashboard/patients?cured=true">
      <Card className="scale-100 transition-transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium font-title">
            Cured Patients
          </CardTitle>
          <UserPlus2Icon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{curedPatientsCount}</div>
          <p className="text-muted-foreground text-xs">Cured patients</p>
        </CardContent>
      </Card>
    </Link>
  )
}

async function ReportsCard({ userId }: { userId: string }) {
  const reportsCount = await getNumReportsByDoctorId(userId)

  return (
    <Link href="/dashboard/reports">
      <Card className="scale-100 transition-transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium font-title">
            Reports Generated
          </CardTitle>
          <NotebookIcon className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{reportsCount}</div>
          <p className="text-muted-foreground text-xs">
            Total Reports Generated
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

async function ReadingsCard({ userId }: { userId: string }) {
  const readingsCount = await getNumReadingsByDoctorId(userId)

  return (
    <Card className="scale-100 transition-transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-medium font-title">Readings Taken</CardTitle>
        <HeartPulse className="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{readingsCount}</div>
        <p className="text-muted-foreground text-xs">Total Readings Taken</p>
      </CardContent>
    </Card>
  )
}

function AppointmentsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="mb-2 h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-6">
          <Skeleton className="h-5 w-48" />
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="mb-2 h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-center justify-center">
          <Skeleton className="h-5 w-48" />
        </div>
      </CardContent>
    </Card>
  )
}
