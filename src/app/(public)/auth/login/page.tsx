import LoginForm from "@/components/auth/LoginForm"
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

export default async function LoginPage() {
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <Card className="m-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center font-bold font-title text-2xl tracking-tight">
          Log in to your Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials below to log in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-blue-500 hover:text-blue-700"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
