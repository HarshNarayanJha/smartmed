import { getDoctorById } from "@/actions/doctor"
import { CreatePatientForm } from "@/components/dashboard/CreatePatientForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import { redirect } from "next/navigation"

export default async function Patients() {
  const user = await getUser()

  if (!user) redirect("/auth/login")

  const doctor: Doctor | null = await getDoctorById(user.id)

  if (!doctor) redirect("/auth/login")

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="mb-6 font-bold text-3xl">Patient Registration</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-xl">Patient Information</h2>
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
