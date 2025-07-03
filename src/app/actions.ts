"use server";

import type { WeatherData } from "@/lib/types";

const mockWeatherData: Record<string, Omit<WeatherData, "city">> = {
  london: { temperature: 15, description: "Broken Clouds", icon: "clouds", humidity: 77, windSpeed: 4.6 },
  paris: { temperature: 22, description: "Clear Sky", icon: "clear", humidity: 60, windSpeed: 3.1 },
  tokyo: { temperature: 28, description: "Light Rain", icon: "rain", humidity: 85, windSpeed: 2.5 },
  "new york": { temperature: 25, description: "Few Clouds", icon: "clouds", humidity: 55, windSpeed: 5.8 },
  sydney: { temperature: 19, description: "Scattered Clouds", icon: "clouds", humidity: 65, windSpeed: 8.2 },
};

export async function getWeather(city: string): Promise<{ data: WeatherData | null; error: string | null }> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const normalizedCity = city.trim().toLowerCase();
  const weather = mockWeatherData[normalizedCity];

  if (weather) {
    return {
      data: {
        city: city.trim().replace(/\b\w/g, l => l.toUpperCase()),
        ...weather,
      },
      error: null,
    };
  }

  return { data: null, error: `Weather data not found for "${city}". Please try a different city like London, Paris, or Tokyo.` };
}
