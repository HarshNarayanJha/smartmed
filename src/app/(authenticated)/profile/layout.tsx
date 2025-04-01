import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import Header from "@/components/reusable/Header"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col px-4 pt-4 xl:px-8">
          <SidebarTrigger className="mb-6" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
