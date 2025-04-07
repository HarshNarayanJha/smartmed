"use client"

import { deletePatient } from "@/actions/patient"
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
import { Patient } from "@prisma/client"
import { AlertTriangle, Trash2 } from "lucide-react"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { Button } from "../ui/button"

export default function DeletePatientButton({ patient }: { patient: Patient }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete Patient
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Patient
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            patient and remove patient's data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground"
            onClick={async () => {
              toast.promise(deletePatient(patient.id), {
                loading: "Deleting patient...",
                success: "Patient deleted successfully",
                error: "Failed to delete patient"
              })
              // FIXME: This actually is a workaround as after deletePatient (and revalidatePath inside it)
              // redirect occurs, but the deleted patient is still visible in the list
              await new Promise(resolve => setTimeout(resolve, 500))
              redirect(`/dashboard/patients`)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
