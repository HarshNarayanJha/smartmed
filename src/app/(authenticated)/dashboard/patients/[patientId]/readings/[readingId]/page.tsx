import { getPatientById } from "@/actions/patient"
import { getReadingById } from "@/actions/reading"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Patient, Reading } from "@prisma/client"
import {
  Activity,
  Droplet,
  HeartPulse,
  type LucideIcon,
  Notebook,
  Percent,
  Ruler,
  Scale,
  Thermometer,
  Wind
} from "lucide-react"
import { Suspense } from "react"

export default async function ReadingPage({
  params
}: { params: Promise<{ patientId: string; readingId: string }> }) {
  const { patientId, readingId } = await params

  const reading: Reading | null = await getReadingById(readingId)
  const patient: Patient | null = await getPatientById(patientId)

  if (!reading) {
    throw new Error("Reading not found")
  }

  if (!patient) {
    throw new Error("Patient not found")
  }

  const formattedDate = new Date(reading.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  )

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Suspense fallback={<ReadingSkeleton />}>
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="flex flex-row justify-between border-b">
            <div>
              <CardTitle className="font-bold text-2xl text-primary">
                {patient.name}'s Reading Details
              </CardTitle>
              <CardDescription className="pt-1 text-muted-foreground">
                <span className="font-medium">Diagnosed for:</span>{" "}
                {reading.diagnosedFor} <br />
                <span className="font-medium">Recorded on:</span>{" "}
                {formattedDate}
              </CardDescription>
            </div>
            <div>
              <Button>
                <Notebook />
                Generate Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold text-foreground text-lg">
              Vital Signs & Measurements
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ReadingItem
                Icon={Thermometer}
                title="Temperature"
                value={
                  reading.temperature ? `${reading.temperature} °C` : "N/A"
                }
              />
              <ReadingItem
                Icon={HeartPulse}
                title="Heart Rate"
                value={reading.heartRate ? `${reading.heartRate} bpm` : "N/A"}
              />
              <ReadingItem
                Icon={Activity}
                title="Blood Pressure"
                value={
                  reading.bpSystolic && reading.bpDiastolic
                    ? `${reading.bpSystolic}/${reading.bpDiastolic} mmHg`
                    : "N/A"
                }
              />
              <ReadingItem
                Icon={Wind}
                title="Respiratory Rate"
                value={
                  reading.respiratoryRate
                    ? `${reading.respiratoryRate} breaths/min`
                    : "N/A"
                }
              />
              <ReadingItem
                Icon={Percent}
                title="Oxygen Saturation"
                value={
                  reading.oxygenSaturation
                    ? `${reading.oxygenSaturation}%`
                    : "N/A"
                }
              />
              <ReadingItem
                Icon={Droplet}
                title="Glucose Level"
                value={
                  reading.glucoseLevel ? `${reading.glucoseLevel} mg/dL` : "N/A"
                }
              />
              <ReadingItem
                Icon={Ruler}
                title="Height"
                value={reading.height ? `${reading.height} cm` : "N/A"}
              />
              <ReadingItem
                Icon={Scale}
                title="Weight"
                value={reading.weight ? `${reading.weight} kg` : "N/A"}
              />
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}

function ReadingSkeleton() {
  const skeletonItems = 8 // Number of ReadingItems
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="border-b bg-muted/50">
          <Skeleton className="h-8 w-3/5 rounded" />
          <Skeleton className="mt-2 h-4 w-4/5 rounded" />
          <Skeleton className="mt-1 h-4 w-2/5 rounded" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="mb-4 h-6 w-1/3 rounded" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(skeletonItems)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 rounded-lg border bg-background p-4"
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-5 w-1/2 rounded" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ReadingItemProps {
  Icon: LucideIcon
  title: string
  value: string | number | null | undefined
}

function ReadingItem({ Icon, title, value }: ReadingItemProps) {
  const displayValue = value ?? "N/A"
  return (
    <div className="flex items-center space-x-4 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50">
      <Icon className="h-7 w-7 flex-shrink-0 text-primary" strokeWidth={1.5} />
      <div className="flex-1">
        <h3 className="font-medium text-muted-foreground text-sm">{title}</h3>
        <p className="font-semibold text-foreground text-lg">{displayValue}</p>
      </div>
    </div>
  )
}
