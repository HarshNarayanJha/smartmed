import LitAnalytics from "@/components/reusable/LitAnalytics"
import type { Metadata } from "next"
import {
  Martian_Mono,
  Montserrat,
  Open_Sans
} from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/ThemeProvider"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: "500",
  display: "swap"
})

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
  display: "swap"
})

export const metadata: Metadata = {
  title: "SmartMed",
  description:
    "SmartMed, your intelligent patient data management solution to take care of your medical reports with a cloud-based medical readings register for hassle-free report generation",
  applicationName: "SmartMed",
  keywords: [
    "medical",
    "patient",
    "data",
    "management",
    "solution",
    "readings",
    "reports"
  ],
  authors: [
    { name: "Harsh Narayan Jha", url: "https://github.com/HarshNarayanJha" },
    { name: "Satyam Jha", url: "https://github.com/dev-satyamjha" }
  ],
  appleWebApp: {
    title: "SmartMed"
  },
  verification: {
    google: "FzcvzGKLeWAo10V8NUSQJdxd39sif48n5kRQ7iPY-Ek"
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${montserrat.variable} ${openSans.variable} ${martianMono.variable} antialiased`}
      >
        <LitAnalytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
