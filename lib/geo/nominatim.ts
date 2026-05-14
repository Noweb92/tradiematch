// OpenStreetMap Nominatim — free address autocomplete + geocoding.
// Docs: https://nominatim.org/release-docs/develop/api/Overview/
// Usage policy: max 1 req/sec, include a User-Agent header identifying this app.

export interface GeoSuggestion {
  display_name: string;
  lat: number;
  lon: number;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "TradieMatch/1.0 (hello@tradiematch.com.au)";

interface NominatimRaw {
  display_name: string;
  lat: string;
  lon: string;
  address?: GeoSuggestion["address"];
}

/**
 * Search AU addresses. Restricted to country code 'au' for relevance.
 */
export async function searchAU(query: string): Promise<GeoSuggestion[]> {
  if (query.trim().length < 3) return [];

  const url = new URL("/search", NOMINATIM_BASE);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("countrycodes", "au");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "en-AU" },
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as NominatimRaw[];
    return data.map((d) => ({
      display_name: d.display_name,
      lat: parseFloat(d.lat),
      lon: parseFloat(d.lon),
      address: d.address,
    }));
  } catch {
    return [];
  }
}

/**
 * Haversine distance between two points in kilometres.
 * Good enough for swipe deck filtering up to ~100km.
 */
export function haversineKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
