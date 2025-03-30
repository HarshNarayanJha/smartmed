import { Calendar, Search, Settings, UserPlus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { prisma } from "@/db/prisma"
import getUser from "@/utils/supabase/server"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "My Patients",
    url: "/dashboard/patients",
    icon: UserPlus
  },
  {
    title: "Appointments",
    url: "/dashboard/appointments",
    icon: Calendar
  }
]

export default async function DashboardSidebar() {
  const user = await getUser()

  if (!user) return null

  const userData: Doctor | null = await prisma.doctor.findUnique({
    where: {
      id: user.id
    }
  })

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
