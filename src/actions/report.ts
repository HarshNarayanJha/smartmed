"use server"

import { prisma } from "@/db/prisma"
import { calculateAge, calculateBmi } from "@/lib/utils"
import { createClient } from "@/utils/supabase/server"
import { GoogleGenAI, Type } from "@google/genai"
import { Patient, Prisma, Reading, Report } from "@prisma/client"
import { revalidatePath } from "next/cache"

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!
const ai = new GoogleGenAI({ apiKey })

const GENERATE_REPORT_PROMPT = `
You have completed your MBBS from a AIIMS Delhi and then you have completed your phd from AIIMS Kalyani and you have given a lot of time in research and practice for your profession. After 10 years of practice, you have qualified for being a medical professional and now you have been in this field for 50 years and is one of the most reliable doctors in India. Using your ample amount of knowledge of this field,you have to generate medical reports which is closed to 99% accuracy level from the readings taken. Try to be sensitive in all cases as it can cause a life or death like situation.
Analyze the information provided and create a detailed, accurate, and professional medical report.

Your response should follow this exact JSON schema:

{
  "summary": "Short & Precise overview of key findings",
  "detailedAnalysis": "In-depth and accurate analysis of all readings and measurements",
  "diagnosis": "Life-saving diagnosis methods based on the readings",
  "recommendations": "Try to give Accurate Treatment recommendations and follow-up suggestions everytime",
  "urgencyLevel": "Low/Medium/High - Include these parameters according to your findings and alert the patient accordingly",
  "additionalNotes": "Any other relevant medical observations or concerns you want to give from your experience. It should also give the patient a safe/proper diet and yoga/exercise plan for speedy recovery in a short and concise manner in a plain text",
  "tests": "Includes information about all the tests that are needed to be done in plain english sentence. Keep this very concise.",
  "followupSchedule": "A single cron job schedule for followup visits to doctor without any additional text as per their condition or leave empty string if not required. Do not use nonstandard cron formats."

}

Your report should:
- Use formal and easy to understand medical terminology appropriately
- Be factually accurate based only on the data provided and avoid creating fear-mongering among patients
- Maintain a professional, clinical tone so they feel like talking to a real doctor
- Avoid speculation of your own
- Include specific values from the readings when relevant
- Format all values with appropriate units
- Prioritize patient's health and safety in all recommendations being economical at the same time
- Also, mention the ranges if the readings come severe for any reading
- It should include cron job schedule for patient followup visit as per their condition or empty string if no followup is required. Be careful in this as if a patient is not given a proper treatment on time then it may cause a lot of harm to them even DEATH also.

Also, NEVER use markdown syntax. Respond in plaintext only.

Remember to be thorough but concise. This report will be used by healthcare professionals to make clinical decisions so avoid making any errors.

Here are the readings in the json format:

`

/**
 * Schedule a followup for a report
 */
export async function scheduleFollowup(
  report: ReportWithPatientAndDoctorEmail
): Promise<number> {
  const client = await createClient()
  console.log("Creating cron job followup schedule for report id", report.id)

  const { data, error } = await client.schema("cron").rpc("schedule", {
    job_name: `followup-${report.id}`,
    schedule: report.followupSchedule,
    command: `Send mail to ${report.patient.email} and ${report.doctor.email}`
  })

  if (error) {
    console.error("Error while create an followup cron job", error)
    return null
  }

  console.log(
    `Schedule Followup created for report id ${report.id} with id ${data}`
  )
  return data
}

/**
 * Unschedules all followups for a patient
 * This gets done when patient is marked cured or get's removed
 */
export async function unscheduleAllFollowupsByPatientId(patientId: string) {
  const client = await createClient()
  const jobIds = await getReportJobIdsByPatientId(patientId)

  console.log("Unscheduling all followups for patient id", patientId)
  jobIds.forEach(async jid => {
    await client.schema("cron").rpc("unschedule", { job_id: jid })
    console.log("Unscheduled followup with id", jid)
  })
}

/**
 * Unschedules all followups for a doctor
 * This gets done when doctor delete's account
 */
export async function unscheduleAllFollowupsByDoctorId(doctorId: string) {
  const client = await createClient()
  const jobIds = await getReportJobIdsByDoctorId(doctorId)

  console.log("Unscheduling all followups for doctor id", doctorId)
  jobIds.forEach(async jid => {
    await client.schema("cron").rpc("unschedule", { job_id: jid })
    console.log("Unscheduled followup with id", jid)
  })
}

/**
 * Generates a report for a given reading and patient ID
 * This does NOT create a report
 */
