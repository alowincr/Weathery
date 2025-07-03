"use client";

import { Droplets, Wind, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather-icon";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeatherData } from "@/lib/types";

interface WeatherCardProps {
  data: WeatherData;
}

const getLocalTime = (dt: number, timezone: number) => {
    const date = new Date((dt + timezone) * 1000);
    const time = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });
    const day = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    return `${time}, ${day.charAt(0).toUpperCase() + day.slice(1)}`;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <Card className="w-full animate-in fade-in-50 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold">{data.city}</CardTitle>
        <CardDescription className="text-lg capitalize">{data.description}</CardDescription>
        <div className="flex items-center justify-center gap-2 pt-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{getLocalTime(data.dt, data.timezone)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
          <WeatherIcon icon={data.icon} className="h-28 w-28 text-primary drop-shadow-lg" />
          <div className="text-7xl font-bold tracking-tighter">
            {Math.round(data.temperature)}°C
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-background p-3 transition-colors hover:bg-accent/50">
            <Droplets className="h-5 w-5 text-primary" />
            <span>Humedad: {data.humidity}%</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-background p-3 transition-colors hover:bg-accent/50">
            <Wind className="h-5 w-5 text-primary" />
            <span>Viento: {data.windSpeed} m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="items-center text-center">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-20 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
