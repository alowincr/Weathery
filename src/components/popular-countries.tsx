"use client";

import { Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


interface PopularCountriesProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

const countryData = {
  "Estados Unidos": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  "España": ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza"],
  "México": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
  "Brasil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza"],
  "Francia": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
  "Rusia": ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan"],
  "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
  "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
  "Perú": ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura"],
  "Chile": ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta"],
};


export function PopularCountries({ onSearch, disabled }: PopularCountriesProps) {
  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5 text-primary" />
          Principales Países
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(countryData).map(([country, cities]) => (
            <AccordionItem value={country} key={country}>
              <AccordionTrigger className="px-4">{country}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 pt-2">
                  {cities.map((city) => (
                    <Button
                      key={city}
                      variant="ghost"
                      size="sm"
                      onClick={() => onSearch(city)}
                      disabled={disabled}
                      className="justify-start gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <MapPin className="h-4 w-4" />
                      {city}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
