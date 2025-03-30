import { getDoctorById } from "@/actions/doctor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from "@/db/prisma"
import getUser from "@/utils/supabase/server"
import { Doctor, Patient } from "@prisma/client"

export default async function PatientPage({
  params
}: { params: Promise<{ id: string }> }) {
  const { id: patientId } = await params

  const user = await getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const doctor: Doctor | null = await getDoctorById(user.id)

  if (!doctor) {
    throw new Error("Doctor not found")
  }

  const patient: Patient | null = await prisma.patient.findUnique({
    where: {
      id: patientId,
      doctorId: doctor.id
    }
  })

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent>
            <p>Patient not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 font-bold text-3xl">Patient Information</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patient Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col items-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
                />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="font-semibold text-xl">{patient.name}</h2>
              <p className="text-muted-foreground">ID: {patient.id}</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Date of Birth
                </p>
                <p>{patient.createdAt.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Gender
                </p>
                <p>{patient.age}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Contact
                </p>
                <p>{patient.name}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Email
                </p>
                <p>{patient.age}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Address
                </p>
                <p>{patient.doctorId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
            <CardDescription>
              Patient's medical records and history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="history">
              <TabsList className="mb-4 grid grid-cols-3">
                <TabsTrigger value="history">Medical History</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
              </TabsList>

              <TabsContent value="history">
                <Card>
                  <CardContent className="pt-6">
                    {/* {patient.medicalHistory &&
                    patient.medicalHistory.length > 0 ? (
                      <ul className="list-disc space-y-2 pl-6">
                        {patient.medicalHistory.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No medical history recorded.</p>
                    )} */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications">
                <Card>
                  <CardContent className="pt-6">
                    {/* {patient.medications && patient.medications.length > 0 ? (
                      <ul className="list-disc space-y-2 pl-6">
                        {patient.medications.map((med, index) => (
                          <li key={index}>{med}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No medications recorded.</p>
                    )} */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="allergies">
                <Card>
                  <CardContent className="pt-6">
                    {/* {patient.allergies && patient.allergies.length > 0 ? (
                      <ul className="list-disc space-y-2 pl-6">
                        {patient.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No allergies recorded.</p>
                    )} */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
