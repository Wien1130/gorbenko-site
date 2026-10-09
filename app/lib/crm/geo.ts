/**
 * Адрес → координаты. Сначала Google Geocoding (если API включён на ключе),
 * иначе OpenStreetMap Nominatim (бесплатно, лимит 1 запрос/сек — для ручного ввода хватает).
 */
export async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address.trim()) return null;
  const q = /wien|vienna|\b1\d{3}\b/i.test(address) ? address : `${address}, Wien`;
  return (await geocodeGoogle(q)) ?? (await geocodeNominatim(q));
}

async function geocodeGoogle(q: string): Promise<{ lat: number; lng: number } | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&region=at&key=${key}`,
    );
    const json = await res.json();
    const loc = json.results?.[0]?.geometry?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
  } catch {
    return null;
  }
}

async function geocodeNominatim(q: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=at&q=${encodeURIComponent(q)}`,
      { headers: { "User-Agent": "gorbenko.at cold-sales CRM (andrii@gorbenko.at)" } },
    );
    const json = await res.json();
    const hit = json?.[0];
    return hit ? { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) } : null;
  } catch {
    return null;
  }
}

export function parseCoord(v: unknown): number | null {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) && n !== 0 ? n : null;
}
