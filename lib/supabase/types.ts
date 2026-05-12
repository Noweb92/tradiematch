// Database types for TradieMatch V1
// Hand-written to match supabase/migrations/0001_initial_schema.sql
// Regenerate with `npx supabase gen types typescript --project-id <id>` once linked.

export type UserRole = "customer" | "tradie" | "admin";
export type SubscriptionTier = "none" | "basic" | "pro" | "elite";
export type JobStatus =
  | "open"
  | "matched"
  | "in_progress"
  | "completed"
  | "canceled";
export type JobUrgency = "flexible" | "within_week" | "asap";
export type SwipeRole = "customer" | "tradie";
export type SwipeDirection = "left" | "right";
export type MatchStatus = "active" | "expired" | "converted" | "declined";
export type MessageType = "text" | "image" | "quote" | "system";
export type QuoteStatus = "pending" | "accepted" | "declined" | "expired";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  phone_verified: boolean;
  onboarding_completed: boolean;
  city: string | null;
  state: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tradie {
  id: string;
  profile_id: string;
  abn: string;
  abn_verified: boolean;
  abn_verified_at: string | null;
  abn_entity_name: string | null;
  abn_entity_type: string | null;
  abn_gst_registered: boolean | null;
  business_name: string | null;
  trade_categories: string[];
  service_radius_km: number;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  years_experience: number | null;
  bio: string | null;
  white_card_url: string | null;
  insurance_url: string | null;
  insurance_expiry: string | null;
  police_check_url: string | null;
  admin_verified: boolean;
  admin_verified_at: string | null;
  admin_verified_by: string | null;
  admin_rejection_reason: string | null;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  matches_quota_monthly: number;
  matches_used_this_period: number;
  rating_average: number;
  rating_count: number;
  response_rate: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TradiePortfolio {
  id: string;
  tradie_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  profile_id: string;
  created_at: string;
}

export interface Job {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  trade_category: string;
  photos: string[];
  location_address: string | null;
  latitude: number | null;
  longitude: number | null;
  urgency: JobUrgency;
  budget_min: number | null;
  budget_max: number | null;
  status: JobStatus;
  matched_tradie_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Swipe {
  id: string;
  job_id: string;
  tradie_id: string;
  swiper_role: SwipeRole;
  direction: SwipeDirection;
  created_at: string;
}

export interface Match {
  id: string;
  job_id: string;
  tradie_id: string;
  customer_id: string;
  matched_at: string;
  exclusive_until: string;
  status: MatchStatus;
  chat_room_id: string | null;
  completed_at: string | null;
}

export interface ChatRoom {
  id: string;
  match_id: string;
  created_at: string;
  last_message_at: string | null;
}

export interface ChatMessage {
  id: string;
  chat_room_id: string;
  sender_id: string;
  content: string | null;
  attachment_url: string | null;
  read_at: string | null;
  message_type: MessageType;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Quote {
  id: string;
  match_id: string;
  tradie_id: string;
  amount: number;
  description: string | null;
  valid_until: string | null;
  status: QuoteStatus;
  created_at: string;
  responded_at: string | null;
}

export interface Review {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id" | "email" | "role">;
        Update: Partial<Profile>;
      };
      tradies: {
        Row: Tradie;
        Insert: Partial<Tradie> & Pick<Tradie, "profile_id" | "abn">;
        Update: Partial<Tradie>;
      };
      tradie_portfolio: {
        Row: TradiePortfolio;
        Insert: Partial<TradiePortfolio> &
          Pick<TradiePortfolio, "tradie_id" | "image_url">;
        Update: Partial<TradiePortfolio>;
      };
      customers: {
        Row: Customer;
        Insert: Partial<Customer> & Pick<Customer, "profile_id">;
        Update: Partial<Customer>;
      };
      jobs: {
        Row: Job;
        Insert: Partial<Job> &
          Pick<Job, "customer_id" | "title" | "description" | "trade_category">;
        Update: Partial<Job>;
      };
      swipes: {
        Row: Swipe;
        Insert: Omit<Swipe, "id" | "created_at">;
        Update: Partial<Swipe>;
      };
      matches: {
        Row: Match;
        Insert: Partial<Match> &
          Pick<Match, "job_id" | "tradie_id" | "customer_id">;
        Update: Partial<Match>;
      };
      chat_rooms: {
        Row: ChatRoom;
        Insert: Partial<ChatRoom> & Pick<ChatRoom, "match_id">;
        Update: Partial<ChatRoom>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Partial<ChatMessage> &
          Pick<ChatMessage, "chat_room_id" | "sender_id">;
        Update: Partial<ChatMessage>;
      };
      quotes: {
        Row: Quote;
        Insert: Partial<Quote> &
          Pick<Quote, "match_id" | "tradie_id" | "amount">;
        Update: Partial<Quote>;
      };
      reviews: {
        Row: Review;
        Insert: Partial<Review> &
          Pick<Review, "job_id" | "reviewer_id" | "reviewee_id" | "rating">;
        Update: Partial<Review>;
      };
    };
  };
};
