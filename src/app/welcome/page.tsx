import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function WelcomeAboard() {
  return (
    <>
      <div className="container mx-auto min-h-[50svh] px-4 py-10">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <div className="mb-4 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">
              Welcome Aboard!
            </CardTitle>
            <CardDescription className="text-center">
              We're excited to have you join us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Your account has been successfully created. Now you can login
                and start managing your patients data.
              </p>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  <span>Personalized dashboard</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  <span>Advance AI features</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button>
              <Link href="/dashboard">Go To Your Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  )
}
