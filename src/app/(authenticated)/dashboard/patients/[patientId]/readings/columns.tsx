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
import {
  ArrowUpDown,
  Copy,
  EyeIcon,
  MoreHorizontal,
  Notebook,
  SortAsc,
  SortDesc
} from "lucide-react"
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
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          #
          <ArrowUpDown className="h-1 w-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer font-bold text-foreground hover:text-muted-foreground"
        >
          Reading Taken{" "}
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="inline h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="inline h-4 w-4" />
          ) : null}
        </span>
      )
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/patients/${row.original.patientId}/readings/${row.original.id}`}
          className="font-bold"
        >
          {formatDateTime(row.getValue("createdAt"))}
        </Link>
      )
    },
    sortingFn: "datetime"
  },
  {
    accessorKey: "diagnosedFor",
    header: () => <span className="font-bold">Diagnosed For</span>,
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
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer font-bold text-foreground hover:text-muted-foreground"
        >
          Height{" "}
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="inline h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="inline h-4 w-4" />
          ) : null}
        </span>
      )
    },
    cell: ({ row }) => {
      const height = row.getValue("height")
      return <div>{`${height} cm`}</div>
    },
    maxSize: 50
  },
  {
    accessorKey: "weight",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer font-bold text-foreground hover:text-muted-foreground"
        >
          Weight{" "}
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="inline h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="inline h-4 w-4" />
          ) : null}
        </span>
      )
    },
    cell: ({ row }) => {
      const weight = row.getValue("weight")
      return <div>{`${weight} kg`}</div>
    },
    maxSize: 50
  },
  {
    accessorKey: "bmi",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer font-bold text-foreground hover:text-muted-foreground"
        >
          BMI{" "}
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="inline h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="inline h-4 w-4" />
          ) : null}
        </span>
      )
    },
    cell: ({ row }) => {
      const weight: number = row.getValue("weight")
      const height: number = row.getValue("height")
      const bmi = calculateBmi(weight, height)
      return <div>{`${bmi} kg/m²`}</div>
    },
    maxSize: 25
  },
  {
    accessorKey: "temperature",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer font-bold text-foreground hover:text-muted-foreground"
        >
          Body Temperature{" "}
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="inline h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="inline h-4 w-4" />
          ) : null}
        </span>
      )
    },
    cell: ({ row }) => {
      const temperature = row.getValue("temperature")
      return <div>{`${temperature} °C`}</div>
    },
    maxSize: 50
  },
  {
    accessorKey: "heartRate",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer font-bold text-foreground hover:text-muted-foreground"
        >
          Heart Rate{" "}
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="inline h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="inline h-4 w-4" />
          ) : null}
        </span>
      )
    },
    cell: ({ row }) => {
      const heartRate = row.getValue("heartRate")
      return <div>{`${heartRate} bpm`}</div>
    },
    maxSize: 50
  },
  {
    accessorKey: "bp",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer font-bold text-foreground hover:text-muted-foreground"
        >
          Blood Pressure{" "}
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="inline h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="inline h-4 w-4" />
          ) : null}
        </span>
      )
    },
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
    },
    sortingFn: (a, b, _1columnId) => {
      const systolicA = new Date(a.original.bpSystolic)
      const diastolicA = new Date(a.original.bpDiastolic)
      const systolicB = new Date(b.original.bpSystolic)
      const diastolicB = new Date(b.original.bpDiastolic)

      return systolicA > systolicB
        ? 1
        : systolicA < systolicB
          ? -1
          : diastolicA > diastolicB
            ? 1
            : diastolicA < diastolicB
              ? -1
              : 0
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
