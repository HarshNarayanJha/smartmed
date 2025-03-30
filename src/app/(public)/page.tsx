import Footer from "@/components/reusable/Footer"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-bold text-4xl">
              Transforming Patient Care with AI-Powered Insights
            </h2>
            <p className="mb-8 text-muted-foreground text-xl">
              SmartMed helps doctors track patient data and deliver better
              outcomes through advanced analytics and artificial intelligence.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button className="rounded-md px-6 py-3 transition-colors">
                Get Started
              </Button>
              <Button
                variant="outline"
                className="rounded-md px-6 py-3 transition-colors"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl">
            Powerful Features for Modern Healthcare
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20 5H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                  <path d="M4 12V7a2 2 0 0 1 2-2"></path>
                  <path d="M10 10h8"></path>
                  <path d="M10 14h8"></path>
                  <path d="M10 18h4"></path>
                </svg>
              </div>
              <h3 className="mb-2 font-medium text-xl">
                Patient Data Tracking
              </h3>
              <p className="text-muted-foreground">
                Comprehensive dashboard to monitor patient vitals, medication,
                and treatment progress in real-time.
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2H2v10h10V2Z"></path>
                  <path d="M22 12h-10v10h10V12Z"></path>
                  <path d="M12 12H2v10h10V12Z"></path>
                  <path d="M22 2h-10v10h10V2Z"></path>
                </svg>
              </div>
              <h3 className="mb-2 font-medium text-xl">AI-Powered Diagnosis</h3>
              <p className="text-muted-foreground">
                Advanced algorithms to help identify patterns and suggest
                potential diagnoses based on patient history.
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="mb-2 font-medium text-xl">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Seamless communication tools for healthcare teams to coordinate
                care and share insights securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl">
            Why Doctors Choose SmartMed
          </h2>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <div>
                    <h3 className="font-medium">Save 5+ hours per week</h3>
                    <p className="text-muted-foreground">
                      Reduce administrative burden with automated data entry and
                      analysis.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <div>
                    <h3 className="font-medium">Improve diagnostic accuracy</h3>
                    <p className="text-muted-foreground">
                      AI-assisted technology helps identify potential issues
                      that might be overlooked.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <div>
                    <h3 className="font-medium">
                      Enhance patient satisfaction
                    </h3>
                    <p className="text-muted-foreground">
                      Provide more personalized care with comprehensive patient
                      insights.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <blockquote className="text-lg text-muted-foreground italic">
                "SmartMed has revolutionized my practice. The AI-powered
                insights help me make more informed decisions, and the patient
                tracking features ensure nothing falls through the cracks."
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full"></div>
                <div>
                  <p className="font-medium">Dr. Sarah Johnson</p>
                  <p className="text-muted-foreground text-sm">
                    Cardiologist, Memorial Hospital
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 font-bold text-3xl">
            Ready to transform your practice?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
            Join thousands of healthcare professionals who trust SmartMed to
            help them deliver better patient outcomes.
          </p>
          <Button size="lg" className="rounded-md px-6 py-3">
            Get Started Today
          </Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
