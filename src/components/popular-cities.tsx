"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PopularCitiesProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

const cities = ["San Francisco", "New York", "Boston", "Houston", "Lima", "Paris"];

export function PopularCities({ onSearch, disabled }: PopularCitiesProps) {
  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-yellow-400" />
          Ciudades Destacadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <Button
              key={city}
              variant="outline"
              size="sm"
              onClick={() => onSearch(city)}
              disabled={disabled}
              className="rounded-full"
            >
              {city}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
