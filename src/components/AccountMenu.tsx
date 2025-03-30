import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { prisma } from "@/db/prisma"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import {
  LayoutDashboardIcon,
  LogOutIcon,
  UserCircle,
  UserPen
} from "lucide-react"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default async function AccountMenu() {
  const user = await getUser()

  if (!user) {
    return null
  }

  const userData: Doctor | null = await prisma.doctor.findUnique({
    where: {
      id: user.id
    }
  })

  if (!userData) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserCircle />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <div className="space-y-1 p-2">
          <DropdownMenuLabel className="font-bold text-lg">
            {userData.name}
          </DropdownMenuLabel>
          <DropdownMenuLabel className="truncate text-muted-foreground text-sm">
            {userData.email}
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserPen />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboardIcon />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          <LogoutButton textOnly={true} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
