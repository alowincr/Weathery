export interface DailyForecast {
  day: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
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
}

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
}
