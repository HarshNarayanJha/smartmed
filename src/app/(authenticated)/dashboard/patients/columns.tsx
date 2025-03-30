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
  Copy,
  EyeIcon,
  MoreHorizontal,
  PencilIcon,
  PlusCircle
} from "lucide-react"
import Link from "next/link"

import { Patient } from "@prisma/client"

const ActionsCell = ({ patient }: { patient: Patient }) => {
  return (
    <div className="flex flex-row justify-end gap-4">
      <Button variant="outline" asChild>
        <Link href={`/dashboard/patients/${patient.id}`}>
          <EyeIcon />
          View Patient
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
            <Link href={`/dashboard/patients/${patient.id}/edit`}>
              <PencilIcon />
              Edit Patient
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/patients/${patient.id}/readings`}>
              <EyeIcon />
              View Readings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const columns: ColumnDef<Patient>[] = [
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
    accessorKey: "age",
    header: "Age"
  },
  {
    accessorKey: "gender",
    header: "Gender"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original
      return <ActionsCell patient={patient} />
    }
  }
]
