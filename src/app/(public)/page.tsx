import Footer from "@/components/reusable/Footer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  BrainCog,
  CalendarClock,
  Clock,
  HeartPulse
} from "lucide-react"
import Link from "next/link"

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
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-md px-6 py-3 transition-colors"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
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
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mb-2 font-title text-xl">
                  Patient Data Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive dashboard to monitor patient vitals, medication,
                  and treatment progress in real-time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mb-2 font-title text-xl">
                  AI-Powered Diagnosis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced algorithms to help identify patterns and suggest
                  potential diagnoses based on patient history.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mb-2 font-title text-xl">
                  Automated Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set up automated reminders for appointments and follow-ups to
                  ensure patients stay on track with their care plans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl">
            Why Doctors Choose SmartMed
          </h2>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Save 5+ hours per week
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Reduce administrative burden with automated data entry and
                    analysis. Focus more on patient care, less on paperwork.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BrainCog className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Improve diagnostic accuracy
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    AI-assisted technology helps identify potential issues that
                    might be overlooked, leveraging vast datasets for insights.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Enhance patient satisfaction
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Provide more personalized and proactive care with
                    comprehensive patient insights and timely interventions.
                  </p>
                </div>
              </div>
            </div>
            <Card className="flex flex-col justify-center">
              <CardContent className="p-6">
                <blockquote className="border-primary border-l-4 pl-4 text-lg text-muted-foreground italic">
                  "SmartMed has revolutionized my practice. The AI-powered
                  insights help me make more informed decisions, and the patient
                  tracking features ensure nothing falls through the cracks."
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {/* Add AvatarImage if an image source is available */}
                    {/* <AvatarImage src="https://github.com/shadcn.png" alt="Dr. Sarah Johnson" /> */}
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Dr. Piyush Kumar</p>
                    <p className="text-muted-foreground text-sm">
                      Dermatologist, ...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 font-bold text-3xl">
            Ready to transform your practice?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of healthcare professionals who trust SmartMed to
            help them deliver better patient outcomes.
          </p>
          <Button size="lg" asChild className="group rounded-md px-8 py-3">
            <Link href="/auth/signup" className="flex items-center gap-2">
              Get Started Today
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="mt-10">
        <Footer />
      </div>
    </>
  )
}
