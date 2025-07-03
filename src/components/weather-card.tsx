"use client";

import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
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
    <Card className="w-full animate-in fade-in-50 duration-700">
      <CardHeader className="text-center">
        <CardTitle className="text-5xl font-bold">{data.city}</CardTitle>
        <CardDescription className="text-lg capitalize">{data.description}</CardDescription>
        <div className="flex flex-col items-center justify-center gap-1 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{getLocalTime(data.dt, data.timezone)}</span>
            </div>
            <p className="text-xs">(Actualizado {formatDistanceToNow(new Date(data.dt * 1000), { addSuffix: true, locale: es })})</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
          <WeatherIcon icon={data.icon} className="h-36 w-36 text-primary drop-shadow-lg" />
          <div className="font-headline text-8xl font-extrabold tracking-tighter">
            {Math.round(data.temperature)}°
            <span className="text-7xl align-super font-semibold text-muted-foreground/80">C</span>
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
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-5 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
          <Skeleton className="h-36 w-36 rounded-full" />
          <Skeleton className="h-24 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}
