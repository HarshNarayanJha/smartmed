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
  CircleCheckIcon,
  CircleXIcon,
  Copy,
  EyeIcon,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import { Report, UrgencyLevel } from "@prisma/client"

const ActionsCell = ({
  patientId,
  report
}: { patientId: string; report: Report }) => {
  return (
    <div className="flex flex-row justify-end gap-4">
      <Button variant="outline" asChild>
        <Link href={`/dashboard/patients/${patientId}/reports/${report.id}`}>
          <EyeIcon />
          View
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
              navigator.clipboard.writeText(report.summary.toString())
            }
          >
            <Copy />
            Copy Summary
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(report.diagnosis.toString())
            }
          >
            <Copy />
            Copy Diagnosis
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(report.tests.toString())
            }
          >
            <Copy />
            Copy Tests
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(report.recommendations.toString())
            }
          >
            <Copy />
            Copy Recommendations
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/patients/${patientId}/readings/${report.id}`}
            >
              <EyeIcon />
              View Reading
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "index",
    header: () => <div>#</div>,
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    }
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="font-bold">Report Generated</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/patients/${row.original.patientId}/reports/${row.original.id}`}
          className="font-bold"
        >
          {formatDateTime(row.getValue("createdAt"))}
        </Link>
      )
    }
  },
  {
    accessorKey: "recommendations",
    header: () => <span className="font-bold">Recommendations</span>,
    cell: ({ row }) => {
      return (
        <div className="max-w-28 truncate">
          {row.getValue("recommendations")}
        </div>
      )
    },
    meta: {
      width: 28
    }
  },
  {
    accessorKey: "summary",
    header: () => <span className="font-bold">Summary</span>,
    cell: ({ row }) => {
      return <div className="max-w-28 truncate">{row.getValue("summary")}</div>
    },
    meta: {
      width: 28
    }
  },
  {
    accessorKey: "tests",
    header: () => <span className="font-bold">Tests</span>,
    cell: ({ row }) => {
      return <div className="max-w-28 truncate">{row.getValue("tests")}</div>
    },
    meta: {
      width: 28
    }
  },
  {
    accessorKey: "additionalNotes",
    header: () => <span className="font-bold">Additional Notes</span>,
    cell: ({ row }) => {
      return (
        <div className="max-w-28 truncate">
          {row.getValue("additionalNotes")}
        </div>
      )
    },
    meta: {
      width: 28
    }
  },
  {
    accessorKey: "urgencyLevel",
    header: () => <span className="font-bold">Urgency Level</span>,
    cell: ({ row }) => {
      const urgencyLevel: UrgencyLevel = row.getValue("urgencyLevel")
      switch (urgencyLevel) {
        case "LOW":
          return (
            <Badge
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700 dark:text-black"
            >
              Low
            </Badge>
          )
        case "MEDIUM":
          return (
            <Badge
              variant="secondary"
              className="bg-yellow-500 text-black hover:bg-yellow-600"
            >
              Medium
            </Badge>
          )
        case "HIGH":
          return <Badge variant="destructive">High</Badge>
        default:
          return <Badge variant="outline">{urgencyLevel || "N/A"}</Badge>
      }
    }
  },
  {
    id: "followupSchedule",
    header: () => <span className="font-bold">Followup Schedule</span>,
    cell: ({ row }) => {
      const followupSchedule = row.original.followupSchedule
      console.log(followupSchedule)
      return (
        <div className="max-w-28 truncate text-center">
          {followupSchedule !== "" ? (
            <CircleCheckIcon className="m-auto h-4 w-4 text-green-500" />
          ) : (
            <CircleXIcon className="m-auto h-4 w-4 text-red-500" />
          )}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patientId = row.original.patientId
      return <ActionsCell patientId={patientId} report={row.original} />
    }
  }
]
