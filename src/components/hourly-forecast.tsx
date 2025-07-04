
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { HourlyData } from "@/lib/types";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface HourlyForecastProps {
  data: HourlyData[];
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  const chartConfig = {
    temperature: {
      label: "Temp.",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <Card className="w-full animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
      <CardHeader>
        <CardTitle>Pronóstico por Hora (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
            <LineChart accessibilityLayer data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                <YAxis type="number" domain={['dataMin - 2', 'dataMax + 2']} hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" labelKey="time" />}
                    />
                <Line
                    dataKey="temp"
                    type="natural"
                    stroke="var(--color-temperature)"
                    strokeWidth={2}
                    dot={false}
                    />
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function HourlyForecastSkeleton() {
  return (
     <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-7 w-48" />
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full flex items-center justify-center bg-muted/50 rounded-lg">
           <Skeleton className="h-32 w-full mx-4" />
        </div>
      </CardContent>
    </Card>
  )
}
