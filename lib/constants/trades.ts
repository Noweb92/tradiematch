// Trade categories used across the platform.
// Keep in sync with `jobs.trade_category` text values + tradies.trade_categories[].

export interface TradeCategory {
  id: string;
  label: string;
  emoji: string;
}

export const TRADE_CATEGORIES: TradeCategory[] = [
  { id: "plumbing", label: "Plumbing", emoji: "🔧" },
  { id: "electrical", label: "Electrical", emoji: "⚡" },
  { id: "carpentry", label: "Carpentry", emoji: "🪚" },
  { id: "painting", label: "Painting", emoji: "🎨" },
  { id: "roofing", label: "Roofing", emoji: "🏠" },
  { id: "landscaping", label: "Landscaping", emoji: "🌿" },
  { id: "handyman", label: "Handyman", emoji: "🛠️" },
  { id: "tiling", label: "Tiling", emoji: "◻️" },
  { id: "flooring", label: "Flooring", emoji: "🪵" },
  { id: "glazing", label: "Glazing", emoji: "🪟" },
];

export function tradeLabel(id: string): string {
  return TRADE_CATEGORIES.find((t) => t.id === id)?.label ?? id;
}

export const AU_STATES = [
  { code: "WA", name: "Western Australia" },
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NT", name: "Northern Territory" },
] as const;

export const URGENCY_OPTIONS = [
  {
    id: "flexible",
    label: "Flexible",
    desc: "No rush — within the month",
  },
  {
    id: "within_week",
    label: "This week",
    desc: "Within the next 7 days",
  },
  {
    id: "asap",
    label: "ASAP",
    desc: "As soon as possible — emergency or near-emergency",
  },
] as const;
