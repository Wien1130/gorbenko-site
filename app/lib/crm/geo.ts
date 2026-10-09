/** Адрес → координаты через Google Geocoding API (ключ только на сервере). */
export async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || !address.trim()) return null;
  const q = /wien|vienna|\b1\d{3}\b/i.test(address) ? address : `${address}, Wien`;
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

export function parseCoord(v: unknown): number | null {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) && n !== 0 ? n : null;
}
