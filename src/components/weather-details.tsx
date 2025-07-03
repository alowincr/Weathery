
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeatherData } from "@/lib/types";
import { ThermometerSun, Sunrise, Sunset, Gauge, Wind, Droplets, Eye, Cloudy } from "lucide-react";

interface WeatherDetailsProps {
  data: WeatherData;
}

const formatTime = (timestamp: number, timezone: number) => {
  return new Date((timestamp + timezone) * 1000).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });
}

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-3 rounded-lg bg-background p-3 transition-colors hover:bg-accent/50">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);


export function WeatherDetails({ data }: WeatherDetailsProps) {
  const details = [
    { icon: <ThermometerSun size={24} />, label: "Sensación Térmica", value: `${Math.round(data.feels_like)}°C` },
    { icon: <Droplets size={24} />, label: "Humedad", value: `${data.humidity}%` },
    { icon: <Wind size={24} />, label: "Viento", value: `${(data.windSpeed * 3.6).toFixed(1)} km/h` },
    { icon: <Cloudy size={24} />, label: "Nubosidad", value: `${data.cloudiness}%` },
    { icon: <Gauge size={24} />, label: "Presión", value: `${data.pressure} hPa` },
    { icon: <Eye size={24} />, label: "Visibilidad", value: `${(data.visibility / 1000).toFixed(1)} km` },
    { icon: <Sunrise size={24} />, label: "Amanecer", value: formatTime(data.sunrise, data.timezone) },
    { icon: <Sunset size={24} />, label: "Atardecer", value: formatTime(data.sunset, data.timezone) },
  ]
  return (
    <Card className="w-full animate-in fade-in-50 duration-700">
      <CardHeader>
        <CardTitle>Detalles del Clima</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {details.map(item => <DetailItem key={item.label} {...item} />)}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherDetailsSkeleton() {
  return (
     <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-7 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
             <div key={index} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
