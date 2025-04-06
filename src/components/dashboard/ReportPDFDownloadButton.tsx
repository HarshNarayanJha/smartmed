"use client"

import getPDFHTMLTemplate from "@/utils/getPDFHTMLTemplate"
import { Doctor, Patient, Reading, Report } from "@prisma/client"
import { Document, Font, Page } from "@react-pdf/renderer"
import { Download, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { Html } from "react-pdf-html"
import { Button } from "../ui/button"
const PDFDownloadLink = dynamic(
  () => import("@/components/dashboard/PDFDownloadLink"),
  {
    ssr: false,
    loading: () => (
      <Button disabled style={{ opacity: 0.4 }}>
        <Loader2 className="mr-2 animate-spin" />
        Baking PDF
      </Button>
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
    <Document
      author="SmartMed AI"
      title={`AI Medical Report for ${patient.name}`}
      creationDate={report.createdAt}
    >
      <Page size="A4">
        <Html resetStyles={true} style={{ fontSize: 10 }}>
          {html}
        </Html>
      </Page>
    </Document>
  )
}

Font.register({
  family: "Montserrat",
  fonts: [
    {
      fontStyle: "italic",
      fontWeight: 100,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R8aX8.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 200,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqyR9aX8.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 300,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq_p9aX8.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 400,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9aX8.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 500,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq5Z9aX8.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 600,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq3p6aX8.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 700,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq0N6aX8.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 800,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqyR6aX8.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 900,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqw16aX8.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 100,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Uw-.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 200,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr6Ew-.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 300,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCs16Ew-.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 400,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 500,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew-.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 600,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170w-.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 700,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 800,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr70w-.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 900,
      src: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvC70w-.ttf"
    }
  ]
})

Font.register({
  family: "OpenSans",
  fonts: [
    {
      fontStyle: "italic",
      fontWeight: 300,
      src: "https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk5hkaVc.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 400,
      src: "https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk8ZkaVc.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 500,
      src: "https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk_RkaVc.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 600,
      src: "https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0RkxhjaVc.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 700,
      src: "https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0RkyFjaVc.ttf"
    },
    {
      fontStyle: "italic",
      fontWeight: 800,
      src: "https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk0ZjaVc.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 300,
      src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsiH0C4n.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 400,
      src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4n.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 500,
      src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjr0C4n.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 600,
      src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1y4n.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 700,
      src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4n.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 800,
      src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgshZ1y4n.ttf"
    }
  ]
})

Font.register({
  family: "MartianMono",
  fonts: [
    {
      fontStyle: "normal",
      fontWeight: 300,
      src: "https://fonts.gstatic.com/s/martianmono/v3/2V08KIcADoYhV6w87xrTKjs4CYElh_VS9YA4TlTnQzaVMIE6j15dYY00u86W.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 400,
      src: "https://fonts.gstatic.com/s/martianmono/v3/2V08KIcADoYhV6w87xrTKjs4CYElh_VS9YA4TlTnQzaVMIE6j15dYY1qu86W.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 500,
      src: "https://fonts.gstatic.com/s/martianmono/v3/2V08KIcADoYhV6w87xrTKjs4CYElh_VS9YA4TlTnQzaVMIE6j15dYY1Yu86W.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 600,
      src: "https://fonts.gstatic.com/s/martianmono/v3/2V08KIcADoYhV6w87xrTKjs4CYElh_VS9YA4TlTnQzaVMIE6j15dYY20vM6W.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 700,
      src: "https://fonts.gstatic.com/s/martianmono/v3/2V08KIcADoYhV6w87xrTKjs4CYElh_VS9YA4TlTnQzaVMIE6j15dYY2NvM6W.ttf"
    },
    {
      fontStyle: "normal",
      fontWeight: 800,
      src: "https://fonts.gstatic.com/s/martianmono/v3/2V08KIcADoYhV6w87xrTKjs4CYElh_VS9YA4TlTnQzaVMIE6j15dYY3qvM6W.ttf"
    }
  ]
})

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

          return (
            <Button className="group" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Loading PDF
                </>
              ) : (
                <>
                  <Download className="translate-y-0 transition-transform ease-out group-hover:translate-y-1" />
                  Download PDF
                </>
              )}
            </Button>
          )
        }}
      </PDFDownloadLink>
    </div>
  )
}
