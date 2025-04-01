"use client"

import { Button } from "@/components/ui/button"
import { Reading } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { EyeIcon, Notebook } from "lucide-react"
import Link from "next/link"

const ActionsCell = ({
  patientId,
  readingId
}: { patientId: string; readingId: string }) => {
  return (
    <div className="flex flex-row justify-end gap-4">
      <Button variant="outline" asChild>
        <Link href={`/dashboard/patients/${patientId}/readings/${readingId}`}>
          <EyeIcon />
          View Reading
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/dashboard/patients/${patientId}/reports/${readingId}`}>
          <Notebook />
          View Report
        </Link>
      </Button>
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
    header: () => <div>Reading Taken At</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/patients/${row.original.patientId}/readings/${row.original.id}`}
          className="font-bold"
        >
          {row.getValue("createdAt").toLocaleString()}
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
      return <div>{`${bpSystolic}/${bpDiastolic} mmHg`}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patientId = row.original.patientId
      return <ActionsCell patientId={patientId} readingId={row.original.id} />
    }
  }
]
