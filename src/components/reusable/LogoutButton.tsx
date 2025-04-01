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

    toast.promise(logout(), {
      loading: "Logging out...",
      success: data => {
        if (!data.errorMessage) {
          router.push("/")
          return (
            <div>
              <div>Logged out</div>
              <div>You have been successfully logged out</div>
            </div>
          )
        } else {
          throw new Error(data.errorMessage)
        }
      },
      error: error => {
        return (
          <div>
            <div>Logout failed</div>
            <div>{error.message}</div>
          </div>
        )
      },
      finally: () => {
        setLoading(false)
        console.log("Logging out...")
      }
    })
  }

  return textOnly ? (
    <span onClick={handleLogout} className="h-full w-full cursor-pointer">
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
