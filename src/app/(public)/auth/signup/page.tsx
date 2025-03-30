import SignupForm from "@/components/auth/SignupForm"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import getUser from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <Card className="m-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center font-bold text-2xl">
          Create an Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <SignupForm />
    </Card>
  )
}
