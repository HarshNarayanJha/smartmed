"use server"

import { prisma } from "@/db/prisma"
import { Reading } from "@prisma/client"

/**
 * Creates a new reading
 */
export async function createReading(
  readingData: Omit<Reading, "id" | "createdAt" | "updatedAt">
): Promise<Reading> {
  try {
    console.log("Creating reading with data:", readingData)
    const reading: Reading = await prisma.reading.create({
      data: readingData
    })

    return reading
  } catch (error) {
    console.log(error)
    throw new Error("Failed to create reading")
  }
}

/**
 * Gets a reading by its ID
 */
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

/**
 * Gets readings by patient ID
 */
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

/**
 * Gets the number of readings by patient ID
 */
export async function getNumReadingsByPatientId(
  patientId: string
): Promise<number> {
  try {
    const numReadings = await prisma.reading.count({
      where: { patientId }
    })

    return numReadings
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get number of readings")
  }
}

/**
 * Gets the number of readings by doctor ID
 */
export async function getNumReadingsByDoctorId(
  doctorId: string
): Promise<number> {
  try {
    const numReadings = await prisma.reading.count({
      where: {
        patient: {
          doctorId
        }
      }
    })

    return numReadings
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get number of readings")
  }
}

/**
 * Deletes a reading by its ID
 */
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
