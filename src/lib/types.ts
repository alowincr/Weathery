export interface DailyForecast {
  day: string;
  temperature: number;
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
  forecast: DailyForecast[];
}
