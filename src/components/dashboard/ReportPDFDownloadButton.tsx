"use client"

import {
  calculateAge,
  calculateBmi,
  formatDate,
  formatDateTime
} from "@/lib/utils"
import { Doctor, Patient, Reading, Report } from "@prisma/client"
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer"
import { Download, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "../ui/button"
const PDFDownloadLink = dynamic(
  () => import("@/components/dashboard/PDFDownloadLink"),
  {
    ssr: false,
    loading: () => (
      <div>
        <Loader2 />
      </div>
    )
  }
)

export type ReportPDFButtonParams = {
  report: Report
  reading: Reading
  patient: Patient
  doctor: Doctor
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 32
  },
  header: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    borderBottom: "1px solid #CCCCCC",
    paddingBottom: 10
  },
  headerLeft: {
    flex: 1
  },
  headerRight: {
    flex: 1,
    textAlign: "right"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#010101",
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#010101",
    backgroundColor: "#efefef",
    padding: 8,
    borderRadius: 4
  },
  section: {
    marginBottom: 18
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 12,
    lineHeight: 1.5,
    color: "#121212"
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: "justify"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 8
  },
  readingGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10
  },
  readingItem: {
    width: "33.33%",
    marginBottom: 8
  },
  urgencyHigh: {
    color: "#D32F2F",
    fontWeight: "bold",
    padding: "8px",
    lineHeight: 1,
    backgroundColor: "#FFCDD2",
    borderRadius: 4
  },
  urgencyMedium: {
    color: "#F57C00",
    fontWeight: "bold",
    padding: "8px",
    lineHeight: 1,
    backgroundColor: "#FFECB3",
    borderRadius: 4
  },
  urgencyLow: {
    color: "#388E3C",
    fontWeight: "bold",
    padding: "8px",
    lineHeight: 1,
    backgroundColor: "#C8E6C9",
    borderRadius: 4
  },
  footer: {
    marginTop: "auto",
    borderTop: "1px solid #CCCCCC",
    paddingTop: 10,
    fontSize: 10,
    textAlign: "center",
    color: "#363636",
    textDecoration: "none"
  }
})

