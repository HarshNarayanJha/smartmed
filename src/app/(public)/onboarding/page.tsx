import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Mail } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Account Confirmation | SmartMed",
    description: "Check your inbox and confirm your account to continue.",
  }
}

export default function ConfirmEmail() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <Card className="mx-auto max-w-xl px-16">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Check your inbox</CardTitle>
          <CardDescription>
            We've sent you a verification email. Please check your inbox and
            confirm your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground text-sm">
            If you don't see the email, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link
            href="/dashboard"
            className={buttonVariants({ className: "w-full" })}
          >
            I've confirmed my account
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
