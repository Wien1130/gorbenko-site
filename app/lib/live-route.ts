const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const SEARCH_RADIUS_M = 2500;
const RESULT_LIMIT = 5;
const PLACE_TYPES = ["restaurant", "cafe", "bar", "store", "art_gallery"];

export interface ViennaArea {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export const VIENNA_AREAS: ViennaArea[] = [
  { id: "center", label: "Центр (1. Innere Stadt)", lat: 48.2082, lng: 16.3738 },
  { id: "mariahilf", label: "Mariahilf / Neubau (6-7)", lat: 48.2, lng: 16.36 },
  { id: "josefstadt", label: "Josefstadt / Alsergrund (8-9)", lat: 48.215, lng: 16.35 },
  { id: "landstrasse", label: "Landstraße (3)", lat: 48.21, lng: 16.42 },
  { id: "hietzing", label: "Hietzing (13)", lat: 48.185, lng: 16.29 },
  { id: "waehring", label: "Hernals / Währing (17-18)", lat: 48.22, lng: 16.34 },
];

export interface RouteCandidate {
  name: string;
  address: string;
  rating: number;
  reviews: number;
  hasWebsite: boolean;
  pain: string;
}

interface PlaceResult {
  place_id?: string;
  name?: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
}

interface PlaceDetails {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address?: string;
  website?: string;
  business_status?: string;
  opening_hours?: { open_now?: boolean };
}

async function nearbySearch(lat: number, lng: number, type: string): Promise<PlaceResult[]> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", String(SEARCH_RADIUS_M));
  url.searchParams.set("type", type);
  url.searchParams.set("opennow", "true");
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY!);
  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

async function placeDetails(placeId: string): Promise<PlaceDetails> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,rating,user_ratings_total,formatted_address,website,business_status,opening_hours");
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY!);
  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    return data.result ?? {};
  } catch {
    return {};
  }
}

function painReason(rating: number, reviews: number, website: string): string {
  const reasons: string[] = [];
  if (rating >= 4.8 && reviews < 15) reasons.push("подозрительно идеальные отзывы");
  else if (rating < 4.0) reasons.push("невысокий рейтинг");
  if (reviews < 20) reasons.push("мало отзывов");
  if (!website) reasons.push("нет сайта");
  return reasons.length ? reasons.join(", ") : "стабильно, но можно лучше в соцсетях";
}

function alreadyKnown(name: string, knownNames: string[]): boolean {
  const n = name.trim().toLowerCase();
  return knownNames.some((k) => k && (n === k || n.includes(k) || k.includes(n)));
}

export async function findLiveCandidates(area: ViennaArea, knownNames: string[]): Promise<RouteCandidate[]> {
  if (!GOOGLE_MAPS_API_KEY) return [];

  const seen = new Set<string>();
  const raw: PlaceResult[] = [];
  for (const type of PLACE_TYPES) {
    for (const place of await nearbySearch(area.lat, area.lng, type)) {
      if (!place.place_id || seen.has(place.place_id)) continue;
      seen.add(place.place_id);
      raw.push(place);
    }
  }

  const scored: (RouteCandidate & { hot: boolean })[] = [];
  for (const place of raw) {
    const name = place.name || "";
    if (alreadyKnown(name, knownNames)) continue;
    const details = await placeDetails(place.place_id!);
    if (details.business_status && details.business_status !== "OPERATIONAL") continue;
    if (details.opening_hours && details.opening_hours.open_now === false) continue;
    const rating = details.rating ?? place.rating ?? 0;
    const reviews = details.user_ratings_total ?? place.user_ratings_total ?? 0;
    const website = details.website || "";
    scored.push({
      name: details.name || name,
      address: details.formatted_address || place.vicinity || "",
      rating,
      reviews,
      hasWebsite: !!website,
      pain: painReason(rating, reviews, website),
      hot: rating < 4.0,
    });
  }

  scored.sort((a, b) => (Number(b.hot) - Number(a.hot)) || b.rating - a.rating);
  return scored.slice(0, RESULT_LIMIT).map((c) => ({
    name: c.name,
    address: c.address,
    rating: c.rating,
    reviews: c.reviews,
    hasWebsite: c.hasWebsite,
    pain: c.pain,
  }));
}

export function buildMapsRouteUrl(area: ViennaArea, stops: RouteCandidate[]): string {
  const points = [`${area.lat},${area.lng}`, ...stops.map((s) => s.address).filter(Boolean)];
  return "https://www.google.com/maps/dir/" + points.map((p) => encodeURIComponent(p)).join("/");
}
