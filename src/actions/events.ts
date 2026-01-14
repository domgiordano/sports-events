"use server";

import { createClient } from "@/lib/supabase/server";
import { safeAction, ActionResult } from "@/lib/action-helpers";
import { revalidatePath } from "next/cache";
import { Event, EventFormData, SportType } from "@/types";

export interface EventsQueryParams {
  search?: string;
  sportType?: SportType | "all";
}

export async function getEvents(
  params?: EventsQueryParams
): Promise<ActionResult<Event[]>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    let query = supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .order("date_time", { ascending: true });

    // Apply search filter
    if (params?.search) {
      query = query.ilike("name", `%${params.search}%`);
    }

    // Apply sport type filter
    if (params?.sportType && params.sportType !== "all") {
      query = query.eq("sport_type", params.sportType);
    }

    const { data: events, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Fetch venues for each event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventsWithVenues: Event[] = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (events || []).map(async (event: any) => {
        const { data: venues } = await supabase
          .from("venues")
          .select("*")
          .eq("event_id", event.id);

        return {
          ...event,
          description: event.description || undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          venues: (venues || []).map((v: any) => ({
            id: v.id,
            name: v.name,
            address: v.address || undefined,
            capacity: v.capacity || undefined,
          })),
        } as Event;
      })
    );

    return eventsWithVenues;
  });
}

export async function getEventById(id: string): Promise<ActionResult<Event>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!event) {
      throw new Error("Event not found");
    }

    // Fetch venues for the event
    const { data: venues } = await supabase
      .from("venues")
      .select("*")
      .eq("event_id", event.id);

    return {
      ...event,
      description: event.description || undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      venues: (venues || []).map((v: any) => ({
        id: v.id,
        name: v.name,
        address: v.address || undefined,
        capacity: v.capacity || undefined,
      })),
    } as Event;
  });
}

export async function createEvent(
  formData: EventFormData
): Promise<ActionResult<Event>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Validate required fields
    if (!formData.name?.trim()) {
      throw new Error("Event name is required");
    }

    if (!formData.sport_type) {
      throw new Error("Sport type is required");
    }

    if (!formData.date_time) {
      throw new Error("Date and time are required");
    }

    if (!formData.venues || formData.venues.length === 0) {
      throw new Error("At least one venue is required");
    }

    // Create the event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        name: formData.name.trim(),
        sport_type: formData.sport_type,
        date_time: formData.date_time,
        description: formData.description?.trim() || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (eventError) {
      throw new Error(eventError.message);
    }

    // Create venues
    const venueInserts = formData.venues.map((venue) => ({
      event_id: event.id,
      name: venue.name.trim(),
      address: venue.address?.trim() || null,
      capacity: venue.capacity || null,
    }));

    const { data: venues, error: venueError } = await supabase
      .from("venues")
      .insert(venueInserts)
      .select();

    if (venueError) {
      // Rollback: delete the event if venue creation fails
      await supabase.from("events").delete().eq("id", event.id);
      throw new Error(venueError.message);
    }

    revalidatePath("/dashboard");

    return {
      ...event,
      venues: venues || [],
    } as Event;
  });
}

export async function updateEvent(
  id: string,
  formData: EventFormData
): Promise<ActionResult<Event>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Validate required fields
    if (!formData.name?.trim()) {
      throw new Error("Event name is required");
    }

    if (!formData.sport_type) {
      throw new Error("Sport type is required");
    }

    if (!formData.date_time) {
      throw new Error("Date and time are required");
    }

    if (!formData.venues || formData.venues.length === 0) {
      throw new Error("At least one venue is required");
    }

    // Verify ownership
    const { data: existingEvent } = await supabase
      .from("events")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existingEvent) {
      throw new Error("Event not found or access denied");
    }

    // Update the event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .update({
        name: formData.name.trim(),
        sport_type: formData.sport_type,
        date_time: formData.date_time,
        description: formData.description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (eventError) {
      throw new Error(eventError.message);
    }

    // Delete existing venues and create new ones
    await supabase.from("venues").delete().eq("event_id", id);

    const venueInserts = formData.venues.map((venue) => ({
      event_id: id,
      name: venue.name.trim(),
      address: venue.address?.trim() || null,
      capacity: venue.capacity || null,
    }));

    const { data: venues, error: venueError } = await supabase
      .from("venues")
      .insert(venueInserts)
      .select();

    if (venueError) {
      throw new Error(venueError.message);
    }

    revalidatePath("/dashboard");
    revalidatePath(`/events/${id}`);

    return {
      ...event,
      venues: venues || [],
    } as Event;
  });
}

export async function deleteEvent(id: string): Promise<ActionResult<null>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const { data: existingEvent } = await supabase
      .from("events")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existingEvent) {
      throw new Error("Event not found or access denied");
    }

    // Delete venues first (foreign key constraint)
    await supabase.from("venues").delete().eq("event_id", id);

    // Delete the event
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard");

    return null;
  });
}
