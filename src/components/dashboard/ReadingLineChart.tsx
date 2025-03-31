"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ReactNode } from "react"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

export type LineConfig = {
  dataKey: string
  stroke: string
  strokeWidth?: number
  name: string
  type?:
    | "basis"
    | "basisClosed"
    | "basisOpen"
    | "linear"
    | "linearClosed"
    | "natural"
    | "monotone"
    | "monotoneX"
    | "monotoneY"
    | "step"
    | "stepBefore"
    | "stepAfter" // Optional line type
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ReadingLineChartProps<TData extends Record<string, any>> = {
  title: string
  description?: string
  data: TData[]
  xAxisKey: keyof TData & string
  lines: LineConfig[]
  table?: ReactNode
  showXAxisTicks?: boolean
  height?: number
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function ReadingLineChart<TData extends Record<string, any>>({
  title,
  description,
  data,
  xAxisKey,
  lines,
  table,
  showXAxisTicks = true,
  height = 200
}: ReadingLineChartProps<TData>) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tick={showXAxisTicks}
              tickSize={20}
              fontSize={16}
            />
            <YAxis />
            <Tooltip />
            {lines.map(line => (
              <Line
                key={line.dataKey}
                type={line.type || "monotone"}
                dataKey={line.dataKey}
                stroke={line.stroke}
                name={line.name}
                strokeWidth={line.strokeWidth || 2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        {table}
      </CardContent>
    </Card>
  )
}
