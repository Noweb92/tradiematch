export type SwipeRole = "customer" | "tradie";
export type SwipeDirection = "left" | "right";

export interface SwipeResult {
  ok: boolean;
  matched?: boolean;
  match_id?: string;
  chat_room_id?: string;
  error?: string;
  code?: "QUOTA_EXCEEDED" | "NO_SUBSCRIPTION";
}

export interface TradieCard {
  id: string;
  profile_id: string;
  business_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  trade_categories: string[];
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  years_experience: number | null;
  rating_average: number;
  rating_count: number;
  response_rate: number;
  service_radius_km: number;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  portfolio: string[];
  distance_km: number | null;
}

export interface JobCard {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  trade_category: string;
  photos: string[];
  urgency: "flexible" | "within_week" | "asap";
  budget_min: number | null;
  budget_max: number | null;
  location_address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  customer_first_name: string | null;
  customer_city: string | null;
  distance_km: number | null;
}
