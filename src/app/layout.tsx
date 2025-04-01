import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/ThemeProvider"

export const metadata: Metadata = {
  title: "SmartMed",
  description: "SmartMed, A new place to take care of the medical reports as with SmartMed we provide a cloud-based register for hassle-free report generation",
  appleWebApp: {
    title: "SmartMed"
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
      <body className="scroll-smooth">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
