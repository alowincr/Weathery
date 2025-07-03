export interface DailyForecast {
  day: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
}

export interface HourlyData {
  time: string;
  temp: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  isDay: boolean;
  forecast: DailyForecast[];
  dt: number;
  timezone: number;
  feels_like: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  hourly: HourlyData[];
}

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
}
