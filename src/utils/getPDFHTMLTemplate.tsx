import {
  calculateAge,
  calculateBmi,
  formatDate,
  formatDateTime
} from "@/lib/utils"
import { Doctor, Patient, Reading, Report } from "@prisma/client"

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
        return `urgency-high`
      case "MEDIUM":
        return `urgency-medium`
      default:
        return `urgency-low`
    }
  }

  const body = `
    <div class="page">
      <div class="header">
        <div class="logo-container">
          <img
            src="${fullMarkup ? `/web-app-manifest-192x192.png` : `https://smartmed-wli7.onrender.com/web-app-manifest-192x192.png`}"
            alt="SmartMed Logo"
            class="logo"
          />
          <p>
            <strong>SmartMed</strong>
          </p>
          <p class="tagline">
            Your Health, Our Priority
          </p>
        </div>
        <div class="doctor-info">
          <div class="text">Dr. ${doctor.name}, ${doctor.degree}</div>
          <div class="text">${doctor.speciality}</div>
          <div class="text">Practice Since: ${doctor.practiceStarted}</div>
        </div>
      </div>

      <div>
        <div class="title">Medical Report</div>
      </div>

      <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="row">
          <div class="label">Name:</div>
          <div class="text">${patient.name}</div>
        </div>
        <div class="row">
          <div class="label">DOB:</div>
          <div class="text">
            ${formatDate(patient.dob)} (${calculateAge(patient.dob)} years)
          </div>
        </div>
        <div class="row">
          <div class="label">Gender:</div>
          <div class="text">${patient.gender}</div>
        </div>
        <div class="row">
          <div class="label">Blood Group:</div>
          <div class="text">${patient.bloodGroup}</div>
        </div>
        <div class="row">
          <div class="label">Smoking Status:</div>
          <div class="text">${patient.smokingStatus}</div>
        </div>
        <div class="row">
          <div class="label">Phone:</div>
          <div class="text">${patient.phoneNumber}</div>
        </div>
        <div class="row">
          <div class="label">Email:</div>
          <div class="text">${patient.email}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Current Readings</div>
        <div class="row" style="margin-bottom: 16px;">
          <div class="label">Diagnosed For:</div>
          <div class="text">${reading.diagnosedFor}</div>
        </div>
        <div class="reading-grid">
          ${
            reading.height
              ? `
            <div class="reading-item">
              <div class="text">
                <div class="label">Height:</div>
                ${reading.height} cm
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.weight
              ? `
            <div class="reading-item">
              <div class="text">
                <div class="label">Weight:</div>
                ${reading.weight} kg
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.height && reading.weight
              ? `
            <div class="reading-item">
              <div class="text">
                <div class="label">BMI:</div>
                ${calculateBmi(reading.weight, reading.height)} kg/m²
              </div>
            </div>
            `
              : ""
          }
          <div class="reading-item">
            <div class="text">
              <div class="label">Temperature:</div>
              ${reading.temperature}°C
            </div>
          </div>
          <div class="reading-item">
            <div class="text">
              <div class="label">Heart Rate:</div>
              ${reading.heartRate} bpm
            </div>
          </div>
          ${
            reading.bpSystolic && reading.bpDiastolic
              ? `
            <div class="reading-item">
              <div class="text">
                <div class="label">Blood Pressure:</div>
                ${reading.bpSystolic}/${reading.bpDiastolic} mmHg
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.respiratoryRate
              ? `
            <div class="reading-item">
              <div class="text">
                <div class="label">Respiratory Rate:</div>
                ${reading.respiratoryRate} bpm
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.glucoseLevel
              ? `
            <div class="reading-item">
              <div class="text">
                <div class="label">Glucose Level:</div>
                ${reading.glucoseLevel} mg/dL
              </div>
            </div>
            `
              : ""
          }
          ${
            reading.oxygenSaturation
              ? `
            <div class="reading-item">
              <div class="text">
                <div class="label">Oxygen Saturation:</div>
                ${reading.oxygenSaturation}%
              </div>
            </div>
            `
              : ""
          }
        </div>
        <div class="row" style="margin-top: 32px;">
          <div class="label">Readings Taken At:</div>
          <div class="text">${formatDateTime(reading.createdAt)}</div>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="section">
        <div class="section-title">Medical History</div>
        <div class="text">${patient.medicalHistory}</div>
      </div>

      <div class="section">
        <div class="section-title">Allergies</div>
        ${patient.allergies
          .split(",")
          .map(allergy => `<div class="text">${allergy}</div>`)
          .join("")}
      </div>

      <div class="section">
        <div class="section-title">Report Summary</div>
        <div class="text">${report.summary}</div>
      </div>

      <div class="section">
        <div class="section-title">Detailed Analysis</div>
        <div class="text">${report.detailedAnalysis}</div>
      </div>

      <div class="section">
        <div class="section-title">Diagnosis</div>
        <div class="text">${report.diagnosis}</div>
      </div>

      <div class="section">
        <div class="section-title">Recommendations</div>
        <div class="text">${report.recommendations}</div>
      </div>

      <div class="section">
        <div class="section-title">Urgency Level</div>
        <div class="text ${urgencyStyle()}">${report.urgencyLevel}</div>
      </div>

      <div class="section">
        <div class="section-title">Tests</div>
        <div class="text">${report.tests}</div>
      </div>

      <div class="section">
        <div class="section-title">Additional Notes</div>
        <div class="text">${report.additionalNotes}</div>
      </div>

      <div class="section">
        <div class="section-title">Report Details</div>
        <div class="text">Report ID: ${report.id.substring(0, 6)}</div>
        <div class="text">Date: ${formatDateTime(report.createdAt)}</div>
        <div class="text">Scheduled: ${report.followupSchedule}</div>
      </div>


      <div class="footer">
        <div>
          Generated on ${new Date(report.createdAt).toLocaleString()} by AI based on
          readings taken by Dr. ${doctor.name}
        </div>
        <div>
          This report is confidential and intended for medical use only.
        </div>
        <div style="margin-top: 4px;">
          Report generated by
          <a href="https://smartmed-wli7.onrender.com/">SmartMed</a> AI
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
        .page {
          padding: 32px;
          box-sizing: border-box;
          margin: 20px;
        }
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
        }
        .logo-container {
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: start;
        }
        .logo {
          max-height: 75px;
          max-width: 100%;
          object-fit: contain;
          margin-bottom: 10px;
          margin-left: 0px;
        }
        .tagline {
          font-size: 12px;
        }
        .doctor-info {
          text-align: right;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin: 20px 0;
          color: #010101;
          text-align: left;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin: 16px 0 8px;
          color: #010101;
        }
        .section {
          margin-bottom: 18px;
        }
        .label {
          font-weight: bold;
          margin-right: 5px;
          line-height: 1.5;
          font-size: 14px;
          color: #121212;
        }
        .text {
          font-size: 14px;
          line-height: 1.5;
          text-align: left;
        }
        .row {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 8px;
        }
        .reading-grid {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .reading-item {
          width: 33.33%;
          margin-bottom: 8px;
        }
        .urgency-high {
          color: #d32f2f;
          font-weight: bold;
          padding: 8px;
          line-height: 1;
        }
        .urgency-medium {
          color: #f57c00;
          font-weight: bold;
          padding: 8px;
          line-height: 1;
        }
        .urgency-low {
          color: #388e3c;
          font-weight: bold;
          padding: 8px;
          line-height: 1;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          text-align: center;
          color: #363636;
        }
        a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
      ${body}
      </body>
      </html>
      `
    : body
}
