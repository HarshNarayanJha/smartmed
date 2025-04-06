import { getDoctorById } from "@/actions/doctor"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import {
  CalendarIcon,
  GraduationCapIcon,
  HeartPulse,
  Notebook,
  UserIcon,
  UsersIcon
} from "lucide-react"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import {
  getCuredPatientsCountByDoctorId,
  getPatientsCountByDoctorId
} from "@/actions/patient"
import { getNumReadingsByDoctorId } from "@/actions/reading"
import { getNumReportsByDoctorId } from "@/actions/report"
import DeleteDoctorButton from "@/components/dashboard/DeleteDoctorButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) redirect("/")

  const doctor: Doctor | null = await getDoctorById(user.id)

  if (!doctor) redirect("/")

  return (
    <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 font-bold font-title text-3xl">Doctor Profile</h1>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Suspense fallback={<PersonalInfoSkeleton />}>
            <PersonalInfoCard doctorId={user.id} />
          </Suspense>

          <Suspense fallback={<PracticeStatsSkeleton />}>
            <PracticeStatsCard doctorId={user.id} />
          </Suspense>
        </div>
        <div className="my-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-title text-destructive">
                Danger Section
              </CardTitle>
              <CardDescription className="font-bold">
                Deleting your account is permanent and cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <DeleteDoctorButton doctor={doctor} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

const PersonalInfoCard = async ({ doctorId }: { doctorId: string }) => {
  const doctor: Doctor | null = await getDoctorById(doctorId)

  if (!doctor) return null

  const yearsOfExperience = new Date().getFullYear() - doctor.practiceStarted

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-title">Personal Information</CardTitle>
        <CardDescription>Your professional profile details</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-6 flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
              alt={doctor.name}
            />
            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-xl">{doctor.name}</h2>
            <p className="text-muted-foreground">{doctor.email}</p>
            <Badge variant="outline" className="mt-1">
              {doctor.gender}
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex items-center">
            <GraduationCapIcon className="mr-4 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Degree
              </p>
              <p>{doctor.degree}</p>
            </div>
          </div>

          <div className="flex items-center">
            <UserIcon className="mr-4 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Speciality
              </p>
              <p>{doctor.speciality}</p>
            </div>
          </div>

          <div className="flex items-center">
            <CalendarIcon className="mr-4 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Experience
              </p>
              <p>
                {yearsOfExperience} years (since {doctor.practiceStarted})
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PersonalInfoSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-60" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-6 flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-32" />
            <Skeleton className="mt-2 h-5 w-20" />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          {[1, 2, 3].map(item => (
            <div key={item} className="flex items-center">
              <Skeleton className="mr-4 h-5 w-5" />
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-1 h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const PracticeStatsCard = async ({ doctorId }: { doctorId: string }) => {
  const doctor: Doctor | null = await getDoctorById(doctorId)

  if (!doctor) return null

  const patientsCount = await getPatientsCountByDoctorId(doctor.id)
  const curedPatientsCount = await getCuredPatientsCountByDoctorId(doctor.id)
  const reportsCount = await getNumReportsByDoctorId(doctor.id)
  const readingsCount = await getNumReadingsByDoctorId(doctor.id)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-title">Practice Statistics</CardTitle>
        <CardDescription>Overview of your medical practice</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="flex items-center">
            <UsersIcon className="mr-4 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Patients</p>
              <p className="font-bold text-2xl">{patientsCount}</p>
            </div>
          </div>

          <div className="flex items-center">
            <UsersIcon className="mr-4 h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Cured Patients</p>
              <p className="font-bold text-2xl">{curedPatientsCount}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Notebook className="mr-4 h-5 w-5" />
            <div>
              <p className="font-medium text-sm">Reports Generated</p>
              <p className="font-bold text-2xl">{reportsCount}</p>
            </div>
          </div>

          <div className="flex items-center">
            <HeartPulse className="mr-4 h-5 w-5" />
            <div>
              <p className="font-medium text-sm">Readings Taken</p>
              <p className="font-bold text-2xl">{readingsCount}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-2 font-medium text-sm">Account Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Member Since</p>
                <p>{formatDate(doctor.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Last Updated</p>
                <p>{formatDate(doctor.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PracticeStatsSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-60" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-8">
          {[1, 2].map(item => (
            <div key={item} className="flex items-center">
              <Skeleton className="mr-4 h-5 w-5" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1 h-8 w-16" />
              </div>
            </div>
          ))}

          <div>
            <Skeleton className="mb-2 h-4 w-40" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1 h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1 h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
