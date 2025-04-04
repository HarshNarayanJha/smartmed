"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { calculateBmi, formatDateTime } from "@/lib/utils"
import { Reading } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Copy, EyeIcon, MoreHorizontal, Notebook } from "lucide-react"
import Link from "next/link"

const ActionsCell = ({
  patientId,
  reading
}: { patientId: string; reading: Reading }) => {
  return (
    <div className="flex flex-row justify-end gap-4">
      <Button variant="outline" asChild>
        <Link href={`/dashboard/patients/${patientId}/readings/${reading.id}`}>
          <EyeIcon />
          View
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/dashboard/patients/${patientId}/reports/${reading.id}`}>
          <Notebook />
          View Report
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
              navigator.clipboard.writeText(reading.diagnosedFor.toString())
            }
          >
            <Copy />
            Copy Diagnosed For
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const columns: ColumnDef<Reading>[] = [
  {
    accessorKey: "index",
    header: () => <div>#</div>,
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    }
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Reading Taken</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/patients/${row.original.patientId}/readings/${row.original.id}`}
          className="font-bold"
        >
          {formatDateTime(row.getValue("createdAt"))}
        </Link>
      )
    }
  },
  {
    accessorKey: "diagnosedFor",
    header: "Diagnosed For",
    cell: ({ row }) => {
      return (
        <div className="max-w-28 truncate">{row.getValue("diagnosedFor")}</div>
      )
    },
    meta: {
      width: 28
    }
  },
  {
    accessorKey: "height",
    header: "Height",
    cell: ({ row }) => {
      const height = row.getValue("height")
      return <div>{`${height} cm`}</div>
    },
    meta: {
      width: 50
    }
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => {
      const weight = row.getValue("weight")
      return <div>{`${weight} kg`}</div>
    },
    meta: {
      width: 50
    }
  },
  {
    accessorKey: "bmi",
    header: "BMI",
    cell: ({ row }) => {
      const weight: number = row.getValue("weight")
      const height: number = row.getValue("height")
      const bmi = calculateBmi(weight, height)
      return <div>{`${bmi} kg/m²`}</div>
    },
    meta: {
      width: 25
    }
  },
  {
    accessorKey: "temperature",
    header: "Temperature",
    cell: ({ row }) => {
      const temperature = row.getValue("temperature")
      return <div>{`${temperature} °C`}</div>
    },
    meta: {
      width: 50
    }
  },
  {
    accessorKey: "heartRate",
    header: "Heart Rate",
    cell: ({ row }) => {
      const heartRate = row.getValue("heartRate")
      return <div>{`${heartRate} bpm`}</div>
    },
    meta: {
      width: 50
    }
  },
  {
    accessorKey: "bp",
    header: "Blood Pressure",
    cell: ({ row }) => {
      const bpSystolic = row.original.bpSystolic
      const bpDiastolic = row.original.bpDiastolic
      return (
        <div>
          {`${bpSystolic} `}
          <span className="text-muted-foreground">/</span>
          {` ${bpDiastolic} mmHg`}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patientId = row.original.patientId
      return <ActionsCell patientId={patientId} reading={row.original} />
    }
  }
]
