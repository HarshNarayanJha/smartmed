"use client"

import getPDFHTMLTemplate from "@/utils/getPDFHTMLTemplate"
import { Doctor, Patient, Reading, Report } from "@prisma/client"
import { Document, Page } from "@react-pdf/renderer"
import { Download, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { Html } from "react-pdf-html"
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

export function ReportPDFDocument({
  report,
  reading,
  patient,
  doctor
}: ReportPDFButtonParams) {
  const html = getPDFHTMLTemplate(report, reading, patient, doctor)

  return (
    <Document>
      <Page size="A4">
        <Html resetStyles={true}>{html}</Html>
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
