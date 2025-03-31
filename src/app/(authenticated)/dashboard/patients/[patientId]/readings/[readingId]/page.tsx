import { getPatientById } from "@/actions/patient"
import { getReadingById } from "@/actions/reading"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Patient, Reading } from "@prisma/client"
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

  return (
    <Suspense fallback={<ReadingSkeleton />}>
      <Card>
        <CardHeader>
          <CardTitle>Patient Reading: {patient.name}</CardTitle>
          <CardDescription>
            Diagnosed for: {reading.diagnosedFor} • Date:{" "}
            {new Date(reading.createdAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ReadingItem
              title="Temperature"
              value={`${reading.temperature} °C`}
            />
            <ReadingItem
              title="Heart Rate"
              value={`${reading.heartRate} bpm`}
            />
            {reading.bpSystolic && reading.bpDiastolic && (
              <ReadingItem
                title="Blood Pressure"
                value={`${reading.bpSystolic}/${reading.bpDiastolic} mmHg`}
              />
            )}
            {reading.respiratoryRate && (
              <ReadingItem
                title="Respiratory Rate"
                value={`${reading.respiratoryRate} breaths/min`}
              />
            )}
            {reading.oxygenSaturation && (
              <ReadingItem
                title="Oxygen Saturation"
                value={`${reading.oxygenSaturation}%`}
              />
            )}
            {reading.glucoseLevel && (
              <ReadingItem
                title="Glucose Level"
                value={`${reading.glucoseLevel} mg/dL`}
              />
            )}
            {reading.height && (
              <ReadingItem title="Height" value={`${reading.height} cm`} />
            )}
            {reading.weight && (
              <ReadingItem title="Weight" value={`${reading.weight} kg`} />
            )}
          </div>
        </CardContent>
      </Card>
    </Suspense>
  )
}

function ReadingSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="mt-2 h-4 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReadingItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <h3 className="mb-1 font-medium text-muted-foreground text-sm">
        {title}
      </h3>
      <p className="font-semibold text-xl">{value}</p>
    </div>
  )
}
