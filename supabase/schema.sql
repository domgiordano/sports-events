-- Sports Events Management Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sport_type VARCHAR(50) NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  capacity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date_time ON public.events(date_time);
CREATE INDEX IF NOT EXISTS idx_events_sport_type ON public.events(sport_type);
CREATE INDEX IF NOT EXISTS idx_venues_event_id ON public.venues(event_id);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Users can view their own events" 
  ON public.events FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events" 
  ON public.events FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" 
  ON public.events FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" 
  ON public.events FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for venues (based on event ownership)
CREATE POLICY "Users can view venues of their events" 
  ON public.venues FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = venues.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create venues for their events" 
  ON public.venues FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = venues.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update venues of their events" 
  ON public.venues FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = venues.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete venues of their events" 
  ON public.venues FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = venues.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
