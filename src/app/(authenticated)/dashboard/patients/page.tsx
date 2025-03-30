import { getDoctorById } from "@/actions/doctor"
import { getPatientsByDoctorId } from "@/actions/patient"
import { DataTable } from "@/components/reusable/DataTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import getUser from "@/utils/supabase/server"
import { Doctor, Patient } from "@prisma/client"
import { UserPlus2Icon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { columns } from "./columns"

const PatientDataTable = async ({ doctorId }: { doctorId: string }) => {
  const patients: Patient[] = await getPatientsByDoctorId(doctorId)
  return <DataTable columns={columns} data={patients} />
}

const DoctorHeader = ({ doctor }: { doctor: Doctor }) => {
  return (
    <div className="my-8 flex flex-row justify-between">
      <div className="flex flex-col">
        <h1 className="font-bold text-2xl">{doctor.name}'s Patients</h1>
        <p className="text-muted-foreground">
          Manage your patient records, review histories, and track appointments
          in one place.
        </p>
      </div>

      <Button asChild>
        <Link href="/dashboard/patients/new">
          <UserPlus2Icon />
          Add Patient
        </Link>
      </Button>
    </div>
  )
}

export default async function Patients() {
  const user = await getUser()

  if (!user) redirect("/auth/login")

  const userData: Doctor | null = await getDoctorById(user.id)

  if (!userData) redirect("/auth/login")

  return (
    <div className="">
      <DoctorHeader doctor={userData} />
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
        <PatientDataTable doctorId={user.id} />
      </Suspense>
    </div>
  )
}
