"use server";

import type { WeatherData, DailyForecast } from "@/lib/types";

// Helper to generate mock forecast
const generateForecast = (baseTemp: number): DailyForecast[] => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const descriptions = ["Clear Sky", "Few Clouds", "Rain", "Scattered Clouds"];
  const icons = ["clear", "clouds", "rain", "clouds"];
  
  return days.map((day) => {
    const descIndex = Math.floor(Math.random() * descriptions.length);
    return {
      day,
      temperature: baseTemp + (Math.floor(Math.random() * 6) - 3), // +/- 3 degrees
      description: descriptions[descIndex],
      icon: icons[descIndex],
    }
  });
};


const mockWeatherData: Record<string, Omit<WeatherData, "city">> = {
  london: { temperature: 15, description: "Broken Clouds", icon: "clouds", humidity: 77, windSpeed: 4.6, forecast: generateForecast(15) },
  paris: { temperature: 22, description: "Clear Sky", icon: "clear", humidity: 60, windSpeed: 3.1, forecast: generateForecast(22) },
  tokyo: { temperature: 28, description: "Light Rain", icon: "rain", humidity: 85, windSpeed: 2.5, forecast: generateForecast(28) },
  "new york": { temperature: 25, description: "Few Clouds", icon: "clouds", humidity: 55, windSpeed: 5.8, forecast: generateForecast(25) },
  sydney: { temperature: 19, description: "Scattered Clouds", icon: "clouds", humidity: 65, windSpeed: 8.2, forecast: generateForecast(19) },
  "san francisco": { temperature: 18, description: "Fog", icon: "fog", humidity: 80, windSpeed: 12.1, forecast: generateForecast(18) },
  chicago: { temperature: 26, description: "Thunderstorm", icon: "rain", humidity: 70, windSpeed: 6.2, forecast: generateForecast(26) },
  boston: { temperature: 23, description: "Partly Cloudy", icon: "clouds", humidity: 62, windSpeed: 7.5, forecast: generateForecast(23) },
  houston: { temperature: 32, description: "Sunny", icon: "clear", humidity: 50, windSpeed: 5.0, forecast: generateForecast(32) },
  lima: { temperature: 20, description: "Misty", icon: "fog", humidity: 88, windSpeed: 2.0, forecast: generateForecast(20) },
};

export async function getWeather(city: string): Promise<{ data: WeatherData | null; error: string | null }> {
  await new Promise(resolve => setTimeout(resolve, 500));

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

  return { data: null, error: `Weather data not found for "${city}". Please try one of the popular cities.` };
}
