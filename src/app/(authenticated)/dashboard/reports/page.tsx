import { getDoctorById } from "@/actions/doctor"
import { getReportsByDoctorId } from "@/actions/report"
import { DataTable } from "@/components/reusable/DataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import getUser from "@/utils/supabase/server"
import { Doctor, Report } from "@prisma/client"
import { Eye } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { columns } from "./columns"

export default async function PatientReadingsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const doctor: Doctor | null = await getDoctorById(user.id)

  if (!doctor) redirect("/auth/login")

  const reports: Report[] = await getReportsByDoctorId(doctor.id)

  if (reports.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-md border border-dashed text-center">
        <h3 className="font-semibold text-lg">No Reports Found</h3>
        <p className="text-muted-foreground text-sm">
          You have not generated any reports yet. Generate a report for a
          patient first.
        </p>
        <Button asChild>
          <Link href={`/dashboard/patients/`}>
            <Eye />
            Your Patients
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`}
              alt={doctor.name}
            />
            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-3xl">Reports by {doctor.name}</h1>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={reports} />
    </div>
  )
}
