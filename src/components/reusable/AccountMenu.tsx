import { getDoctorById } from "@/actions/doctor"
import LogoutButton from "@/components/reusable/LogoutButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import {
  LayoutDashboardIcon,
  LogOutIcon,
  UserCircle,
  UserPen
} from "lucide-react"
import Link from "next/link"

export default async function AccountMenu() {
  const user = await getUser()

  if (!user) {
    return null
  }

  const userData: Doctor | null = await getDoctorById(user.id)

  if (!userData) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserCircle />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <div className="flex flex-row space-x-1 p-2">
          <Avatar className="m-auto h-14 w-14">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`}
              alt={userData.name}
            />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-end">
            <DropdownMenuLabel className="font-bold text-lg">
              {userData.name}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="truncate text-muted-foreground text-sm">
              {userData.email}
            </DropdownMenuLabel>
          </div>
        </div>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserPen />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
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
