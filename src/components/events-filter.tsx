"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SPORT_TYPES } from "@/types";
import { Search, X, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function EventsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const sportType = searchParams.get("sport") || "all";

  const updateFilters = (newSearch: string, newSport: string) => {
    const params = new URLSearchParams();

    if (newSearch) {
      params.set("search", newSearch);
    }

    if (newSport && newSport !== "all") {
      params.set("sport", newSport);
    }

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`);
    });
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateFilters(value, sportType);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const handleSportChange = (value: string) => {
    updateFilters(search, value);
  };

  const clearFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push("/dashboard");
    });
  };

  const hasFilters = search || sportType !== "all";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
          {isPending && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        <Select value={sportType} onValueChange={handleSportChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {SPORT_TYPES.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
