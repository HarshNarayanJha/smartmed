import {
  PatientWithReadings,
  getPatientById,
  getPatientByIdWithReadings
} from "@/actions/patient"
import ReadingBarChart from "@/components/dashboard/ReadingBarChart"
import ReadingLineChart from "@/components/dashboard/ReadingLineChart"
import { DataTable } from "@/components/reusable/DataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  calculateAge,
  calculateBmi,
  formatDate,
  formatDateTime
} from "@/lib/utils"
import { Patient, Reading } from "@prisma/client"
import { FilePlus, Notebook, Plus } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { columns } from "./columns"

export async function generateMetadata({
  params
}: { params: { patientId: string } }): Promise<Metadata> {
  const patient: Patient = await getPatientById(params.patientId)

  return {
    title: `${patient.name}'s Readings | SmartMed`,
    description: `View and take ${patient.name}'s readings on SmartMed`
  }
}

export default async function PatientReadingsPage({
  params
}: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const patient: PatientWithReadings | null =
    await getPatientByIdWithReadings(patientId)

  if (!patient) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-md border border-dashed text-center">
        <h3 className="font-semibold text-lg">Patient Not Found</h3>
        <p className="text-muted-foreground text-sm">
          The patient with the provided ID could not be found.
        </p>
      </div>
    )
  }

  if (patient.readings.length === 0) {
    return (
      <>
        {pageBreadcrumbs(patientId, patient.name)}

        <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-md border border-dashed text-center">
          <h3 className="font-semibold text-lg">No Readings Found</h3>
          <p className="text-muted-foreground text-sm">
            This patient does not have any readings recorded yet.
          </p>
          <Button asChild>
            <Link href={`/dashboard/patients/${patientId}/readings/new`}>
              <Plus />
              Add New Reading
            </Link>
          </Button>
        </div>
      </>
    )
  }

  const K = 5
  const M = 20

  const latestReading: Reading = patient.readings.findLast(
    (r: Reading) =>
      r.height &&
      r.weight &&
      r.bpSystolic &&
      r.bpDiastolic &&
      r.temperature &&
      r.oxygenSaturation &&
      r.respiratoryRate
  )
  const latestKReadings: Reading[] = patient.readings.slice(-K)
  const latestMReadings: Reading[] = patient.readings.slice(-M)

  return (
    <div className="container mx-auto">
      {pageBreadcrumbs(patientId, patient.name)}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`}
              alt={patient.name}
            />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-3xl">{patient.name}</h1>
            <p className="text-muted-foreground">
              Age: {calculateAge(patient.dob)} | Patient ID:{" "}
              {patient.id.slice(0, 6)}{" "}
              <Badge
                variant={patient.cured ? "default" : "secondary"}
                className={`${patient.cured ? "bg-green-500 font-semibold" : ""}`}
              >
                {patient.cured ? "Cured" : "Under Treatment"}
              </Badge>
            </p>
          </div>
        </div>
        <div className="space-x-2">
          <Button asChild>
            <Link href={`/dashboard/patients/${patientId}/readings/new`}>
              <FilePlus />
              New Reading
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/patients/${patientId}/reports`}>
              <Notebook />
              View Reports
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8 grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="glucose">Glucose</TabsTrigger>
          <TabsTrigger value="height">Height</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="bmi">BMI</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ReadingBarChart
              title="Blood Pressure"
              description={`Latest: ${latestReading.bpSystolic}/${latestReading.bpDiastolic} mmHg`}
              xAxisKey="date"
              showXAxisTicks={false}
              bars={[
                {
                  dataKey: "systolic",
                  name: "Systolic",
                  fill: "#8884d8"
                },
                {
                  dataKey: "diastolic",
                  name: "Diastolic",
                  fill: "#82ca9d"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                systolic: r.bpSystolic,
                diastolic: r.bpDiastolic
              }))}
            />

            <ReadingLineChart
              title="Glucose"
              description={`Latest: ${latestReading.glucoseLevel} mg/dL`}
              xAxisKey="date"
              showXAxisTicks={false}
              referenceYValue={75}
              lines={[
                {
                  dataKey: "glucoseLevel",
                  type: "natural",
                  name: "Glucose",
                  stroke: "#ff7300"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                glucoseLevel: r.glucoseLevel
              }))}
            />

            <ReadingLineChart
              title="Height"
              description={`Latest: ${latestReading.height} cm`}
              xAxisKey="date"
              showXAxisTicks={false}
              lines={[
                {
                  dataKey: "height",
                  type: "natural",
                  name: "Height",
                  stroke: "#2e7d32"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                height: r.height
              }))}
            />

            <ReadingLineChart
              title="Weight"
              description={`Latest: ${latestReading.weight} kg`}
              xAxisKey="date"
              showXAxisTicks={false}
              lines={[
                {
                  dataKey: "weight",
                  type: "natural",
                  name: "Weight",
                  stroke: "#ffc658"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                weight: r.weight
              }))}
            />

            <ReadingLineChart
              title="BMI"
              description={`Latest: ${calculateBmi(latestReading.weight, latestReading.height)} kg/m²`}
              xAxisKey="date"
              showXAxisTicks={false}
              referenceYValue={20}
              lines={[
                {
                  dataKey: "bmi",
                  type: "natural",
                  name: "BMI kg/m²",
                  stroke: "#9c27b0"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                bmi: calculateBmi(r.weight, r.height)
              }))}
            />

            <ReadingLineChart
              title="Body Temperature"
              description={`Latest: ${latestReading.temperature} °C`}
              xAxisKey="date"
              showXAxisTicks={false}
              referenceYValue={37}
              lines={[
                {
                  dataKey: "value",
                  type: "natural",
                  name: "Body Temperature",
                  stroke: "#ff5733"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                value: r.temperature
              }))}
            />

            <ReadingLineChart
              title="Heart Rate"
              description={`Latest: ${latestReading.heartRate} bpm`}
              xAxisKey="date"
              showXAxisTicks={false}
              referenceYValue={72}
              lines={[
                {
                  dataKey: "value",
                  type: "natural",
                  name: "Heart Rate",
                  stroke: "#e53935"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                value: r.heartRate
              }))}
            />

            <ReadingLineChart
              title="Respiratory Rate"
              description={`Latest: ${latestReading.respiratoryRate} bpm`}
              xAxisKey="date"
              showXAxisTicks={false}
              referenceYValue={16}
              lines={[
                {
                  dataKey: "value",
                  type: "natural",
                  name: "Respiratory Rate",
                  stroke: "#1976d2"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                value: r.respiratoryRate
              }))}
            />

            <ReadingLineChart
              title="Oxygen Saturation"
              description={`Latest: ${latestReading.oxygenSaturation} %`}
              xAxisKey="date"
              showXAxisTicks={false}
              referenceYValue={98}
              lines={[
                {
                  dataKey: "value",
                  type: "natural",
                  name: "Oxygen Saturation",
                  stroke: "#009688"
                }
              ]}
              // @ts-ignore
              data={latestKReadings.map((r: Reading) => ({
                date: r.createdAt.toLocaleDateString(),
                value: r.oxygenSaturation
              }))}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-title">Latest Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {latestReading.diagnosedFor ||
                  "No diagnosis recorded for this reading."}
              </p>
            </CardContent>
          </Card>

          <h2 className="mt-2 mb-4 font-semibold text-2xl">All Readings</h2>
          <DataTable columns={columns} data={patient.readings} />
        </TabsContent>

        <TabsContent value="blood-pressure">
          <ReadingBarChart
            title="Blood Pressure History"
            description="Systolic and diastolic readings over time"
            data={latestMReadings.map((r: Reading) => ({
              date: formatDate(r.createdAt),
              systolic: r.bpSystolic,
              diastolic: r.bpDiastolic
            }))}
            xAxisKey="date"
            bars={[
              {
                dataKey: "systolic",
                fill: "#8884d8",
                name: "Systolic"
              },
              {
                dataKey: "diastolic",
                fill: "#82ca9d",
                name: "Diastolic"
              }
            ]}
            height={400}
            radius={16}
            table={
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>Systolic</TableHead>
                        <TableHead>Diastolic</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestMReadings.map((reading: Reading, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {formatDateTime(reading.createdAt)}
                          </TableCell>
                          <TableCell>{reading.bpSystolic} mmHg</TableCell>
                          <TableCell>{reading.bpDiastolic} mmHg</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="glucose">
          <ReadingBarChart
            title="Glucose Readings"
            description="Blood glucose levels over time"
            data={latestMReadings.map((r: Reading) => ({
              date: formatDate(r.createdAt),
              value: r.glucoseLevel
            }))}
            xAxisKey="date"
            bars={[
              {
                dataKey: "value",
                fill: "#FF6384",
                name: "Glucose Level (mg/dL)"
              }
            ]}
            height={400}
            radius={16}
            table={
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>Glucose</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestMReadings.map((reading: Reading, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {formatDateTime(reading.createdAt)}
                          </TableCell>
                          <TableCell>{reading.glucoseLevel} mmHg</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="height">
          <ReadingLineChart
            title="Height Tracking"
            description="Patient height over time"
            height={400}
            data={latestMReadings.map((r: Reading) => ({
              date: r.createdAt.toLocaleDateString(),
              value: r.height
            }))}
            xAxisKey="date"
            lines={[
              {
                type: "natural",
                dataKey: "value",
                name: "Height (cm)",
                stroke: "#4287f5",
                strokeWidth: 4
              }
            ]}
            table={
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>Height (cm)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestMReadings.map((reading: Reading, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {formatDateTime(reading.createdAt)}
                          </TableCell>
                          <TableCell>
                            {reading.height ? reading.height : "-"} cm
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="weight">
          <ReadingLineChart
            title="Weight Tracking"
            description="Patient weight over time"
            height={400}
            data={latestMReadings.map((r: Reading) => ({
              date: r.createdAt.toLocaleDateString(),
              value: r.weight
            }))}
            xAxisKey="date"
            lines={[
              {
                type: "natural",
                dataKey: "value",
                name: "Weight (kg)",
                stroke: "#2e7d32",
                strokeWidth: 4
              }
            ]}
            table={
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>Weight (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestMReadings.map((reading: Reading, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {formatDateTime(reading.createdAt)}
                          </TableCell>
                          <TableCell>{reading.weight} kg</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="bmi">
          <ReadingLineChart
            title="BMI Tracking"
            description="Patient BMI over time"
            height={400}
            data={latestMReadings.map((r: Reading) => ({
              date: r.createdAt.toLocaleDateString(),
              value: calculateBmi(r.weight, r.height)
            }))}
            xAxisKey="date"
            referenceYValue={20}
            lines={[
              {
                type: "natural",
                dataKey: "value",
                name: "BMI (kg/m²)",
                stroke: "#9c27b0",
                strokeWidth: 4
              }
            ]}
            table={
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>BMI (kg/m²)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestMReadings.map((reading: Reading, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {formatDateTime(reading.createdAt)}
                          </TableCell>
                          <TableCell>
                            {calculateBmi(reading.weight, reading.height)} kg/m²
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="temperature">
          <ReadingBarChart
            title="Body Temperature Tracking"
            description="Patient body temperature over time"
            height={400}
            radius={16}
            data={latestMReadings.map((r: Reading) => ({
              date: formatDate(r.createdAt),
              value: r.temperature
            }))}
            xAxisKey="date"
            bars={[
              {
                dataKey: "value",
                name: "Temperature (°C)",
                fill: "#ff5733"
              }
            ]}
            table={
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>Temperature (°C)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestMReadings.map((reading: Reading, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {formatDateTime(reading.createdAt)}
                          </TableCell>
                          <TableCell>{reading.temperature} °C</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="heartRate">
          <ReadingLineChart
            title="Heart Rate Tracking"
            description="Patient heart rate over time"
            referenceYValue={72}
            height={400}
            data={latestMReadings.map((r: Reading) => ({
              date: r.createdAt.toLocaleDateString(),
              value: r.heartRate
            }))}
            xAxisKey="date"
            lines={[
              {
                type: "natural",
                dataKey: "value",
                name: "Heart Rate (bpm)",
                stroke: "#e53935",
                strokeWidth: 4
              }
            ]}
            table={
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead>Heart Rate (bpm)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestMReadings.map((reading: Reading, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {formatDateTime(reading.createdAt)}
                          </TableCell>
                          <TableCell>{reading.heartRate} bpm</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function pageBreadcrumbs(patientId: string, patientName: string) {
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
          <BreadcrumbLink asChild>
            <Link href="/dashboard/patients">Patients</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/dashboard/patients/${patientId}`}>{patientName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Readings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
