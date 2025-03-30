"use client"

import { login } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export default function LoginForm() {
  const [isPending, startTransition] = useTransition()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    console.log(formData)
    startTransition(async () => {
      const { errorMessage } = await login(formData)

      if (!errorMessage) {
        toast.success("Logged In", { description: "Welcome Back" })
        redirect("/dashboard")
      } else {
        toast.error(errorMessage)
      }
    })
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="w-full">
        {isPending ? <Loader2 className="animate-spin" /> : "Log In"}
      </Button>
    </form>
  )
}
