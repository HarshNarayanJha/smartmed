import Footer from "@/components/reusable/Footer"

export default function AboutPage() {
  return (
    <>
      <div className="container mx-auto min-h-[50svh] py-12">
        <div className="space-y-6">
          <h1 className="font-bold text-4xl tracking-tight">About SmartMed</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="font-semibold text-2xl">Our Mission</h2>
              <p className="text-muted-foreground">
                At SmartMed, we explored improving healthcare through innovative
                technology solutions that could empower both patients and
                healthcare providers.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="font-semibold text-2xl">Our Vision</h2>
              <p className="text-muted-foreground">
                We envision a future world where healthcare is accessible,
                efficient, and personalized for everyone, everywhere.
              </p>
            </div>
          </div>

          {/* Disclaimer Section */}
          <div className="mt-8 rounded-lg border border-destructive bg-destructive/10 p-6">
            <h2 className="mb-4 font-semibold text-2xl text-destructive">
              Important Disclaimer
            </h2>
            <div className="space-y-3 text-destructive/90">
              <p>
                <strong>Please Note:</strong> SmartMed is currently a{" "}
                <strong>hackathon project submission</strong> and{" "}
                <strong>not a real, functional product</strong>.
              </p>
              <p>
                The features demonstrated, especially any AI-generated reports
                or analyses, are for conceptual purposes only and{" "}
                <strong>
                  should NOT be trusted for medical diagnosis or treatment
                  decisions
                </strong>
                . AI outputs in this context can be inaccurate or misleading.
              </p>
              <p>
                <strong>
                  Always consult with a qualified healthcare professional
                </strong>{" "}
                for any health concerns or before making any decisions related
                to your health or treatment. Do not rely on information from
                this prototype.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
