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
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

export type BarConfig = {
  dataKey: string
  name: string
  fill: string
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ReadingBarChartProps<TData extends Record<string, any>> = {
  title: string
  description?: string
  data: TData[]
  xAxisKey: keyof TData & string
  bars: BarConfig[]
  table?: ReactNode
  showXAxisTicks?: boolean
  height?: number
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function ReadingBarChart<TData extends Record<string, any>>({
  title,
  description,
  data,
  xAxisKey,
  bars,
  table,
  showXAxisTicks = true,
  height = 200
}: ReadingBarChartProps<TData>) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tick={showXAxisTicks}
              tickSize={20}
              fontSize={16}
            />
            <YAxis />
            <Tooltip />
            {bars.map(bar => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill}
                name={bar.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        {table}
      </CardContent>
    </Card>
  )
}
