"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Cloud, Search, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { WeatherData } from "@/lib/types";
import { getWeather } from "./actions";
import { WeatherCard, WeatherCardSkeleton } from "@/components/weather-card";
import { SearchHistory } from "@/components/search-history";

const formSchema = z.object({
  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters." }),
});

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("weatherSearchHistory");
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse search history from localStorage", error);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
    },
  });

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setWeatherData(null);
    form.setValue("city", city);

    const result = await getWeather(city);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      setWeatherData(null);
    } else if (result.data) {
      setWeatherData(result.data);
      const newHistory = [
        result.data.city,
        ...searchHistory.filter(
          (h) => h.toLowerCase() !== result.data.city.toLowerCase()
        ),
      ].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("weatherSearchHistory", JSON.stringify(newHistory));
    }
    setIsLoading(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleSearch(values.city);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-headline text-5xl font-bold tracking-tight text-primary sm:text-6xl">
            WeatherWise
          </h1>
          <p className="mt-2 text-lg text-foreground/80">
            Your friendly weather forecast app
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="E.g., London, Paris, Tokyo"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </Form>
        
        <div className="h-[420px] pt-4">
          {isLoading ? (
            <WeatherCardSkeleton />
          ) : weatherData ? (
            <WeatherCard data={weatherData} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center">
              <Cloud className="h-16 w-16 text-muted-foreground" />
              <p className="mt-4 font-medium text-muted-foreground">
                Search for a city to see the weather forecast.
              </p>
            </div>
          )}
        </div>

        <SearchHistory history={searchHistory} onSearch={handleSearch} disabled={isLoading} />
      </div>
    </main>
  );
}
