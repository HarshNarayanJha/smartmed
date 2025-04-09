"use server"

import { prisma } from "@/db/prisma"
import { calculateAge, calculateBmi } from "@/lib/utils"
import { createClient } from "@/utils/supabase/server"
import { GoogleGenAI, Type } from "@google/genai"
import { Patient, Prisma, Reading, Report } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sendEmailOnReportGeneration } from "./email"

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!
const ai = new GoogleGenAI({ apiKey })

const GENERATE_REPORT_PROMPT = `
You have completed your MBBS from a AIIMS Delhi and then you have completed your PhD from AIIMS Kalyani and you have given a lot of time in research and practice for your profession.
After 10 years of practice, you have qualified for being a medical professional and now you have been in this field for 50 years and are one of the most reliable doctors in India.
Using your ample amount of knowledge of this field, you have to generate high quality professional medical reports from the readings taken by your junior.
Try to be sensitive in all cases as it can cause a life or death like situation. Do not overlook or under diagnose any readings. DO NOT ask any questions.
Analyze the information provided and create a detailed, accurate, and professional medical report.

Your response should follow this exact JSON schema:

{
  "summary": "Short & Precise overview of key findings",
  "detailedAnalysis": "In-depth and accurate analysis of all readings and measurements",
  "diagnosis": "Life-saving diagnosis methods based on the readings",
  "recommendations": "Try to give Accurate Treatment recommendations and follow-up suggestions everytime",
  "urgencyLevel": "Low/Medium/High - Include these parameters according to your findings and alert the patient accordingly",
  "additionalNotes": "Any other relevant medical observations or concerns you want to give from your experience. It should also give the patient a safe/proper diet and yoga/exercise plan for speedy recovery in a short and concise manner in plain text (you may use formatting and numbering, but not markdown)",
  "tests": "Includes information about all the tests that are needed to be done in plain english sentence. Keep this very concise. Include info about the followupSchedule you decided here",
  "followupSchedule": "A single cron job schedule for recurring followup visits to doctor without any additional text as per their condition."
}

Your report should:
- Use formal and easy to understand medical terminology appropriately
- Be factually accurate based only on the data provided and avoid creating fear-mongering among patients
- Maintain a professional, clinical tone so they feel like talking to a real doctor
- Avoid speculation of your own
- Include specific values from the readings when relevant
- Format all values with appropriate units
- Prioritize patient's health and safety in all recommendations while being economical at the same time
- Also, mention the ranges if the readings come severe for any reading
- Add why you picked the recurring followup schedule based on the patient's condition and the doctor's recommendation into the tests section.
DO NOT mention about cron or anything since this is a report read by non technical people. Use words like "followup" and "scheduled".
- followupSchedule should include cron job schedule for patient's recurring followup visits as per their condition or if the doctor mentions a recurring followup request in their diagnosis,
make sure to use that only, otherwise empty string if no followup is required, BUT if the doctor days to followup, be sure to schedule it as instructed.

For the cron job format, strictly follow this format:
- 5 space-separated fields: minute hour day month dayofweek
- Valid minutes: 0-59
- Valid hours: 0-23 (use only office hours 9-17)
- Valid days: 1-31 (or 1-28 or 1-30 depending on the month)
- Valid months: 1-12
- Valid days of week: 0-6 (0=Sunday)
Example: "0 10 15 * *" means 10:00 AM on the 15th of every month
Example: "0 0,12 1 */2 *" means At 00:00 and 12:00 on 1st of every 2nd month (Jan, Mar, May, Jul, Sep, Nov).
Example: "0 4 8-14 * *" means At 04:00 on days 8th to 14th of every month.
Example: "0 */3 * * *" means every 3 hours
DO NOT use special characters like @yearly.
DO NOT use non standard cron format.
ONLY use standard numerical values.
An empty string means no followup needed.

Be careful in this as if a patient is not given a proper treatment on time then it may cause a lot of harm to them even DEATH also.
Make sure to set the time hour in the cronjob to a suitable office hours time, not midnight. Be sure to consider the today's date and time also.
Right now the date and time in UTC is: ${new Date().toJSON()}

Make the cron job schedule based on this. Keep in mind the date.

Also, NEVER use markdown syntax. Respond in plaintext only.

Remember to be thorough but concise. This report will be used by healthcare professionals to make clinical decisions so avoid making any errors.

Here are the readings in the json format:

`

/**
 * Schedule a followup for a report
 */
