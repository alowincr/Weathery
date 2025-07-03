"use client";

import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          Búsquedas Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {history.map((city) => (
            <Button
              key={city}
              variant="secondary"
              size="sm"
              onClick={() => onSearch(city)}
              disabled={disabled}
              className="rounded-full"
            >
              {city}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
