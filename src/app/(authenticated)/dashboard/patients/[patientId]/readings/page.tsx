import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

// Mock data for patient readings
const patientData = {
  name: "Jane Smith",
  age: 42,
  patientId: "P-12345",
  bloodPressureReadings: [
    { date: "2023-01-01", systolic: 120, diastolic: 80 },
    { date: "2023-01-08", systolic: 122, diastolic: 78 },
    { date: "2023-01-15", systolic: 118, diastolic: 76 },
    { date: "2023-01-22", systolic: 124, diastolic: 82 },
    { date: "2023-01-29", systolic: 120, diastolic: 80 },
    { date: "2023-02-05", systolic: 116, diastolic: 78 }
  ],
  glucoseReadings: [
    { date: "2023-01-01", value: 95 },
    { date: "2023-01-08", value: 98 },
    { date: "2023-01-15", value: 92 },
    { date: "2023-01-22", value: 97 },
    { date: "2023-01-29", value: 94 },
    { date: "2023-02-05", value: 90 }
  ],
  weightReadings: [
    { date: "2023-01-01", value: 68.5 },
    { date: "2023-01-15", value: 67.8 },
    { date: "2023-01-29", value: 67.2 },
    { date: "2023-02-05", value: 66.9 }
  ]
}

export default async function PatientReadingsPage({
  params
}: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/avatar-placeholder.png" alt={patientData.name} />
            <AvatarFallback>{patientData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-3xl">{patientData.name}</h1>
            <p className="text-muted-foreground">
              Age: {patientData.age} | Patient ID: {patientData.patientId}
            </p>
          </div>
        </div>
        <Button>Export Data</Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8 grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="glucose">Glucose</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Blood Pressure</CardTitle>
                <CardDescription>
                  Latest:{" "}
                  {
                    patientData.bloodPressureReadings[
                      patientData.bloodPressureReadings.length - 1
                    ].systolic
                  }
                  /
                  {
                    patientData.bloodPressureReadings[
                      patientData.bloodPressureReadings.length - 1
                    ].diastolic
                  }{" "}
                  mmHg
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={patientData.bloodPressureReadings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="systolic" stroke="#8884d8" />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Glucose</CardTitle>
                <CardDescription>
                  Latest:{" "}
                  {
                    patientData.glucoseReadings[
                      patientData.glucoseReadings.length - 1
                    ].value
                  }{" "}
                  mg/dL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={patientData.glucoseReadings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Weight</CardTitle>
                <CardDescription>
                  Latest:{" "}
                  {
                    patientData.weightReadings[
                      patientData.weightReadings.length - 1
                    ].value
                  }{" "}
                  kg
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={patientData.weightReadings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2e7d32" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blood-pressure">
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure History</CardTitle>
              <CardDescription>
                Systolic and diastolic readings over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientData.bloodPressureReadings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#8884d8"
                      name="Systolic"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#82ca9d"
                      name="Diastolic"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                          Systolic
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                          Diastolic
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {patientData.bloodPressureReadings
                        .slice()
                        .reverse()
                        .map((reading, idx) => (
                          <tr key={idx}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              {reading.date}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              {reading.systolic} mmHg
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              {reading.diastolic} mmHg
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glucose">
          <Card>
            <CardHeader>
              <CardTitle>Glucose Readings</CardTitle>
              <CardDescription>Blood glucose levels over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientData.glucoseReadings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Glucose Level (mg/dL)"
                      fill="#ff7300"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                          Glucose
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {patientData.glucoseReadings
                        .slice()
                        .reverse()
                        .map((reading, idx) => (
                          <tr key={idx}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              {reading.date}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              {reading.value} mg/dL
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracking</CardTitle>
              <CardDescription>Patient weight over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientData.weightReadings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Weight (kg)"
                      stroke="#2e7d32"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Recent Readings</h3>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                          Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {patientData.weightReadings
                        .slice()
                        .reverse()
                        .map((reading, idx) => (
                          <tr key={idx}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              {reading.date}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              {reading.value} kg
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
