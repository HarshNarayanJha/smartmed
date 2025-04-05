"use server"

import getPDFHTMLTemplate from "@/utils/getPDFHTMLTemplate"
import { Doctor, Patient, Reading } from "@prisma/client"
import { getDoctorById } from "./doctor"
import { getPatientById } from "./patient"
import { getReadingById } from "./reading"
import { ReportWithPatientAndDoctorEmail } from "./report"

export async function sendEmailOnReportGeneration(
  report: ReportWithPatientAndDoctorEmail
) {
  const EMAIL_JS_API_URL = process.env.EMAIL_JS_API_URL
  const EMAIL_JS_SERVICE_ID = process.env.EMAIL_JS_SERVICE_ID
  const EMAIL_JS_REPORT_TEMPLATE_ID = process.env.EMAIL_JS_REPORT_TEMPLATE_ID
  const EMAIL_JS_PUBLIC_KEY = process.env.EMAIL_JS_PUBLIC_KEY

  try {
    console.log("Preparing to send email directly for report", report.id)

    const reading: Reading = await getReadingById(report.id)
    const patient: Patient = await getPatientById(report.patientId)
    const doctor: Doctor = await getDoctorById(report.doctorId)

    const url = EMAIL_JS_API_URL || ""
    const requestData = {
      service_id: EMAIL_JS_SERVICE_ID,
      template_id: EMAIL_JS_REPORT_TEMPLATE_ID,
      user_id: EMAIL_JS_PUBLIC_KEY,
      template_params: {
        patient_name: report.patient.name,
        doctor_name: report.doctor.name,
        email: report.patient.email,
        report: getPDFHTMLTemplate(report, reading, patient, doctor, false)
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error(`Email send failed with status: ${response.status}`)
    }

    const data = await response.text()
    console.log(`Email sent successfully for report id ${report.id}`, data)
    return data
  } catch (error) {
    console.error("Error while sending email", error)
    return null
  }
}
