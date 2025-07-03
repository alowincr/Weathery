"use server";

import type { WeatherData, DailyForecast, CitySuggestion, HourlyData } from "@/lib/types";

// --- Mock Data (Fallback) ---
const generateMockForecast = (baseTemp: number): DailyForecast[] => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  return days.map((day) => ({
    day,
    temp_min: baseTemp + (Math.floor(Math.random() * 6) - 5),
    temp_max: baseTemp + (Math.floor(Math.random() * 6) + 2),
    description: "Cielo Despejado",
    icon: "Clear",
  }));
};

const generateMockHourly = (baseTemp: number): HourlyData[] => {
  const hours = [];
  for (let i = 0; i < 8; i++) {
    hours.push({
      time: `${(new Date().getHours() + i * 3) % 24}:00`,
      temp: baseTemp + Math.floor(Math.random() * 4) - 2,
    });
  }
  return hours;
}

const mockWeatherData: Record<string, Omit<WeatherData, "city">> = {
  london: { temperature: 15, description: "Nubes Dispersas", icon: "Clouds", humidity: 77, windSpeed: 4.6, isDay: true, forecast: generateMockForecast(15), dt: Math.floor(Date.now() / 1000), timezone: 3600, feels_like: 14, pressure: 1012, visibility: 10000, sunrise: Date.now() / 1000 - 3600 * 5, sunset: Date.now() / 1000 + 3600 * 5, hourly: generateMockHourly(15) },
  paris: { temperature: 22, description: "Cielo Despejado", icon: "Clear", humidity: 60, windSpeed: 3.1, isDay: true, forecast: generateMockForecast(22), dt: Math.floor(Date.now() / 1000), timezone: 7200, feels_like: 22, pressure: 1015, visibility: 10000, sunrise: Date.now() / 1000 - 3600 * 5, sunset: Date.now() / 1000 + 3600 * 5, hourly: generateMockHourly(22) },
  tokyo: { temperature: 28, description: "Lluvia Ligera", icon: "Rain", humidity: 85, windSpeed: 2.5, isDay: false, forecast: generateMockForecast(28), dt: Math.floor(Date.now() / 1000), timezone: 32400, feels_like: 31, pressure: 1008, visibility: 8000, sunrise: Date.now() / 1000 - 3600 * 5, sunset: Date.now() / 1000 + 3600 * 5, hourly: generateMockHourly(28) },
  "new york": { temperature: 25, description: "Pocas Nubes", icon: "Clouds", humidity: 55, windSpeed: 5.8, isDay: true, forecast: generateMockForecast(25), dt: Math.floor(Date.now() / 1000), timezone: -14400, feels_like: 26, pressure: 1018, visibility: 10000, sunrise: Date.now() / 1000 - 3600 * 5, sunset: Date.now() / 1000 + 3600 * 5, hourly: generateMockHourly(25) },
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

  return { data: null, error: `No se encontró clima para "${city}". Verifica si lo escribiste correctamente.` };
}


// --- OpenWeatherMap API ---
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "http://api.openweathermap.org/geo/1.0";


