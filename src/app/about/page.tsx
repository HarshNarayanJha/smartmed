import Footer from "@/components/Footer"

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
                At SmartMed, we're dedicated to improving healthcare through
                innovative technology solutions that empower both patients and
                healthcare providers.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="font-semibold text-2xl">Our Vision</h2>
              <p className="text-muted-foreground">
                We envision a world where healthcare is accessible, efficient,
                and personalized for everyone, everywhere.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-lg border p-6">
            <h2 className="mb-4 font-semibold text-2xl">Our Team</h2>
            <p className="mb-6 text-muted-foreground">
              Our diverse team of healthcare professionals, engineers, and
              designers work together to create solutions that make a
              difference.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Team members could be added here */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
