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

  if (user && user.aud) {
    redirect("/dashboard")
  }

  return (
    <Card className="m-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center font-bold text-2xl tracking-tight">
          Create your Account
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <SignupForm />
    </Card>
  )
}
