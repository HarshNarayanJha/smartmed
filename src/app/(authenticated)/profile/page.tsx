import { prisma } from "@/db/prisma"
import getUser from "@/utils/supabase/server"
import { Doctor } from "@prisma/client"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) redirect("/")

  const userData: Doctor | null = await prisma.doctor.findUnique({
    where: {
      id: user.id
    }
  })

  if (!userData) redirect("/")

  return (
    <>
      <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-2xl">Profile</h1>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Name</label>
            <p className="px-2 py-1">{userData.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Email</label>
            <p className="px-2 py-1">{user.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Patients</label>
            <p className="px-2 py-1">0</p>
          </div>
        </div>
      </main>
    </>
  )
}
