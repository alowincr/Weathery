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
        <CardTitle>Pronóstico para 5 días</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0">
          {forecast.map((dayForecast, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-2 flex-shrink-0 w-28 rounded-lg bg-background p-3 text-center transition-colors hover:bg-accent/50 md:w-auto">
              <span className="text-sm font-medium capitalize text-muted-foreground">{dayForecast.day.replace('.', '')}</span>
              <WeatherIcon icon={dayForecast.icon} className="h-10 w-10 text-primary" />
              <div className="font-bold">
                <span>{Math.round(dayForecast.temp_max)}°</span>
                <span className="text-muted-foreground"> / {Math.round(dayForecast.temp_min)}°</span>
              </div>
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
        <Skeleton className="h-7 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-1 flex-col items-center space-y-2 rounded-lg bg-muted/50 p-3 text-center">
               <Skeleton className="h-5 w-8" />
               <Skeleton className="my-2 h-10 w-10 rounded-full" />
               <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
