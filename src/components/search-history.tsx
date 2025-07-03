"use client";

import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SearchHistoryProps {
  history: string[];
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export function SearchHistory({ history, onSearch, disabled }: SearchHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          Recent Searches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {history.map((city) => (
            <button
              key={city}
              onClick={() => onSearch(city)}
              disabled={disabled}
              className="rounded-full"
              aria-label={`Search for ${city}`}
            >
              <Badge
                variant="outline"
                className="cursor-pointer border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {city}
              </Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
