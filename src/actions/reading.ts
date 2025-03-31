import { prisma } from "@/db/prisma"
import { Reading } from "@prisma/client"

export async function createReading(
  readingData: Omit<Reading, "id" | "createdAt" | "updatedAt">
): Promise<Reading> {
  try {
    const reading = await prisma.reading.create({
      data: readingData
    })

    return reading
  } catch (error) {
    console.log(error)
    throw new Error("Failed to create reading")
  }
}

export async function getReadingById(id: string): Promise<Reading | null> {
  try {
    const reading = await prisma.reading.findUnique({
      where: { id }
    })

    return reading
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get reading")
  }
}

export async function getReadingsByPatientId(
  patientId: string
): Promise<Reading[]> {
  try {
    const readings = await prisma.reading.findMany({
      where: { patientId }
    })

    return readings
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get readings")
  }
}

export async function deleteReadingById(id: string): Promise<void> {
  try {
    await prisma.reading.delete({
      where: { id }
    })
  } catch (error) {
    console.log(error)
    throw new Error("Failed to delete reading")
  }
}
