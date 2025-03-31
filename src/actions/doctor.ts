"use server"

import { prisma } from "@/db/prisma"
import { Doctor } from "@prisma/client"

/**
 * Fetches a doctor by their ID
 */
export async function getDoctorById(id: string): Promise<Doctor | null> {
  try {
    return await prisma.doctor.findUnique({
      where: { id }
    })
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return null
  }
}

/**
 * Fetches a doctor by their email
 */
export async function getDoctorByEmail(email: string): Promise<Doctor | null> {
  try {
    return await prisma.doctor.findUnique({
      where: { email }
    })
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return null
  }
}

/**
 * Fetches all doctors, optionally filtered by specialty
 */
export async function getDoctors(): Promise<Doctor[]> {
  try {
    return await prisma.doctor.findMany({
      orderBy: { name: "asc" }
    })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return []
  }
}

/**
 * Updates a doctor's profile information
 */
export async function updateDoctorProfile(
  id: string,
  data: Partial<Doctor>
): Promise<Doctor | null> {
  try {
    return await prisma.doctor.update({
      where: { id },
      data
    })
  } catch (error) {
    console.error("Error updating doctor profile:", error)
    return null
  }
}

// /**
//  * Gets all appointments for a specific doctor
//  */
// export async function getDoctorAppointments(
//   doctorId: string
// ): Promise<Appointment[]> {
//   try {
//     return await db.appointment.findMany({
//       where: { doctorId },
//       include: { patient: true },
//       orderBy: { startTime: "asc" }
//     })
//   } catch (error) {
//     console.error("Error fetching doctor appointments:", error)
//     return []
//   }
// }