function processForecastData(forecastList: any[]): DailyForecast[] {
  const dailyData: { [key: string]: { temps: number[], weathers: { main: string, description: string }[] } } = {};

  for (const forecast of forecastList) {
    const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = { temps: [], weathers: [] };
    }
    dailyData[date].temps.push(forecast.main.temp);
    dailyData[date].weathers.push({
      main: forecast.weather[0].main,
      description: forecast.weather[0].description
    });
  }

  return Object.entries(dailyData).slice(0, 5).map(([date, data]) => {
    const weatherCounts = data.weathers.reduce((acc, weather) => {
        const main = weather.main;
        acc[main] = (acc[main] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostFrequentWeather = Object.keys(weatherCounts).reduce((a, b) => weatherCounts[a] > weatherCounts[b] ? a : b);
    const representativeWeather = data.weathers.find(w => w.main === mostFrequentWeather)!;

    return {
      day: new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' }),
      temp_min: Math.min(...data.temps),
      temp_max: Math.max(...data.temps),
      description: representativeWeather.description,
      icon: representativeWeather.main,
    };
  });
}

function processHourlyData(forecastList: any[], timezone: number): HourlyData[] {
  return forecastList.slice(0, 8).map(item => {
    const date = new Date((item.dt + timezone) * 1000);
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    return {
      time,
      temp: Math.round(item.main.temp),
    }
  })
}


async function fetchWeatherData(params: URLSearchParams): Promise<{ data: WeatherData | null; error: string | null }> {
    try {
        const weatherResponse = await fetch(`${BASE_URL}/weather?${params.toString()}`);
        if (!weatherResponse.ok) {
            if (weatherResponse.status === 401) {
                throw new Error('Clave de API inválida. Por favor, revisa tu archivo .env.local. Una clave nueva puede tardar unas horas en activarse.');
            }
            if (weatherResponse.status === 404) {
                 const city = params.get('q') || `${params.get('lat')}, ${params.get('lon')}`;
                 throw new Error(`No se encontró clima para "${city}". Verifica si lo escribiste correctamente.`);
            }
            const errorData = await weatherResponse.json().catch(() => null);
            throw new Error(errorData?.message || `Error al obtener el clima actual. Estado: ${weatherResponse.status}`);
        }
        const weatherData = await weatherResponse.json();

        const forecastResponse = await fetch(`${BASE_URL}/forecast?${params.toString()}`);
        if (!forecastResponse.ok) {
            const errorData = await forecastResponse.json().catch(() => null);
            throw new Error(errorData?.message || `Error al obtener el pronóstico. Estado: ${forecastResponse.status}`);
        }
        const forecastData = await forecastResponse.json();
        
        const dailyForecasts = processForecastData(forecastData.list);
        const hourlyForecast = processHourlyData(forecastData.list, weatherData.timezone);

        const isDay = weatherData.dt > weatherData.sys.sunrise && weatherData.dt < weatherData.sys.sunset;
        
        const data: WeatherData = {
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            icon: weatherData.weather[0].main,
            isDay: isDay,
            forecast: dailyForecasts,
            dt: weatherData.dt,
            timezone: weatherData.timezone,
            feels_like: weatherData.main.feels_like,
            pressure: weatherData.main.pressure,
            visibility: weatherData.visibility,
            sunrise: weatherData.sys.sunrise,
            sunset: weatherData.sys.sunset,
            hourly: hourlyForecast,
        };

        return { data, error: null };

    } catch (error: any) {
        console.error("Error en la API de OpenWeatherMap:", error);
        return { data: null, error: error.message || "Ocurrió un error desconocido." };
    }
}

export async function getWeather(city: string): Promise<{ data: WeatherData | null; error: string | null }> {
    if (!API_KEY) {
        console.log("OPENWEATHER_API_KEY no encontrada. Usando datos de demostración.");
        return getMockWeather(city);
    }
    const params = new URLSearchParams({
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'es'
    });
    return fetchWeatherData(params);
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<{ data: WeatherData | null; error: string | null }> {
    if (!API_KEY) {
        return { data: null, error: "La clave de API de OpenWeatherMap no está configurada." };
    }
    const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        appid: API_KEY,
        units: 'metric',
        lang: 'es'
    });
    return fetchWeatherData(params);
}

export async function getCitySuggestions(query: string): Promise<{ suggestions: CitySuggestion[] | null, error: string | null }> {
  if (!API_KEY) {
    return { suggestions: [], error: null };
  }
  if (query.length < 3) {
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
        throw new Error('No se pudieron obtener sugerencias de ciudades.');
    }
    const data = await response.json();
    const suggestions: CitySuggestion[] = data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
    }));
    return { suggestions, error: null };
  } catch (error) {
    console.error("Error en la API de geocodificación:", error);
    return { suggestions: null, error: "No se pudieron obtener sugerencias de ciudades." };
  }
}
