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
import { PopularCities } from "@/components/popular-cities";
import { ForecastDisplay, ForecastDisplaySkeleton } from "@/components/forecast-display";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters." }),
});

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
    },
  });
  
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("weatherSearchHistory");
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse search history from localStorage", error);
    }
    
    handleSearch("London", true);
  }, []);

  const handleSearch = async (city: string, isInitialLoad = false) => {
    setIsLoading(true);
    if (!isInitialLoad) {
        setWeatherData(null);
    }
    form.setValue("city", city);

    const result = await getWeather(city);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      if (!isInitialLoad) setWeatherData(null);
    } else if (result.data) {
      setWeatherData(result.data);
      if (!isInitialLoad) {
        const newHistory = [
          result.data.city,
          ...searchHistory.filter(
            (h) => h.toLowerCase() !== result.data.city.toLowerCase()
          ),
        ].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem("weatherSearchHistory", JSON.stringify(newHistory));
      }
    }
    setIsLoading(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleSearch(values.city);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 lg:flex-row">
      <aside className="w-full shrink-0 space-y-6 border-b bg-background p-4 lg:w-96 lg:border-b-0 lg:border-r">
        <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
                WeatherWise
            </h1>
            <p className="text-muted-foreground">Your friendly forecast app</p>
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
              {isLoading && !weatherData ? "Searching..." : "Search"}
            </Button>
          </form>
        </Form>

        <PopularCities onSearch={handleSearch} disabled={isLoading} />
        <SearchHistory history={searchHistory} onSearch={handleSearch} disabled={isLoading} />
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="h-full w-full max-w-4xl mx-auto space-y-6">
          {isLoading ? (
            <>
              <WeatherCardSkeleton />
              <ForecastDisplaySkeleton />
            </>
          ) : weatherData ? (
            <>
              <WeatherCard data={weatherData} />
              <ForecastDisplay forecast={weatherData.forecast} />
            </>
          ) : (
            <div className="flex h-[60vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center">
              <Cloud className="h-16 w-16 text-muted-foreground" />
              <p className="mt-4 font-medium text-muted-foreground">
                Could not find weather data.
                <br />
                Please try searching for another city.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