export async function generateReport(
  reading: Reading,
  patient: Patient
): Promise<{
  data: Omit<
    Report,
    "id" | "doctorId" | "patientId" | "createdAt" | "updatedAt"
  >
}> {
  try {
    const contents = `
      ${GENERATE_REPORT_PROMPT}

      ${JSON.stringify({
        diagnosedFor: reading.diagnosedFor,
        height: reading.height,
        weight: reading.weight,
        bmi: calculateBmi(reading.weight, reading.height),
        bodyTemperature: reading.temperature,
        heartRate: reading.heartRate,
        bpSystolic: reading.bpSystolic,
        bpDiastolic: reading.bpDiastolic,
        respiratoryRate: reading.respiratoryRate,
        glucoseLevel: reading.glucoseLevel,
        oxygenSaturation: reading.oxygenSaturation,
        takenAt: reading.createdAt.toJSON()
      })}

      Height is in centimeters
      weight is in kilograms
      bmi is in kg/m^2
      body temperature is in degrees Celsius
      heart rate is in beats per minute
      blood pressure is in mmHg
      respiratory rate is in breaths per minute
      glucose level is in mg/dL
      oxygen saturation is in percentage

      Also, here is the relevant patient data

      ${JSON.stringify({
        age: calculateAge(patient.dob),
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        smokingStatus: patient.smokingStatus,
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies
      })}
    `

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, nullable: false },
            detailedAnalysis: { type: Type.STRING, nullable: false },
            diagnosis: { type: Type.STRING, nullable: false },
            recommendations: { type: Type.STRING, nullable: false },
            urgencyLevel: { type: Type.STRING, nullable: false },
            additionalNotes: { type: Type.STRING, nullable: false },
            tests: { type: Type.STRING, nullable: false },
            followupSchedule: { type: Type.STRING, nullable: false }
          },
          required: [
            "summary",
            "detailedAnalysis",
            "diagnosis",
            "recommendations",
            "urgencyLevel",
            "additionalNotes",
            "tests",
            "followupSchedule"
          ]
        }
      }
    })

    return {
      data: JSON.parse(response.text || "{}")
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export type ReportWithPatientAndDoctorEmail = Prisma.ReportGetPayload<{
  include: {
    patient: {
      select: {
        email: true
      }
    }
    doctor: {
      select: {
        email: true
      }
    }
  }
}>

/**
 * Creates a report for a given reading and patient ID
 */
export async function createReport(
  reportData: Omit<Report, "createdAt" | "updatedAt">
): Promise<Report> {
  try {
    const report: ReportWithPatientAndDoctorEmail = await prisma.report.create({
      data: reportData,
      include: {
        patient: {
          select: {
            email: true
          }
        },
        doctor: {
          select: {
            email: true
          }
        }
      }
    })

    const jobId = await scheduleFollowup(report)

    await prisma.report.update({
      where: {
        id: report.id
      },
      data: {
        jobId
      }
    })

    revalidatePath(
      `/dashboard/patient/${report.patientId}/reports/${report.id}`
    )
    revalidatePath(`/dashboard/patient/${report.patientId}/reports`)
    revalidatePath(`/dashboard/patient/${report.patientId}`)

    return report
  } catch (error) {
    console.log(error)
    throw new Error("Failed to create report")
  }
}

/**
 * Get a report by its ID
 */
export async function getReportById(reportId: string): Promise<Report | null> {
  try {
    const report: Report | null = await prisma.report.findUnique({
      where: {
        id: reportId
      }
    })

    return report
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get report", error)
  }
}

/**
 * Get reports by patient ID
 */
export async function getReportsByPatientId(
  patientId: string
): Promise<Report[]> {
  try {
    const reports = await prisma.report.findMany({
      where: {
        patientId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return reports
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get reports")
  }
}

/**
 * Get number of reports by patient ID
 */
export async function getNumReportsByPatientId(
  patientId: string
): Promise<number> {
  try {
    const numReports = await prisma.report.count({
      where: {
        patientId
      }
    })

    return numReports
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get number of reports")
  }
}

export async function getReportJobIdsByPatientId(
  patientId: string
): Promise<string[]> {
  try {
    const jobIds = await prisma.report.findMany({
      where: {
        patientId
      },
      select: {
        jobId: true
      }
    })

    return jobIds.map(job => job.jobId)
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get report job IDs")
  }
}

export async function getReportJobIdsByDoctorId(
  doctorId: string
): Promise<string[]> {
  try {
    const jobIds = await prisma.report.findMany({
      where: {
        doctorId
      },
      select: {
        jobId: true
      }
    })

    return jobIds.map(job => job.jobId)
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get report job IDs")
  }
}

/**
 * Get reports by doctor ID
 */
export async function getReportsByDoctorId(
  doctorId: string
): Promise<Report[]> {
  try {
    const reports = await prisma.report.findMany({
      where: {
        doctorId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return reports
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get reports")
  }
}

/**
 * Get number of reports by doctor ID
 */
export async function getNumReportsByDoctorId(
  doctorId: string
): Promise<number> {
  try {
    const numReports = await prisma.report.count({
      where: {
        doctorId
      }
    })

    return numReports
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get number of reports")
  }
}

export async function deleteReport(reportId: string): Promise<void> {
  try {
    await prisma.report.delete({
      where: {
        id: reportId
      }
    })
  } catch (error) {
    console.error(`Failed to delete report ${reportId}:`, error)
    throw new Error(`Failed to delete report with ID ${reportId}.`)
  }
}
