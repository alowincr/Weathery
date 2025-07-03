"use client";

import { Droplets, Thermometer, Wind } from "lucide-react";
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

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <Card className="w-full animate-in fade-in-50 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">{data.city}</CardTitle>
        <CardDescription className="text-lg">{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-6 text-center">
          <WeatherIcon icon={data.icon} className="h-24 w-24 text-primary" />
          <div className="text-6xl font-bold tracking-tighter">
            {Math.round(data.temperature)}°C
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-background p-3">
            <Droplets className="h-5 w-5 text-primary" />
            <span>Humidity: {data.humidity}%</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-background p-3">
            <Wind className="h-5 w-5 text-primary" />
            <span>Wind: {data.windSpeed} km/h</span>
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
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-6 text-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-16 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
