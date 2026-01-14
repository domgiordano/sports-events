"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types";
import { deleteEvent } from "@/actions/events";
import { EventCard } from "@/components/event-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CalendarX } from "lucide-react";
import Link from "next/link";

interface EventsListProps {
  events: Event[];
}

export function EventsList({ events }: EventsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const handleDeleteClick = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      setEventToDelete(event);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setDeletingId(eventToDelete.id);
    const result = await deleteEvent(eventToDelete.id);

    if (result.success) {
      toast.success("Event deleted successfully!");
      router.refresh();
    } else {
      toast.error(result.error);
    }

    setDeletingId(null);
    setShowDeleteDialog(false);
    setEventToDelete(null);
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <CalendarX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No events found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first sports event.
        </p>
        <Button asChild>
          <Link href="/events/new">Create Event</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={handleDeleteClick}
            isDeleting={deletingId === event.id}
          />
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{eventToDelete?.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={!!deletingId}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={!!deletingId}
            >
              {deletingId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