export function ReportPDFDocument({
  report,
  reading,
  patient,
  doctor
}: ReportPDFButtonParams) {
  const getUrgencyStyle = () => {
    switch (report.urgencyLevel) {
      case "HIGH":
        return styles.urgencyHigh
      case "MEDIUM":
        return styles.urgencyMedium
      default:
        return styles.urgencyLow
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.text}>
              Dr. {doctor.name}, {doctor.degree}
            </Text>
            <Text style={styles.text}>{doctor.speciality}</Text>
            <Text style={styles.text}>
              Practice Since: {doctor.practiceStarted}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.text}>
              Report ID: {report.id.substring(0, 6)}
            </Text>
            <Text style={styles.text}>
              Date: {formatDateTime(report.createdAt)}
            </Text>
            <Text style={styles.text}>
              Scheduled: {report.followupSchedule}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.title}>Medical Report</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.text}>{patient.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>DOB:</Text>
            <Text style={styles.text}>
              {formatDate(patient.dob)} ({calculateAge(patient.dob)} years)
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.text}>{patient.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Blood Group:</Text>
            <Text style={styles.text}>{patient.bloodGroup}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Smoking Status:</Text>
            <Text style={styles.text}>{patient.smokingStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.text}>{patient.phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>{patient.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Readings</Text>
          <View style={{ ...styles.row, marginBottom: 16 }}>
            <Text style={styles.label}>Diagnosed For:</Text>
            <Text style={styles.text}>{reading.diagnosedFor}</Text>
          </View>
          <View style={styles.readingGrid}>
            {reading.height && (
              <View style={styles.readingItem}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Height:</Text> {reading.height} cm
                </Text>
              </View>
            )}
            {reading.weight && (
              <View style={styles.readingItem}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Weight:</Text> {reading.weight} kg
                </Text>
              </View>
            )}
            {reading.height && reading.weight && (
              <View style={styles.readingItem}>
                <Text style={styles.text}>
                  <Text style={styles.label}>BMI:</Text>{" "}
                  {calculateBmi(reading.weight, reading.height)} kg/m²
                </Text>
              </View>
            )}
            <View style={styles.readingItem}>
              <Text style={styles.text}>
                <Text style={styles.label}>Temperature:</Text>{" "}
                {reading.temperature}°C
              </Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.text}>
                <Text style={styles.label}>Heart Rate:</Text>{" "}
                {reading.heartRate} bpm
              </Text>
            </View>
            {reading.bpSystolic && reading.bpDiastolic && (
              <View style={styles.readingItem}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Blood Pressure:</Text>{" "}
                  {reading.bpSystolic}/{reading.bpDiastolic} mmHg
                </Text>
              </View>
            )}
            {reading.respiratoryRate && (
              <View style={styles.readingItem}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Respiratory Rate:</Text>{" "}
                  {reading.respiratoryRate} bpm
                </Text>
              </View>
            )}
            {reading.glucoseLevel && (
              <View style={styles.readingItem}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Glucose Level:</Text>{" "}
                  {reading.glucoseLevel} mg/dL
                </Text>
              </View>
            )}
            {reading.oxygenSaturation && (
              <View style={styles.readingItem}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Oxygen Saturation:</Text>{" "}
                  {reading.oxygenSaturation}%
                </Text>
              </View>
            )}
          </View>
          <View style={{ ...styles.row, marginTop: 32 }}>
            <Text style={styles.label}>Readings Taken At:</Text>
            <Text style={styles.text}>{formatDateTime(reading.createdAt)}</Text>
          </View>
        </View>
      </Page>
      <Page style={styles.page}>
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <Text style={styles.text}>{patient.medicalHistory}</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          {patient.allergies.split(",").map((allergy, index) => (
            <Text key={index} style={styles.text}>
              {allergy}
              <br />
            </Text>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Report Summary</Text>
          <Text style={styles.text}>{report.summary}</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Detailed Analysis</Text>
          <Text style={styles.text}>{report.detailedAnalysis}</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Text style={styles.text}>{report.diagnosis}</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <Text style={styles.text}>{report.recommendations}</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Urgency Level</Text>
          <Text style={[styles.text, getUrgencyStyle()]}>
            {report.urgencyLevel}
          </Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Tests</Text>
          <Text style={styles.text}>{report.tests}</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.text}>{report.additionalNotes}</Text>
        </View>

        <View style={styles.footer} wrap={false}>
          <Text>
            Generated on {report.createdAt.toLocaleString()} by AI based on
            readings taken by Dr. {doctor.name}
          </Text>
          <Text>
            This report is confidential and intended for medical use only.
          </Text>
          <Text style={{ marginTop: "4px" }}>
            Report generated by{" "}
            <Link href="https://smartmed-wli7.onrender.com/">SmartMed</Link> AI
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default function ReportPDFDownloadButton({
  report,
  reading,
  patient,
  doctor
}: ReportPDFButtonParams) {
  if (!report || !reading || !patient || !doctor) {
    return null
  }

  const REPORT_FILE_NAME = `SmartMed-Medical-Report-${report.id.substring(0, 6)}-${patient.id.substring(0, 6)}-${doctor.name}`

  return (
    <div>
      <PDFDownloadLink
        document={
          <ReportPDFDocument
            report={report}
            reading={reading}
            patient={patient}
            doctor={doctor}
          />
        }
        fileName={REPORT_FILE_NAME}
      >
        {({ blob: _blob, url: _url, loading, error }) => {
          if (error) {
            return <div>Error: {error.message}</div>
          }

          return loading ? (
            <Loader2 />
          ) : (
            <Button className="group">
              <Download className="translate-y-0 transition-transform ease-out group-hover:translate-y-1" />
              Download PDF
            </Button>
          )
        }}
      </PDFDownloadLink>
    </div>
  )
}
