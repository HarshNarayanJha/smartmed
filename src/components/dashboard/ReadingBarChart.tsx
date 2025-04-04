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
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
  radius?: number
  showLabels?: boolean
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
  height = 200,
  radius = 4,
  showLabels = false
}: ReadingBarChartProps<TData>) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={Object.fromEntries(
            bars.map(bar => [bar.dataKey, { label: bar.name, color: bar.fill }])
          )}
          className={`min-h-${height}px w-full`}
        >
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} tick={showXAxisTicks} tickSize={20} />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {bars.map(bar => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill}
                name={bar.name}
                radius={radius}
              >
                {showLabels && (
                  <LabelList
                    position={"top"}
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
        {table}
      </CardContent>
    </Card>
  )
}
