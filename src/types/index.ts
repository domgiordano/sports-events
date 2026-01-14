export type SportType =
  | "Soccer"
  | "Basketball"
  | "Tennis"
  | "Baseball"
  | "Football"
  | "Hockey"
  | "Golf"
  | "Swimming"
  | "Volleyball"
  | "Rugby"
  | "Cricket"
  | "Boxing"
  | "MMA"
  | "Running"
  | "Cycling"
  | "Other";

export const SPORT_TYPES: SportType[] = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Baseball",
  "Football",
  "Hockey",
  "Golf",
  "Swimming",
  "Volleyball",
  "Rugby",
  "Cricket",
  "Boxing",
  "MMA",
  "Running",
  "Cycling",
  "Other",
];

export interface Venue {
  id: string;
  name: string;
  address?: string;
  capacity?: number;
}

export interface Event {
  id: string;
  name: string;
  sport_type: SportType;
  date_time: string;
  description?: string;
  venues: Venue[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  name: string;
  sport_type: SportType;
  date_time: string;
  description?: string;
  venues: Omit<Venue, "id">[];
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          name: string;
          sport_type: SportType;
          date_time: string;
          description: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sport_type: SportType;
          date_time: string;
          description?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sport_type?: SportType;
          date_time?: string;
          description?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      venues: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          address: string | null;
          capacity: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          address?: string | null;
          capacity?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          address?: string | null;
          capacity?: number | null;
          created_at?: string;
        };
      };
    };
  };
}
