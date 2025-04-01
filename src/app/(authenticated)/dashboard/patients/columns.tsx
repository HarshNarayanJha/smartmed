"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import {
  CheckCircle,
  CheckSquare,
  Copy,
  EyeIcon,
  MoreHorizontal,
  Notebook,
  PlusCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"

import { markPatientCured } from "@/actions/patient"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { calculateAge } from "@/lib/utils"
import { Patient } from "@prisma/client"
import { useTransition } from "react"
import { toast } from "sonner"

const ActionsCell = ({ patient }: { patient: Patient }) => {
  const [isPending, startTransition] = useTransition()

  const curePatient = () => {
    startTransition(async () => {
      toast.promise(markPatientCured(patient.id), {
        loading: "Curing patient...",
        success: "Patient cured!",
        error: "Failed to cure patient"
      })
    })
  }

  return (
    <div className="flex flex-row justify-end gap-4">
      <Button variant="outline" asChild>
        <Link href={`/dashboard/patients/${patient.id}`}>
          <EyeIcon />
          View
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/dashboard/patients/${patient.id}/readings/new`}>
          <PlusCircle />
          Take Readings
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(patient.name.toString())
            }
          >
            <Copy />
            Copy Patient Name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/patients/${patient.id}/readings`}>
              <EyeIcon />
              View Readings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/patients/${patient.id}/reports`}>
              <Notebook />
              View Reports
            </Link>
          </DropdownMenuItem>
          {!patient.cured && (
            <DropdownMenuItem
              asChild
              onClick={() => curePatient()}
              disabled={isPending}
            >
              <span className="cursor-pointer font-semibold text-green-500">
                <CheckSquare className="text-green-500" />
                Mark Cured
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "index",
    header: () => <div>#</div>,
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    }
  },
  {
    accessorKey: "name",
    header: () => <div>Name</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/patients/${row.original.id}`}
          className="font-bold"
        >
          {row.getValue("name")}
        </Link>
      )
    }
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number"
  },
  {
    accessorKey: "dob",
    header: "Age",
    cell: ({ row }) => {
      const age = calculateAge(row.getValue("dob"))
      return <div>{age}</div>
    }
  },
  {
    accessorKey: "gender",
    header: "Gender"
  },
  {
    accessorKey: "bloodGroup",
    header: "Blood Group"
  },
  {
    accessorKey: "cured",
    header: "Cured",
    cell: ({ row }) => {
      const cured: boolean = row.getValue("cured")
      return (
        <div className="flex items-center justify-center">
          <Tooltip>
            <TooltipTrigger>
              {cured ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="sr-only">Yes</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="sr-only">No</span>
                </>
              )}
            </TooltipTrigger>
            <TooltipContent>{cured ? "Yes" : "No"}</TooltipContent>
          </Tooltip>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original
      return <ActionsCell patient={patient} />
    }
  }
]
