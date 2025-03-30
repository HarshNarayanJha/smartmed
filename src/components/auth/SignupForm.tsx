"use client"

import { signup } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export default function SignupForm() {
  const [isPending, startTransition] = useTransition()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    console.log(formData)
    startTransition(async () => {
      const { errorMessage } = await signup(formData)

      if (!errorMessage) {
        toast.success("Signed Up", {
          description:
            "Welcome Aboard! Check your Inbox to confirm your account!"
        })
        redirect("/dashboard")
      } else {
        toast.error(errorMessage)
      }
    })
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your name"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </Button>
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
    </form>
  )
}
