import { prisma } from "@/db/prisma"
import { GoogleGenAI, Type } from "@google/genai"

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!
const ai = new GoogleGenAI({ apiKey })

const GENERATE_REPORT_PROMPT = `
You are a highly qualified medical professional tasked with generating a comprehensive medical report based on the given reading data.

Analyze the information provided and create a detailed, accurate, and professional medical report. Your response should follow this exact JSON schema:

{
  "summary": "Brief overview of key findings",
  "detailedAnalysis": "In-depth analysis of all readings and measurements",
  "diagnosis": "Professional diagnosis based on the readings",
  "recommendations": "Treatment recommendations and follow-up suggestions",
  "urgencyLevel": "Low/Medium/High - indicate if immediate attention is required",
  "additionalNotes": "Any other relevant medical observations or concerns"
}

Your report should:
- Use formal medical terminology appropriately
- Be factually accurate based only on the data provided
- Maintain a professional, clinical tone
- Avoid speculative statements unless clearly marked as such
- Include specific values from the readings when relevant
- Format all values with appropriate units
- Prioritize patient health and safety in all recommendations

Remember to be thorough but concise. This report will be used by healthcare professionals to make clinical decisions.

Here are the readings in the json format:

`

export async function generateReport(readingId: string, patientId: string) {
  try {
    const reading = await prisma.reading.findUnique({
      where: {
        id: readingId,
        patientId: patientId
      }
    })

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: GENERATE_REPORT_PROMPT + JSON.stringify(reading),
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
            additionalNotes: { type: Type.STRING, nullable: false }
          },
          required: [
            "summary",
            "detailedAnalysis",
            "diagnosis",
            "recommendations",
            "urgencyLevel",
            "additionalNotes"
          ]
        }
      }
    })

    return {
      ...JSON.parse(response.text || "{}"),
      errorMessage: null
    }
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      return { errorMessage: error.message }
    } else {
      return { errorMessage: "An unknown error occurred" }
    }
  }
}

export async function createReport(
  reportData: Omit<Report, "id" | "createdAt" | "updatedAt">
): Promise<Report> {
  try {
    const report = await prisma.report.create({
      data: reportData
    })

    return report
  } catch (error) {
    console.log(error)
    throw new Error("Failed to create report")
  }
}

export async function getReportById(reportId: string): Promise<Report | null> {
  try {
    const report = await prisma.report.findUnique({
      where: {
        id: reportId
      }
    })

    return report
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get report")
  }
}

export async function getReportsByPatientId(
  patientId: string
): Promise<Report[]> {
  try {
    const reports = await prisma.report.findMany({
      where: {
        patientId
      }
    })

    return reports
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get reports")
  }
}

export async function getReportsByDoctorId(
  doctorId: string
): Promise<Report[]> {
  try {
    const reports = await prisma.report.findMany({
      where: {
        doctorId
      }
    })

    return reports
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get reports")
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
    console.log(error)
    throw new Error("Failed to delete report")
  }
}
