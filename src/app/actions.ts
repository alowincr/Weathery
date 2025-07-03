"use server";

import type { WeatherData, DailyForecast, CitySuggestion } from "@/lib/types";

// --- Mock Data (Fallback) ---
const generateForecast = (baseTemp: number): DailyForecast[] => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const descriptions = ["Clear Sky", "Few Clouds", "Rain", "Scattered Clouds"];
  const icons = ["clear", "clouds", "rain", "clouds"];
  
  return days.map((day) => {
    const descIndex = Math.floor(Math.random() * descriptions.length);
    return {
      day,
      temperature: baseTemp + (Math.floor(Math.random() * 6) - 3),
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

async function getMockWeather(city: string): Promise<{ data: WeatherData | null; error: string | null }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const normalizedCity = city.trim().toLowerCase().split(',')[0];
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

// --- OpenWeatherMap API ---
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export async function getCitySuggestions(query: string): Promise<{ suggestions: CitySuggestion[] | null, error: string | null }> {
  if (!API_KEY) {
    return { suggestions: [], error: null };
  }
  
  try {
    const params = new URLSearchParams({
      q: query,
      limit: '5',
      appid: API_KEY,
    });
    const response = await fetch(`${GEO_URL}/direct?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch city suggestions.');
    }
    const data = await response.json();
    const suggestions: CitySuggestion[] = data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
    }));
    return { suggestions, error: null };
  } catch (error) {
    console.error("Geocoding API error:", error);
    return { suggestions: null, error: "Could not fetch city suggestions." };
  }
}

export async function getWeather(city: string): Promise<{ data: WeatherData | null; error: string | null }> {
  if (!API_KEY) {
    console.log("OPENWEATHER_API_KEY not found. Using mock data.");
    return getMockWeather(city);
  }

  try {
    const apiParams = {
        q: city,
        appid: API_KEY,
        units: 'metric'
    };
    
    // Fetch current weather
    const weatherResponse = await fetch(`${BASE_URL}/weather?${new URLSearchParams(apiParams).toString()}`);
    if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
            throw new Error('Invalid API key. Please check your .env.local file. It may take a few hours for a new key to activate.');
        }
        if (weatherResponse.status === 404) {
            throw new Error(`Weather data not found for "${city}".`);
        }
        const errorData = await weatherResponse.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch current weather. Status: ${weatherResponse.status}`);
    }
    const weatherData = await weatherResponse.json();

    // Fetch 5-day forecast
    const forecastResponse = await fetch(`${BASE_URL}/forecast?${new URLSearchParams(apiParams).toString()}`);
     if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch forecast data. Status: ${forecastResponse.status}`);
    }
    const forecastData = await forecastResponse.json();

    // Process forecast data
    const dailyForecasts: DailyForecast[] = [];
    const seenDays = new Set<string>();
    
    for (const forecast of forecastData.list) {
      const date = new Date(forecast.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];

      if (!seenDays.has(dayKey) && dailyForecasts.length < 5) {
        seenDays.add(dayKey);
        dailyForecasts.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temperature: forecast.main.temp,
          description: forecast.weather[0].description,
          icon: forecast.weather[0].main,
        });
      }
    }

    const data: WeatherData = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      icon: weatherData.weather[0].main,
      forecast: dailyForecasts,
    };
    
    return { data, error: null };
  } catch (error: any) {
    console.error("OpenWeatherMap API error:", error);
    return { data: null, error: error.message || "An unknown error occurred." };
  }
}
