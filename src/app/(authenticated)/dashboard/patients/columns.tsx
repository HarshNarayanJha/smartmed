"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Patient = {
  id: string
  name: String
  age: Number
  gender: String
  condition: String
  lastVisit: String
  email: string
}

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: "Name"
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
  }
]
