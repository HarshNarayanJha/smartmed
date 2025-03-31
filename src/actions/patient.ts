"use server"

import { prisma } from "@/db/prisma"
import { Patient } from "@prisma/client"
import { revalidatePath } from "next/cache"

/**
 * Fetch all patients from the database
 */
export async function getPatients(): Promise<Patient[]> {
  try {
    const patients: Patient[] = await prisma.patient.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

    return patients
  } catch (error) {
    console.error("Failed to fetch patients:", error)
    throw new Error("Failed to fetch patients")
  }
}

/**
 * Fetch all patients by doctor id
 */
export async function getPatientsByDoctorId(
  doctorId: string
): Promise<Patient[]> {
  try {
    const patients: Patient[] = await prisma.patient.findMany({
      where: { doctorId },
      orderBy: {
        createdAt: "desc"
      }
    })

    return patients
  } catch (error) {
    console.error(`Failed to fetch patients by doctor id ${doctorId}:`, error)
    throw new Error("Failed to fetch patients")
  }
}

/**
 * Fetch all cured patients by doctor id
 */
export async function getCuredPatientsByDoctorId(
  doctorId: string
): Promise<Patient[]> {
  try {
    const patients: Patient[] = await prisma.patient.findMany({
      where: { doctorId, cured: true },
      orderBy: {
        createdAt: "desc"
      }
    })

    return patients
  } catch (error) {
    console.error(
      `Failed to fetch cured patients by doctor id ${doctorId}:`,
      error
    )
    throw new Error("Failed to fetch cured patients")
  }
}

/**
 * Get number of patients by doctor id
 */
export async function getPatientsCountByDoctorId(
  doctorId: string
): Promise<number> {
  try {
    const count = await prisma.patient.count({
      where: { doctorId }
    })

    return count
  } catch (error) {
    console.error(
      `Failed to fetch patients count by doctor id ${doctorId}:`,
      error
    )
    throw new Error("Failed to fetch patients count")
  }
}

/*
 * Get number of cured patients by doctor id
 */
export async function getCuredPatientsCountByDoctorId(
  doctorId: string
): Promise<number> {
  try {
    const count = await prisma.patient.count({
      where: { doctorId, cured: true }
    })

    return count
  } catch (error) {
    console.error(
      `Failed to fetch cured patients count by doctor id ${doctorId}:`,
      error
    )
    throw new Error("Failed to fetch cured patients count")
  }
}

/**
 * Fetch a specific patient by ID
 */
export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const patient: Patient | null = await prisma.patient.findUnique({
      where: { id }
    })

    return patient
  } catch (error) {
    console.error(`Failed to fetch patient with id ${id}:`, error)
    throw new Error("Failed to fetch patient")
  }
}

/**
 * Create a new patient
 */
export async function createPatient(
  patientData: Omit<Patient, "id" | "createdAt" | "updatedAt" | "cured">
): Promise<Patient> {
  try {
    console.log("Creating patient with data:", patientData)
    const patient = await prisma.patient.create({
      data: patientData
    })

    revalidatePath("/patients")
    return patient
  } catch (error) {
    console.error("Failed to create patient. Error: ", error)
    throw new Error("Failed to create patient")
  }
}

/**
 * Update an existing patient
 */
export async function updatePatient(
  id: string,
  patientData: Partial<Patient>
): Promise<Patient> {
  try {
    const patient = await prisma.patient.update({
      where: { id },
      data: patientData
    })

    revalidatePath(`/patients/${id}`)
    revalidatePath("/patients")
    return patient
  } catch (error) {
    console.error(`Failed to update patient with id ${id}:`, error)
    throw new Error("Failed to update patient")
  }
}

/**
 * Delete a patient
 */
export async function deletePatient(id: string): Promise<void> {
  try {
    await prisma.patient.delete({
      where: { id }
    })

    revalidatePath("/patients")
  } catch (error) {
    console.error(`Failed to delete patient with id ${id}:`, error)
    throw new Error("Failed to delete patient")
  }
}
