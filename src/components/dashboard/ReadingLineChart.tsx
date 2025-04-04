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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
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
    | "stepAfter"
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
  showLabels?: boolean
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
  height = 200,
  showLabels = false
}: ReadingLineChartProps<TData>) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={Object.fromEntries(
            lines.map(line => [
              line.dataKey,
              { label: line.name, color: line.stroke }
            ])
          )}
          className={`min-h-${height}px w-full`}
        >
          <LineChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} tick={showXAxisTicks} />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {lines.map(line => (
              <Line
                key={line.dataKey}
                type={line.type || "monotone"}
                dataKey={line.dataKey}
                stroke={line.stroke}
                name={line.name}
                strokeWidth={line.strokeWidth || 2}
                dot={true}
                activeDot={{
                  r: 5
                }}
              >
                {showLabels && (
                  <LabelList
                    position={"top"}
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                )}
              </Line>
            ))}
          </LineChart>
        </ChartContainer>
        {table}
      </CardContent>
    </Card>
  )
}
