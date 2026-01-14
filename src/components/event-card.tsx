"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Event } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const sportEmojis: Record<string, string> = {
  Soccer: "⚽",
  Basketball: "🏀",
  Tennis: "🎾",
  Baseball: "⚾",
  Football: "🏈",
  Hockey: "🏒",
  Golf: "⛳",
  Swimming: "🏊",
  Volleyball: "🏐",
  Rugby: "🏉",
  Cricket: "🏏",
  Boxing: "🥊",
  MMA: "🥋",
  Running: "🏃",
  Cycling: "🚴",
  Other: "🏆",
};

export function EventCard({ event, onDelete, isDeleting }: EventCardProps) {
  const eventDate = new Date(event.date_time);
  const isPast = eventDate < new Date();

  return (
    <Card
      className={`group transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold line-clamp-1">
              {event.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <span className="text-lg">
                {sportEmojis[event.sport_type] || "🏆"}
              </span>
              <Badge variant="secondary" className="text-xs font-semibold">
                {event.sport_type}
              </Badge>
              {isPast && (
                <Badge variant="outline" className="text-xs">
                  Past
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(eventDate, "PPP 'at' p")}</span>
          </div>
          {event.venues && event.venues.length > 0 && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <div className="space-y-0.5">
                {event.venues.map((venue, idx) => (
                  <div key={venue.id || idx} className="line-clamp-1">
                    {venue.name}
                    {venue.address && (
                      <span className="text-muted-foreground/70">
                        {" "}
                        • {venue.address}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {event.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/events/${event.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(event.id)}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