export async function scheduleFollowup(
  report: ReportWithPatientAndDoctorEmail,
  diagnosedFor: string
): Promise<number> {
  const client = await createClient()
  console.log("Creating cron job followup schedule for report id", report.id)

  const EMAIL_JS_API_URL = process.env.EMAIL_JS_API_URL
  const EMAIL_JS_SERVICE_ID = process.env.EMAIL_JS_SERVICE_ID
  const EMAIL_JS_FOLLOWUP_TEMPLATE_ID =
    process.env.EMAIL_JS_FOLLOWUP_TEMPLATE_ID
  const EMAIL_JS_PUBLIC_KEY = process.env.EMAIL_JS_PUBLIC_KEY

  const { data, error } = await client.schema("cron").rpc("schedule", {
    job_name: `followup-${report.id}`,
    schedule: report.followupSchedule,
    command: `select
      net.http_post(
          url:='${EMAIL_JS_API_URL}',
          headers:=jsonb_build_object('Content-Type', 'application/json'),
          body:='{"service_id": "${EMAIL_JS_SERVICE_ID}", "template_id": "${EMAIL_JS_FOLLOWUP_TEMPLATE_ID}", "user_id": "${EMAIL_JS_PUBLIC_KEY}", "template_params": {"patient_name": "${report.patient.name}", "doctor_name": "${report.doctor.name}", "followup_reason": "${diagnosedFor}", "email": "${report.patient.email}"}}',
          timeout_milliseconds:=2500
      );`
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
 * Unschedules a followup by its job id
 */
export async function unscheduleFollowupById(
  jobId: number,
  reportId: string,
  update: boolean = true
) {
  if (!jobId) return

  const client = await createClient()
  await client.schema("cron").rpc("unschedule", { job_id: jobId.toString() })
  if (update)
    await updateReportById(reportId, { jobId: null, followupSchedule: "" })
  console.log("Unscheduled followup with id", jobId)
}

/**
 * Unschedules all followups for a patient
 * This gets done when patient is marked cured or get's removed
 */
export async function unscheduleAllFollowupsByPatientId(patientId: string) {
  const jobIds = await getReportJobIdsByPatientId(patientId)

  console.log("Unscheduling all followups for patient id", patientId)
  jobIds.forEach(async ({ jobId, reportId }) => {
    await unscheduleFollowupById(jobId, reportId)
    console.log("Unscheduled followup with id", jobId)
  })
}

/**
 * Unschedules all followups for a doctor
 * This gets done when doctor delete's account
 */
export async function unscheduleAllFollowupsByDoctorId(doctorId: string) {
  const jobIds = await getReportJobIdsByDoctorId(doctorId)

  console.log("Unscheduling all followups for doctor id", doctorId)
  jobIds.forEach(async ({ jobId, reportId }) => {
    await unscheduleFollowupById(jobId, reportId)
    console.log("Unscheduled followup with id", jobId)
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
        name: true
        email: true
      }
    }
    doctor: {
      select: {
        name: true
        email: true
      }
    }
  }
}>

/**
 * Creates a report for a given reading and patient ID
 */
export async function createReport(
  reportData: Omit<Report, "createdAt" | "updatedAt">,
  diagnosedFor: string
): Promise<Report> {
  try {
    const reportWithEmail: ReportWithPatientAndDoctorEmail =
      await prisma.report.create({
        data: reportData,
        include: {
          patient: {
            select: {
              name: true,
              email: true
            }
          },
          doctor: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

    const data = {
      jobId: null
    }

    if (reportWithEmail.followupSchedule) {
      data.jobId = await scheduleFollowup(reportWithEmail, diagnosedFor)
    }

    const report: Report = await prisma.report.update({
      where: {
        id: reportWithEmail.id
      },
      data
    })

    sendEmailOnReportGeneration(reportWithEmail)

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
 * Update a report by its ID
 */
export async function updateReportById(
  reportId: string,
  data: Partial<Report>
): Promise<Report | null> {
  try {
    const report: Report | null = await prisma.report.update({
      where: {
        id: reportId
      },
      data
    })

    revalidatePath(
      `/dashboard/patient/${report.patientId}/reports/${report.id}`
    )
    revalidatePath(`/dashboard/patient/${report.patientId}/reports`)
    revalidatePath(`/dashboard/patient/${report.patientId}`)
    revalidatePath(`/dashboard/reports`)
    revalidatePath(`/dashboard/`)

    return report
  } catch (error) {
    console.log(error)
    throw new Error("Failed to update report", error)
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
): Promise<{ jobId: number; reportId: string }[]> {
  try {
    const reports = await prisma.report.findMany({
      where: {
        patientId
      },
      select: {
        id: true,
        jobId: true
      }
    })

    return reports.map(report => ({ jobId: report.jobId, reportId: report.id }))
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get report job IDs")
  }
}

export async function getReportJobIdsByDoctorId(
  doctorId: string
): Promise<{ jobId: number; reportId: string }[]> {
  try {
    const reports = await prisma.report.findMany({
      where: {
        doctorId
      },
      select: {
        id: true,
        jobId: true
      }
    })

    return reports.map(report => ({ jobId: report.jobId, reportId: report.id }))
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

export async function deleteReport(id: string): Promise<void> {
  try {
    const report = await prisma.report.findUnique({
      where: { id },
      select: { patientId: true, id: true, jobId: true, doctorId: true }
    })

    if (!report) {
      console.warn(`Report with ID ${id} not found for deletion.`)
      return
    }

    console.log(`Deleting report with ID ${id}...`)

    await prisma.report.delete({
      where: {
        id
      }
    })

    await unscheduleFollowupById(report.jobId, report.id, false)

    revalidatePath(`/dashboard/patients/${report.patientId}`)
    revalidatePath(`/dashboard/patients/${report.patientId}/reports`)
    revalidatePath(`/dashboard/reports`)
    revalidatePath("/dashboard")
  } catch (error) {
    console.error(`Failed to delete report ${id}:`, error)
    throw new Error(`Failed to delete report with ID ${id}.`)
  }
}
