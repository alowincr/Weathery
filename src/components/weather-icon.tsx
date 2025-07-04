import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  icon: string;
  className?: string;
  isAnimated?: boolean;
}

export function WeatherIcon({ icon, className, isAnimated = false }: WeatherIconProps) {
  const iconName = icon.toLowerCase();

  const animationClass = isAnimated 
    ? (iconName.includes("clear") ? "animate-sun-rotate" : "animate-cloud-float") 
    : "";

  const finalClassName = cn(className, animationClass);

  let IconComponent: React.ComponentType<LucideProps> = Sun;

  if (iconName.includes("clear")) {
    IconComponent = Sun;
  } else if (iconName.includes("cloud")) {
    IconComponent = Cloud;
  } else if (iconName.includes("rain")) {
    IconComponent = CloudRain;
  } else if (iconName.includes("snow")) {
    IconComponent = CloudSnow;
  } else if (iconName.includes("mist") || iconName.includes("fog")) {
    IconComponent = CloudFog;
  }
  
  return <IconComponent className={finalClassName} />;
}
