import {
  ChevronUp,
  FileText,
  Github,
  Info,
  LogOutIcon,
  Plus,
  User2,
  UserCog,
  UsersIcon
} from "lucide-react"

import { getDoctorById } from "@/actions/doctor"
import LogoutButton from "@/components/reusable/LogoutButton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "My Patients",
    url: "/dashboard/patients",
    icon: UsersIcon
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FileText
  }
]

export default async function DashboardSidebar() {
  const user = await getUser()

  if (!user) return null

  const userData: Doctor | null = await getDoctorById(user.id)

  if (!userData) return null

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="p-4 font-bold text-xl shadow-md">
        <Link href="/dashboard" className="flex items-center gap-2 font-title">
          Dr. {userData.name}'s Dashboard
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-title">Patients</SidebarGroupLabel>
          <SidebarGroupAction title="Add Patient">
            <Link href="/dashboard/patients/new">
              <Plus size={16} /> <span className="sr-only">New Patient</span>
            </Link>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel className="font-body">
              SmartMed
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/about">
                      <Info />
                      About
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="https://github.com/HarshNarayanJha/smartmed"
                      target="_blank"
                    >
                      <Github />
                      This is a Prototype Version
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
        <div className="w-full border-t p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="font-title">
                    <User2 /> {userData.name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top">
                  <DropdownMenuItem>
                    <UserCog />
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon />
                    <LogoutButton textOnly={true} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
