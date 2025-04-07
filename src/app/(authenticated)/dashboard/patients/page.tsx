import { DoctorWithPatients, getDoctorByIdWithPatients } from "@/actions/doctor"
import { DataTable } from "@/components/reusable/DataTable"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import getUser from "@/utils/supabase/server"
import { Doctor, Patient } from "@prisma/client"
import { UserPlus2Icon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { columns } from "./columns"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Patients | SmartMed",
    description: "Manage your patients on SmartMed."
  }
}

const PatientDataTable = async ({ patients }: { patients: Patient[] }) => {
  return <DataTable columns={columns} data={patients} />
}

const DoctorHeader = ({ doctor }: { doctor: Doctor }) => {
  return (
    <div className="my-8 flex flex-row justify-between">
      <div className="flex flex-col">
        <h1 className="mb-4 font-bold text-2xl">
          Dr. {doctor.name}'s Patient Registry
        </h1>
        <p className="text-muted-foreground">
          Comprehensive patient management portal for healthcare professionals.
          Access medical histories, appointment schedules, and treatment plans
          efficiently.
        </p>
      </div>

      <Button asChild>
        <Link href="/dashboard/patients/new">
          <UserPlus2Icon />
          Register New Patient
        </Link>
      </Button>
    </div>
  )
}

export default async function PatientsPage() {
  const user = await getUser()

  if (!user) redirect("/auth/login")

  const doctor: DoctorWithPatients | null = await getDoctorByIdWithPatients(
    user.id
  )

  if (!doctor) redirect("/auth/login")

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Patients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DoctorHeader doctor={doctor} />
      <Suspense
        fallback={
          <div className="space-y-8">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
          </div>
        }
      >
        <PatientDataTable patients={doctor.patients} />
      </Suspense>
    </div>
  )
}
