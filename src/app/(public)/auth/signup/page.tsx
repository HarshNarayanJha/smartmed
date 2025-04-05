import SignupForm from "@/components/auth/SignupForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import getUser from "@/utils/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const user = await getUser()

  if (user && user.aud) {
    redirect("/dashboard")
  }

  return (
    <Card className="m-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center font-bold font-title text-2xl tracking-tight">
          Create your Account
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-500 hover:text-blue-700"
          >
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
