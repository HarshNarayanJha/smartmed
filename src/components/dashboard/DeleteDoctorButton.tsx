"use client"

import { deleteAccount, logout } from "@/actions/auth"
import { deleteDoctor } from "@/actions/doctor"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Doctor } from "@prisma/client"
import { AlertTriangle, Trash2 } from "lucide-react"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { Button } from "../ui/button"

export default function DeleteDoctorButton({ doctor }: { doctor: Doctor }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete My Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your and
            your patient's data from our servers. There is{" "}
            <span className="font-extrabold text-destructive">ABSOLUTELY</span>{" "}
            no way to recover this data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground"
            onClick={async () => {
              toast.promise(deleteDoctor(doctor.id), {
                loading: "Deleting account...",
                success: "Account deleted successfully",
                error: "Failed to delete account"
              })
              await deleteAccount(doctor.id)
              await logout()
              redirect(`/`)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
