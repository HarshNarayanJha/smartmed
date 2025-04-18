import { DoctorWithReports, getDoctorByIdWithReports } from "@/actions/doctor"
import { DataTable } from "@/components/reusable/DataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import getUser from "@/utils/supabase/server"
import { Eye } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { columns } from "./columns"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Reports generated by you | SmartMed`
  }
}

export default async function PatientReadingsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const doctor: DoctorWithReports | null = await getDoctorByIdWithReports(
    user.id
  )

  if (!doctor) redirect("/auth/login")

  if (doctor.reports.length === 0) {
    return (
      <>
        {pageBreadcrumbs()}
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
      </>
    )
  }

  return (
    <div className="container mx-auto">
      {pageBreadcrumbs()}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
              alt={doctor.name}
            />
            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-3xl">Reports by Dr. {doctor.name}</h1>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={doctor.reports} />
    </div>
  )
}

function pageBreadcrumbs() {
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
          <BreadcrumbPage>Reports</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
