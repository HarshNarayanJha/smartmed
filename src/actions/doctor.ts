"use server"

import { prisma } from "@/db/prisma"
import { Doctor, Prisma } from "@prisma/client"

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

export type DoctorWithPatients = Prisma.DoctorGetPayload<{
  include: {
    patients: true
  }
}>

/**
 * Fetches doctor by id along with patients
 */
export async function getDoctorByIdWithPatients(
  id: string
): Promise<DoctorWithPatients | null> {
  try {
    return await prisma.doctor.findUnique({
      where: { id },
      include: {
        patients: true
      }
    })
  } catch (error) {
    console.error("Error fetching doctor with patients:", error)
    return null
  }
}

export type DoctorWithReports = Prisma.DoctorGetPayload<{
  include: {
    reports: true
  }
}>

/**
 * Fetches doctor by id along with reports
 */
export async function getDoctorByIdWithReports(
  id: string
): Promise<DoctorWithReports | null> {
  try {
    return await prisma.doctor.findUnique({
      where: { id },
      include: {
        reports: true
      }
    })
  } catch (error) {
    console.error("Error fetching doctor with reports:", error)
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
