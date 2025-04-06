import {
  calculateAge,
  calculateBmi,
  formatDate,
  formatDateTime
} from "@/lib/utils"
import { Doctor, Patient, Reading, Report } from "@prisma/client"
import cronstrue from "cronstrue"

export default function getPDFHTMLTemplate(
  report: Report,
  reading: Reading,
  patient: Patient,
  doctor: Doctor,
  fullMarkup: boolean = true
): string {
  const urgencyStyle = () => {
    switch (report.urgencyLevel) {
      case "HIGH":
        return `color: #d32f2f; font-weight: bold; padding: 8px; line-height: 1.5; font-size: 14pt;`
      case "MEDIUM":
        return `color: #f57c00; font-weight: bold; padding: 8px; line-height: 1.5; font-size: 14pt;`
      default:
        return `color: #388e3c; font-weight: bold; padding: 8px; line-height: 1.5; font-size: 14pt;`
    }
  }

  const body = `
    <div style="padding: 16px; box-sizing: border-box; margin: 8px; width: 100%; max-width: 800pt; font-family: OpenSans, system-ui, sans-serif;">
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 10px;">
        <div style="">
          <img
            src="${fullMarkup ? `/web-app-manifest-192x192.png` : `https://smartmed-wli7.onrender.com/web-app-manifest-192x192.png`}"
            alt="SmartMed Logo"
            style="max-height: 75px; max-width: 100%; margin-bottom: 8px; margin-left: 0; margin-right: auto; display: block;"
          />
          <p style="margin-bottom: 4px; font-size: 16pt; display: block; font-family: Montserrat, system-ui, sans-serif;"><strong>SmartMed</strong></p>
          <p style="font-size: 9pt; display: block; margin: 0px;">Your Health, Our Priority</p>
        </div>
        <div style="text-align: end; margin-left: auto;">
          <div style="font-size: 10.5pt; margin-bottom: 4px;">Dr. ${doctor.name}, ${doctor.degree}</div>
          <div style="font-size: 10.5pt; margin-bottom: 4px;">${doctor.speciality}</div>
          <div style="font-size: 10.5pt; margin-bottom: 4px;">Practice Since: ${doctor.practiceStarted}</div>
        </div>
      </div>

      <div>
        <div style="font-size: 21pt; font-weight: bold; margin: 20px 0; color: #010101; text-align: left; font-family: Montserrat, system-ui, sans-serif;">Medical Report</div>
      </div>

      <div style="margin-bottom: 36px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101; font-family: Montserrat, system-ui, sans-serif;">Patient Information</div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Name:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${patient.name}</div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">DOB:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">
            ${formatDate(patient.dob)} (${calculateAge(patient.dob)} years)
          </div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Gender:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${patient.gender}</div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Blood Group:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${patient.bloodGroup}</div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Smoking Status:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${patient.smokingStatus}</div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Phone:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${patient.phoneNumber}</div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Email:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${patient.email}</div>
        </div>
      </div>

      <div style="margin-bottom: 36px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Current Readings</div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 16px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Diagnosed For:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${reading.diagnosedFor}</div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10.5pt;">
          <thead>
            <tr style="background-color: #f5f5f5; text-align: left;">
              <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Measurement</th>
              <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Value</th>
              <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Reference</th>
              <th style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            ${
              reading.height
                ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Height</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${reading.height} cm</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">-</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">-</td>
                </tr>
                `
                : ""
            }
            ${
              reading.weight
                ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Weight</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${reading.weight} kg</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">-</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">-</td>
                </tr>
                `
                : ""
            }
            ${
              reading.height && reading.weight
                ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">BMI</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${calculateBmi(reading.weight, reading.height)} kg/m²</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">18.5-24.9 kg/m²</td>
                  <td style="padding: 8px; border: 1px solid #ddd; ${(() => {
                    const bmi = parseFloat(
                      calculateBmi(reading.weight, reading.height)
                    )
                    if (bmi < 16 || bmi > 35)
                      return "color: #d32f2f; font-weight: bold;"
                    if (bmi < 18.5 || bmi > 30)
                      return "color: #f57c00; font-weight: bold;"
                    return "color: #388e3c; font-weight: bold;"
                  })()}">${(() => {
                    const bmi = parseFloat(
                      calculateBmi(reading.weight, reading.height)
                    )
                    if (bmi < 16 || bmi > 35) return "HIGH RISK"
                    if (bmi < 18.5 || bmi > 30) return "MEDIUM RISK"
                    return "LOW RISK"
                  })()}</td>
                </tr>
                `
                : ""
            }
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Temperature</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${reading.temperature}°C</td>
              <td style="padding: 8px; border: 1px solid #ddd;">36.1-37.2°C</td>
              <td style="padding: 8px; border: 1px solid #ddd; ${(() => {
                if (reading.temperature < 35 || reading.temperature > 38.5)
                  return "color: #d32f2f; font-weight: bold;"
                if (reading.temperature < 36.1 || reading.temperature > 37.8)
                  return "color: #f57c00; font-weight: bold;"
                return "color: #388e3c; font-weight: bold;"
              })()}">${(() => {
                if (reading.temperature < 35 || reading.temperature > 38.5)
                  return "HIGH RISK"
                if (reading.temperature < 36.1 || reading.temperature > 37.8)
                  return "MEDIUM RISK"
                return "LOW RISK"
              })()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Heart Rate</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${reading.heartRate} bpm</td>
              <td style="padding: 8px; border: 1px solid #ddd;">60-90 bpm</td>
              <td style="padding: 8px; border: 1px solid #ddd; ${(() => {
                if (reading.heartRate < 40 || reading.heartRate > 130)
                  return "color: #d32f2f; font-weight: bold;"
                if (reading.heartRate < 60 || reading.heartRate > 90)
                  return "color: #f57c00; font-weight: bold;"
                return "color: #388e3c; font-weight: bold;"
              })()}">${(() => {
                if (reading.heartRate < 40 || reading.heartRate > 130)
                  return "HIGH RISK"
                if (reading.heartRate < 60 || reading.heartRate > 90)
                  return "MEDIUM RISK"
                return "LOW RISK"
              })()}</td>
            </tr>
            ${
              reading.bpSystolic && reading.bpDiastolic
                ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Blood Pressure</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${reading.bpSystolic}/${reading.bpDiastolic} mmHg</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">90-120/60-80 mmHg</td>
                  <td style="padding: 8px; border: 1px solid #ddd; ${(() => {
                    if (
                      reading.bpSystolic > 180 ||
                      reading.bpSystolic < 80 ||
                      reading.bpDiastolic > 120 ||
                      reading.bpDiastolic < 50
                    )
                      return "color: #d32f2f; font-weight: bold;"
                    if (
                      reading.bpSystolic > 140 ||
                      reading.bpSystolic < 90 ||
                      reading.bpDiastolic > 90 ||
                      reading.bpDiastolic < 60
                    )
                      return "color: #f57c00; font-weight: bold;"
                    return "color: #388e3c; font-weight: bold;"
                  })()}">${(() => {
                    if (
                      reading.bpSystolic > 180 ||
                      reading.bpSystolic < 80 ||
                      reading.bpDiastolic > 120 ||
                      reading.bpDiastolic < 50
                    )
                      return "HIGH RISK"
                    if (
                      reading.bpSystolic > 140 ||
                      reading.bpSystolic < 90 ||
                      reading.bpDiastolic > 90 ||
                      reading.bpDiastolic < 60
                    )
                      return "MEDIUM RISK"
                    return "LOW RISK"
                  })()}</td>
                </tr>
                `
                : ""
            }
            ${
              reading.respiratoryRate
                ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Respiratory Rate</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${reading.respiratoryRate} bpm</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">12-20 bpm</td>
                  <td style="padding: 8px; border: 1px solid #ddd; ${(() => {
                    if (
                      reading.respiratoryRate < 8 ||
                      reading.respiratoryRate > 30
                    )
                      return "color: #d32f2f; font-weight: bold;"
                    if (
                      reading.respiratoryRate < 12 ||
                      reading.respiratoryRate > 20
                    )
                      return "color: #f57c00; font-weight: bold;"
                    return "color: #388e3c; font-weight: bold;"
                  })()}">${(() => {
                    if (
                      reading.respiratoryRate < 8 ||
                      reading.respiratoryRate > 30
                    )
                      return "HIGH RISK"
                    if (
                      reading.respiratoryRate < 12 ||
                      reading.respiratoryRate > 20
                    )
                      return "MEDIUM RISK"
                    return "LOW RISK"
                  })()}</td>
                </tr>
                `
                : ""
            }
            ${
              reading.glucoseLevel
                ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Glucose Level</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${reading.glucoseLevel} mg/dL</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">70-99 mg/dL (fasting)</td>
                  <td style="padding: 8px; border: 1px solid #ddd; ${(() => {
                    if (reading.glucoseLevel < 40 || reading.glucoseLevel > 200)
                      return "color: #d32f2f; font-weight: bold;"
                    if (reading.glucoseLevel < 70 || reading.glucoseLevel > 125)
                      return "color: #f57c00; font-weight: bold;"
                    return "color: #388e3c; font-weight: bold;"
                  })()}">${(() => {
                    if (reading.glucoseLevel < 40 || reading.glucoseLevel > 200)
                      return "HIGH RISK"
                    if (reading.glucoseLevel < 70 || reading.glucoseLevel > 125)
                      return "MEDIUM RISK"
                    return "LOW RISK"
                  })()}</td>
                </tr>
                `
                : ""
            }
            ${
              reading.oxygenSaturation
                ? `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Oxygen Saturation</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${reading.oxygenSaturation}%</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">95-100%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; ${(() => {
                    if (reading.oxygenSaturation < 88)
                      return "color: #d32f2f; font-weight: bold;"
                    if (reading.oxygenSaturation < 95)
                      return "color: #f57c00; font-weight: bold;"
                    return "color: #388e3c; font-weight: bold;"
                  })()}">${(() => {
                    if (reading.oxygenSaturation < 88) return "HIGH RISK"
                    if (reading.oxygenSaturation < 95) return "MEDIUM RISK"
                    return "LOW RISK"
                  })()}</td>
                </tr>
                `
                : ""
            }
          </tbody>
        </table>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-top: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Readings Taken At:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${formatDateTime(reading.createdAt)}</div>
        </div>
      </div>
    </div>
    <div style="padding: 16px; padding-top: 0px; box-sizing: border-box; margin: 4px; font-family: OpenSans, system-ui, sans-serif; page-break-before: always;">
      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Medical History</div>
        <div style="font-size: 10.5pt; line-height: 1.5;">${patient.medicalHistory}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Allergies</div>
        ${patient.allergies
          .split(",")
          .map(
            allergy =>
              `<div style="font-size: 10.5pt; line-height: 1.5;">${allergy}</div>`
          )
          .join("")}
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Report Summary</div>
        <div style="font-size: 10.5pt; line-height: 1.5;">${report.summary}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Detailed Analysis</div>
        <div style="font-size: 10.5pt; line-height: 1.5;">${report.detailedAnalysis}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Diagnosis</div>
        <div style="font-size: 10.5pt; line-height: 1.5;">${report.diagnosis}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Recommendations</div>
        <div style="font-size: 10.5pt; line-height: 1.5;">${report.recommendations}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Urgency Level</div>
        <div style="${urgencyStyle()}">${report.urgencyLevel}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Tests</div>
        <div style="font-size: 10.5pt; line-height: 1.5;">${report.tests}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Additional Notes</div>
        <div style="font-size: 10.5pt; line-height: 1.5;">${report.additionalNotes}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 13.5pt; font-weight: bold; margin: 16px 0 8px; color: #010101;  font-family: Montserrat, system-ui, sans-serif;">Report Details</div>
        <div style="font-size: 10.5pt; line-height: 1.5;">Report ID: <span style=" font-family: MartianMono, monospace;">${report.id.substring(0, 6)}</span></div>
        <div style="font-size: 10.5pt; line-height: 1.5;">Date: ${formatDateTime(report.createdAt)}</div>
        ${
          !patient.cured && report.followupSchedule
            ? `<div style="font-size: 10.5pt; line-height: 1.5;">Scheduled: ${cronstrue.toString(report.followupSchedule)}</div>`
            : ``
        }
      </div>

      <div style="margin-top: auto;">
        <div style="margin-top: 20px; font-size: 9pt; text-align: center; color: #565656; font-weight: 500;">
          Generated on ${formatDateTime(report.createdAt)} by AI based on
          readings taken by Dr. ${doctor.name}
        </div>
        <div style="margin-top: 4px; font-size: 9pt; text-align: center; color: #565656; font-weight: 500;">
          This report is confidential and intended for medical use only.
        </div>
        <div style="margin-top: 4px; font-size: 9pt; text-align: center; color: #565656; font-weight: 500;">
          Report generated by
          <a href="https://smartmed-wli7.onrender.com" style="color: #007bff; text-decoration: none;">SmartMed</a> AI
        </div>
      </div>
    </div>
  `

  return fullMarkup
    ? `
      <html>
      <body>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
        }
      </style>
      ${String(body)
        .replace(/, system-ui/g, "")
        .replace(/, sans-serif/g, "")
        .replace(/, monospace/g, "")
        .toString()}
      </body>
      </html>
      `
    : body
}
