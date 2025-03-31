import { Calendar, FileText, Plus, UsersIcon } from "lucide-react"

import { getDoctorById } from "@/actions/doctor"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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
        <Link href="/dashboard" className="flex items-center gap-2">
          {userData.name}'s Dashboard
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Patients</SidebarGroupLabel>
          <SidebarGroupAction title="Add Patient">
            <Link href="/dashboard/patients/new">
              <Plus /> <span className="sr-only">New Patient</span>
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
    </Sidebar>
  )
}
