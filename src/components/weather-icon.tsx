import { Sun, Cloud, CloudRain, CloudSnow, CloudFog } from "lucide-react";

export function WeatherIcon({ icon, className }: { icon: string, className?: string }) {
  const iconName = icon.toLowerCase();

  if (iconName.includes("clear")) {
    return <Sun className={className} />;
  }
  if (iconName.includes("cloud")) {
    return <Cloud className={className} />;
  }
  if (iconName.includes("rain")) {
    return <CloudRain className={className} />;
  }
  if (iconName.includes("snow")) {
    return <CloudSnow className={className} />;
  }
  if (iconName.includes("mist") || iconName.includes("fog")) {
    return <CloudFog className={className} />;
  }
  
  return <Sun className={className} />;
}
