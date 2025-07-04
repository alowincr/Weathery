"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Cloud, Search, MapPin, Loader2, LocateFixed } from "lucide-react";
import { gsap } from "gsap";

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
import type { WeatherData, CitySuggestion } from "@/lib/types";
import { getWeather, getWeatherByCoords, getCitySuggestions } from "./actions";
import { WeatherCard, WeatherCardSkeleton } from "@/components/weather-card";
import { SearchHistory } from "@/components/search-history";
import { PopularCities } from "@/components/popular-cities";
import { PopularCountries } from "@/components/popular-countries";
import { ForecastDisplay, ForecastDisplaySkeleton } from "@/components/forecast-display";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherDetails, WeatherDetailsSkeleton } from "@/components/weather-details";
import { HourlyForecast, HourlyForecastSkeleton } from "@/components/hourly-forecast";

const formSchema = z.object({
  city: z
    .string()
    .min(2, { message: "El nombre de la ciudad debe tener al menos 2 caracteres." }),
});

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { city: "" },
  });

  const cityValue = form.watch("city");
  const suggestionSelectedRef = useRef(false);

  // Load initial data and search history
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("weatherSearchHistory");
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("No se pudo analizar el historial de búsqueda de localStorage", error);
    }
    
    handleSearch("London", true);
  }, []);

  // Day/Night theme effect
  useEffect(() => {
    if (weatherData) {
      document.documentElement.classList.toggle('dark', !weatherData.isDay);
    }
  }, [weatherData]);

  // City suggestions effect
  useEffect(() => {
    if (suggestionSelectedRef.current) {
        suggestionSelectedRef.current = false;
        return;
    }
    if (cityValue.length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const fetchSuggestions = async () => {
      setIsSuggesting(true);
      const { suggestions: newSuggestions, error } = await getCitySuggestions(cityValue);
      if (error) {
        console.warn(error);
      } else if (newSuggestions) {
        setSuggestions(newSuggestions);
      }
      setIsSuggesting(false);
    };

    const debounceTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
      controller.abort();
    };
  }, [cityValue]);

  const processSearchResult = (result: { data: WeatherData | null; error: string | null }, city: string, isInitialLoad = false) => {
    if (result.error) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      if (isInitialLoad) setWeatherData(null);
    } else if (result.data) {
      setError(null);
      suggestionSelectedRef.current = true;
      form.setValue("city", result.data.city, { shouldValidate: true });
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

  const handleSearch = async (city: string, isInitialLoad = false) => {
    setSuggestions([]);
    setIsLoading(true);
    setError(null);
    
    const result = await getWeather(city);
    processSearchResult(result, city, isInitialLoad);
  };

  const handleSearchByCoords = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    const result = await getWeatherByCoords(lat, lon);
    processSearchResult(result, `${lat},${lon}`);
  }

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast({ variant: "destructive", title: "Error", description: "La geolocalización no es compatible con tu navegador." });
      return;
    }
    
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleSearchByCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setIsLoading(false);
        toast({ variant: "destructive", title: "Error de ubicación", description: "No se pudo obtener tu ubicación. Por favor, habilita los permisos de ubicación en tu navegador." });
        setError("No se pudo acceder a tu ubicación. Por favor, permite el acceso e inténtalo de nuevo.");
      }
    );
  };
  
  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    const city = `${suggestion.name}, ${suggestion.country}`;
    suggestionSelectedRef.current = true;
    form.setValue("city", city);
    setSuggestions([]);
    handleSearch(city);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSuggestions([]);
    handleSearch(values.city);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent text-foreground transition-colors duration-500 lg:flex-row">
      <aside className="w-full shrink-0 space-y-6 border-b bg-card p-4 lg:w-96 lg:border-b-0 lg:border-r">
        <div className="space-y-2 text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
                WeatherWise
            </h1>
            <p className="text-muted-foreground">Tu amigable app del tiempo</p>
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
                        placeholder="Ej: Londres, París, Tokio"
                        className="pl-10"
                        {...field}
                        autoComplete="off"
                        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                      />
                    </FormControl>
                    {isSuggesting && <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />}
                    {suggestions.length > 0 && (
                      <Card className="absolute top-full z-10 mt-1 w-full border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                        <CardContent className="p-1">
                          <ul className="space-y-1">
                            {suggestions.map((s, i) => (
                              <li key={`${s.name}-${s.country}-${i}`}>
                                <button
                                  type="button"
                                  className="w-full text-left p-2 rounded-md hover:bg-accent text-sm"
                                  onClick={() => handleSuggestionClick(s)}
                                >
                                  {s.name}{s.state ? `, ${s.state}` : ''}, {s.country}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Search className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
               <Button type="button" variant="outline" onClick={handleGeolocation} disabled={isLoading} className="w-full sm:w-auto px-4">
                <LocateFixed className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2">Mi Ubicación</span>
              </Button>
            </div>
          </form>
        </Form>

        <PopularCities onSearch={handleSearch} disabled={isLoading} />
        <PopularCountries onSearch={handleSearch} disabled={isLoading} />
        <SearchHistory history={searchHistory} onSearch={handleSearch} disabled={isLoading} />
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="h-full w-full max-w-4xl mx-auto space-y-6">
          {isLoading && !weatherData ? (
            <>
              <WeatherCardSkeleton />
              <ForecastDisplaySkeleton />
              <HourlyForecastSkeleton />
              <WeatherDetailsSkeleton />
            </>
          ) : weatherData ? (
            <>
              <WeatherCard data={weatherData} />
              <ForecastDisplay forecast={weatherData.forecast} />
              <HourlyForecast data={weatherData.hourly} />
              <WeatherDetails data={weatherData} />
            </>
          ) : error ? (
            <div className="flex h-[60vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center animate-in fade-in-50">
              <Cloud className="h-16 w-16 text-muted-foreground" />
              <p className="mt-4 font-medium text-destructive">
                {error}
              </p>
               <p className="mt-2 text-sm text-muted-foreground">
                Por favor, intenta buscar otra ciudad.
              </p>
            </div>
          ) : (
             <div className="flex h-[60vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center animate-in fade-in-50">
              <Cloud className="h-16 w-16 text-muted-foreground" />
              <p className="mt-4 font-medium text-muted-foreground">
                Busca una ciudad para ver el pronóstico del tiempo.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
