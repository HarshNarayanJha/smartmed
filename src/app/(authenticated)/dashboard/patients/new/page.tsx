import { getDoctorById } from "@/actions/doctor"
import { CreatePatientForm } from "@/components/dashboard/CreatePatientForm"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `New Patient | SmartMed`
  }
}

export default async function NewPatientPage() {
  const user = await getUser()

  if (!user) redirect("/auth/login")

  const doctor: Doctor | null = await getDoctorById(user.id)

  if (!doctor) redirect("/auth/login")

  return (
    <div className="container mx-auto">
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
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">Patient Registration</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-semibold font-title text-xl">
            Patient Information
          </CardTitle>
          <p className="text-muted-foreground">
            Please enter the patient's clinical data in the form below to
            register them in the system
          </p>
        </CardHeader>
        <CardContent>
          <CreatePatientForm doctorId={doctor.id} />
        </CardContent>
      </Card>
    </div>
  )
}
