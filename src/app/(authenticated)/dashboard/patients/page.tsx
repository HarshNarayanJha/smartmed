import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { prisma } from "@/db/prisma"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import { PlusIcon, UserPlus2Icon } from "lucide-react"
import { redirect } from "next/navigation"
import { Patient, columns } from "./columns"
import Link from "next/link"

export default async function Patients() {
  const user = await getUser()

  if (!user) redirect("/auth/login")

  const userData: Doctor | null = await prisma.doctor.findUnique({
    where: {
      id: user.id
    }
  })

  if (!userData) redirect("/auth/login")

  const patients: Patient[] = [
    {
      id: "PT-728ED52F",
      name: "John Smith",
      age: 45,
      gender: "Male",
      condition: "Hypertension",
      lastVisit: "2023-12-15",
      email: "jsmith@example.com"
    },
    {
      id: "PT-489E1D42",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      condition: "Diabetes Type 2",
      lastVisit: "2024-01-10",
      email: "sjohnson@example.com"
    },
    {
      id: "PT-A72B4C9E",
      name: "Robert Davis",
      age: 67,
      gender: "Male",
      condition: "Arthritis",
      lastVisit: "2023-11-28",
      email: "rdavis@example.com"
    },
    {
      id: "PT-F598E2D1",
      name: "Emily Chen",
      age: 29,
      gender: "Female",
      condition: "Asthma",
      lastVisit: "2024-01-05",
      email: "echen@example.com"
    },
    {
      id: "PT-3B7D8F21",
      name: "Michael Wilson",
      age: 52,
      gender: "Male",
      condition: "Coronary Heart Disease",
      lastVisit: "2023-12-20",
      email: "mwilson@example.com"
    }
  ]

  return (
    <div className="">
      <div className="my-4 flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl">{userData.name}'s Patients</h1>
          <p className="text-muted-foreground">
            Manage your patient records, review histories, and track
            appointments in one place.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/patients/new">
            <UserPlus2Icon />
            Add Patient
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={patients} />
    </div>
  )
}
