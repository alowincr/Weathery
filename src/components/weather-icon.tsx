import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  icon: string;
  className?: string;
}

export function WeatherIcon({ icon, className }: WeatherIconProps) {
  const iconName = icon.toLowerCase();

  let IconComponent: React.ComponentType<LucideProps> = Cloud;
  let animationClass = "";

  if (iconName.includes("clear")) {
    IconComponent = Sun;
    animationClass = "gsap-sun";
  } else if (iconName.includes("cloud")) {
    IconComponent = Cloud;
    animationClass = "gsap-cloud";
  } else if (iconName.includes("rain")) {
    IconComponent = CloudRain;
    animationClass = "gsap-cloud";
  } else if (iconName.includes("snow")) {
    IconComponent = CloudSnow;
    animationClass = "gsap-cloud";
  } else if (iconName.includes("mist") || iconName.includes("fog")) {
    IconComponent = CloudFog;
    animationClass = "gsap-cloud";
  } else {
    // Fallback for other conditions
    IconComponent = Cloud;
    animationClass = "gsap-cloud";
  }
  
  return <IconComponent className={cn(className, animationClass)} />;
}
