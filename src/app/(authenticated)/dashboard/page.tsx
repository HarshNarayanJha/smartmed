import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { prisma } from "@/db/prisma"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import { ActivityIcon, UserPlus2Icon, Users } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userData: Doctor | null = await prisma.doctor.findUnique({
    where: {
      id: user.id
    }
  })

  if (!userData) redirect("/auth/login")

  const patientsCount = await prisma.patient.count({
    where: {
      doctorId: user.id
    }
  })

  const curedPatientsCount = await prisma.patient.count({
    where: {
      doctorId: user.id
      // cured: true
    }
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">
          Welcome, {userData.name.includes("Dr.") ? "" : "Dr. "}
          {userData.name}
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/patients">
          <Card className="scale-100 transition-transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{patientsCount}</div>
              <p className="text-muted-foreground text-xs">
                Registered patients
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/patients?cured=true">
          <Card className="scale-100 transition-transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium">Cured Patients</CardTitle>
              <UserPlus2Icon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{curedPatientsCount}</div>
              <p className="text-muted-foreground text-xs">Cured patients</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium">Schedule Status</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Your upcoming appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-6 text-center text-muted-foreground">
              No upcoming appointments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
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
      </div>
    </div>
  )
}
