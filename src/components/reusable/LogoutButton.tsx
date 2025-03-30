"use client"

import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function LogoutButton({
  textOnly = false
}: { textOnly?: boolean }) {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)

    const { errorMessage } = await logout()

    if (!errorMessage) {
      toast.success("Logged out", {
        description: "You have been successfully logged out"
      })
      router.push("/")
    } else {
      toast.error("Logout failed", {
        description: errorMessage
      })
    }

    setLoading(false)
    console.log("Logging out...")
  }

  return textOnly ? (
    <span onClick={handleLogout} style={{ cursor: "pointer" }}>
      {loading ? <Loader2 className="animate-spin" /> : "Logout"}
    </span>
  ) : (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  )
}
