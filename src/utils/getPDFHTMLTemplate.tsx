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
    <div style="padding: 16px; box-sizing: border-box; margin: 8px; font-family: OpenSans, system-ui, sans-serif;">
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 10px;">
        <div style="display: flex; flex-direction: column; align-items: start; justify-content: start;">
          <img
            src="${fullMarkup ? `/web-app-manifest-192x192.png` : `https://smartmed-wli7.onrender.com/web-app-manifest-192x192.png`}"
            alt="SmartMed Logo"
            style="max-height: 75px; max-width: 100%; margin-bottom: 8px; margin-left: 0; margin-right: auto;"
          />
          <p style="margin-bottom: 4px; font-size: 16pt; font-family: Montserrat, system-ui, sans-serif;"><strong>SmartMed</strong></p>
          <p style="font-size: 9pt; margin: 0px;">Your Health, Our Priority</p>
        </div>
        <div style="text-align: right;">
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
        <div style="display: flex; flex-direction: row; flex-wrap: wrap; margin-bottom: 10px;">
          ${
            reading.height
              ? `
            <div style="width: 33.33%; margin-bottom: 8px;">
              <div style="font-size: 10.5pt; line-height: 1.5;">
                <div style="font-weight: bold; margin-right: 5px;">Height:</div>
                ${reading.height} cm
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.weight
              ? `
            <div style="width: 33.33%; margin-bottom: 8px;">
              <div style="font-size: 10.5pt; line-height: 1.5;">
                <div style="font-weight: bold; margin-right: 5px;">Weight:</div>
                ${reading.weight} kg
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.height && reading.weight
              ? `
            <div style="width: 33.33%; margin-bottom: 8px;">
              <div style="font-size: 10.5pt; line-height: 1.5;">
                <div style="font-weight: bold; margin-right: 5px;">BMI:</div>
                ${calculateBmi(reading.weight, reading.height)} kg/m²
              </div>
            </div>
            `
              : ""
          }
          <div style="width: 33.33%; margin-bottom: 8px;">
            <div style="font-size: 10.5pt; line-height: 1.5;">
              <div style="font-weight: bold; margin-right: 5px;">Temperature:</div>
              ${reading.temperature}°C
            </div>
          </div>
          <div style="width: 33.33%; margin-bottom: 8px;">
            <div style="font-size: 10.5pt; line-height: 1.5;">
              <div style="font-weight: bold; margin-right: 5px;">Heart Rate:</div>
              ${reading.heartRate} bpm
            </div>
          </div>
          ${
            reading.bpSystolic && reading.bpDiastolic
              ? `
            <div style="width: 33.33%; margin-bottom: 8px;">
              <div style="font-size: 10.5pt; line-height: 1.5;">
                <div style="font-weight: bold; margin-right: 5px;">Blood Pressure:</div>
                ${reading.bpSystolic}/${reading.bpDiastolic} mmHg
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.respiratoryRate
              ? `
            <div style="width: 33.33%; margin-bottom: 8px;">
              <div style="font-size: 10.5pt; line-height: 1.5;">
                <div style="font-weight: bold; margin-right: 5px;">Respiratory Rate:</div>
                ${reading.respiratoryRate} bpm
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.glucoseLevel
              ? `
            <div style="width: 33.33%; margin-bottom: 8px;">
              <div style="font-size: 10.5pt; line-height: 1.5;">
                <div style="font-weight: bold; margin-right: 5px;">Glucose Level:</div>
                ${reading.glucoseLevel} mg/dL
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.oxygenSaturation
              ? `
            <div style="width: 33.33%; margin-bottom: 8px;">
              <div style="font-size: 10.5pt; line-height: 1.5;">
                <div style="font-weight: bold; margin-right: 5px;">Oxygen Saturation:</div>
                ${reading.oxygenSaturation}%
              </div>
            </div>
            `
              : ""
          }
        </div>
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-top: 8px;">
          <div style="font-weight: bold; margin-right: 5px; line-height: 1.5; font-size: 10.5pt; color: #121212;">Readings Taken At:</div>
          <div style="font-size: 10.5pt; line-height: 1.5; text-align: left;">${formatDateTime(reading.createdAt)}</div>
        </div>
      </div>
    </div>
    <div style="padding: 16px; padding-top: 0px; box-sizing: border-box; margin: 4px; font-family: OpenSans, system-ui, sans-serif;">
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
