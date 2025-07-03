"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyForecast } from "@/lib/types";
import { WeatherIcon } from "./weather-icon";
import { Skeleton } from "./ui/skeleton";

interface ForecastDisplayProps {
  forecast: DailyForecast[];
}

export function ForecastDisplay({ forecast }: ForecastDisplayProps) {
  return (
    <Card className="w-full animate-in fade-in-50 duration-700">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between space-x-2 md:space-x-4">
          {forecast.map((dayForecast) => (
            <div key={dayForecast.day} className="flex flex-col items-center justify-center space-y-2 flex-1 rounded-lg bg-background p-2 text-center">
              <span className="text-sm font-medium text-muted-foreground">{dayForecast.day}</span>
              <WeatherIcon icon={dayForecast.icon} className="h-8 w-8 text-primary" />
              <span className="font-bold">{Math.round(dayForecast.temperature)}°C</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ForecastDisplaySkeleton() {
  return (
     <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-7 w-40" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between space-x-2 md:space-x-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-1 flex-col items-center space-y-2 rounded-lg bg-background p-2 text-center">
               <Skeleton className="h-5 w-8" />
               <Skeleton className="my-2 h-8 w-8 rounded-full" />
               <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
