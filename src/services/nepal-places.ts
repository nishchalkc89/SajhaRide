/**
 * Nepal-wide place catalogue + keyword search.
 *
 * Standing in for a Places Autocomplete backend. Covers the Kathmandu valley in
 * detail plus major cities/landmarks across all provinces, so search returns
 * sensible suggestions from anywhere in Nepal. `searchPlaces` is the single
 * lookup seam — swap its body for a Google Places call once an API key + network
 * are wired, keeping the same signature.
 */

import type { NamedPlace } from '@/types/ride';

/** id, title, subtitle, lat, lng */
type Row = [string, string, string, number, number];

const ROWS: Row[] = [
  // --- Kathmandu ---
  ['thamel', 'Thamel', 'Kathmandu', 27.7154, 85.3123],
  ['durbarmarg', 'Durbar Marg', 'Kathmandu', 27.7118, 85.3197],
  ['newroad', 'New Road', 'Kathmandu', 27.7041, 85.3096],
  ['baneshwor', 'New Baneshwor', 'Kathmandu', 27.6893, 85.3436],
  ['koteshwor', 'Koteshwor', 'Kathmandu', 27.6784, 85.3497],
  ['baluwatar', 'Baluwatar', 'Kathmandu', 27.7275, 85.3275],
  ['maharajgunj', 'Maharajgunj', 'Kathmandu', 27.7361, 85.3311],
  ['chabahil', 'Chabahil', 'Kathmandu', 27.7176, 85.3465],
  ['boudha', 'Boudhanath Stupa', 'Kathmandu', 27.7215, 85.3620],
  ['swayambhu', 'Swayambhunath', 'Kathmandu', 27.7149, 85.2903],
  ['pashupati', 'Pashupatinath Temple', 'Kathmandu', 27.7104, 85.3488],
  ['kalanki', 'Kalanki', 'Kathmandu', 27.6936, 85.2810],
  ['balaju', 'Balaju', 'Kathmandu', 27.7357, 85.3020],
  ['gongabu', 'Gongabu Bus Park', 'Kathmandu', 27.7357, 85.3116],
  ['tia', 'Tribhuvan International Airport (TIA)', 'Kathmandu', 27.6966, 85.3591],
  ['basantapur', 'Basantapur Durbar Square', 'Kathmandu', 27.7043, 85.3070],
  ['sundhara', 'Sundhara', 'Kathmandu', 27.7005, 85.3140],

  // --- Lalitpur / Patan ---
  ['balkumari', 'Balkumari', 'Lalitpur', 27.6667, 85.3333],
  ['patandurbar', 'Patan Durbar Square', 'Lalitpur', 27.6727, 85.3255],
  ['jawalakhel', 'Jawalakhel', 'Lalitpur', 27.6730, 85.3110],
  ['pulchowk', 'Pulchowk', 'Lalitpur', 27.6789, 85.3169],
  ['kupandole', 'Kupandole', 'Lalitpur', 27.6889, 85.3138],
  ['satdobato', 'Satdobato', 'Lalitpur', 27.6586, 85.3255],
  ['lagankhel', 'Lagankhel', 'Lalitpur', 27.6667, 85.3231],
  ['imadol', 'Imadol', 'Lalitpur', 27.6602, 85.3437],
  ['godawari', 'Godawari', 'Lalitpur', 27.5966, 85.3820],

  // --- Bhaktapur ---
  ['bhaktapurdurbar', 'Bhaktapur Durbar Square', 'Bhaktapur', 27.6710, 85.4298],
  ['suryabinayak', 'Suryabinayak', 'Bhaktapur', 27.6602, 85.4290],
  ['thimi', 'Madhyapur Thimi', 'Bhaktapur', 27.6810, 85.3860],
  ['nagarkot', 'Nagarkot Viewpoint', 'Bhaktapur', 27.7154, 85.5209],
  ['kirtipur', 'Kirtipur', 'Kathmandu', 27.6786, 85.2896],

  // --- Pokhara (Gandaki) ---
  ['lakeside', 'Lakeside', 'Pokhara', 28.2096, 83.9586],
  ['phewa', 'Phewa Lake', 'Pokhara', 28.2100, 83.9460],
  ['sarangkot', 'Sarangkot', 'Pokhara', 28.2440, 83.9490],
  ['pokhara-airport', 'Pokhara International Airport', 'Pokhara', 28.1980, 83.9820],
  ['mahendrapul', 'Mahendrapul', 'Pokhara', 28.2280, 83.9856],

  // --- Chitwan / Bharatpur ---
  ['bharatpur', 'Bharatpur', 'Chitwan', 27.6768, 84.4370],
  ['sauraha', 'Sauraha', 'Chitwan', 27.5790, 84.5040],
  ['narayangarh', 'Narayangarh', 'Chitwan', 27.7010, 84.4310],

  // --- Other major cities ---
  ['biratnagar', 'Biratnagar', 'Morang', 26.4525, 87.2718],
  ['dharan', 'Dharan', 'Sunsari', 26.8065, 87.2846],
  ['itahari', 'Itahari', 'Sunsari', 26.6646, 87.2718],
  ['butwal', 'Butwal', 'Rupandehi', 27.7006, 83.4484],
  ['bhairahawa', 'Siddharthanagar (Bhairahawa)', 'Rupandehi', 27.5049, 83.4501],
  ['lumbini', 'Lumbini', 'Rupandehi', 27.4833, 83.2764],
  ['nepalgunj', 'Nepalgunj', 'Banke', 28.0500, 81.6167],
  ['birgunj', 'Birgunj', 'Parsa', 27.0104, 84.8770],
  ['janakpur', 'Janakpurdham', 'Dhanusha', 26.7288, 85.9266],
  ['hetauda', 'Hetauda', 'Makwanpur', 27.4280, 85.0326],
  ['dhangadhi', 'Dhangadhi', 'Kailali', 28.6833, 80.6000],
  ['mahendranagar', 'Bhimdatta (Mahendranagar)', 'Kanchanpur', 28.9634, 80.1780],
  ['damak', 'Damak', 'Jhapa', 26.6600, 87.7000],
  ['birtamod', 'Birtamod', 'Jhapa', 26.6440, 87.9910],
  ['gorkha', 'Gorkha Bazaar', 'Gorkha', 28.0000, 84.6333],
  ['bandipur', 'Bandipur', 'Tanahun', 27.9350, 84.4090],
  ['tansen', 'Tansen', 'Palpa', 27.8686, 83.5453],
  ['ilam', 'Ilam Bazaar', 'Ilam', 26.9090, 87.9280],
  ['besisahar', 'Besisahar', 'Lamjung', 28.2330, 84.3770],
];

export const NEPAL_PLACES: NamedPlace[] = ROWS.map(([id, title, subtitle, lat, lng]) => ({
  id,
  title,
  subtitle,
  coordinate: { latitude: lat, longitude: lng },
}));

/**
 * Instant local search over the built-in catalogue. Matches title or subtitle
 * (city), ranks prefix/word-start hits above mid-string ones. Returns [] for an
 * empty query. Used for zero-latency suggestions before the network responds.
 */
export function searchPlaces(query: string, limit = 12): NamedPlace[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = NEPAL_PLACES.map((place) => {
    const title = place.title.toLowerCase();
    const sub = (place.subtitle ?? '').toLowerCase();
    let score = -1;
    if (title.startsWith(q)) score = 0;
    else if (title.includes(` ${q}`) || title.includes(`(${q}`)) score = 1;
    else if (title.includes(q)) score = 2;
    else if (sub.startsWith(q)) score = 3;
    else if (sub.includes(q)) score = 4;
    return { place, score };
  }).filter((r) => r.score >= 0);

  scored.sort((a, b) => a.score - b.score || a.place.title.localeCompare(b.place.title));
  return scored.slice(0, limit).map((r) => r.place);
}

/**
 * Live geocoding across ALL of Nepal via OpenStreetMap Nominatim (keyless).
 * This is what makes far-flung queries like "dang tulsipur" resolve — the
 * static list only covers major hubs. Throttle callers to ~1 req/sec per
 * Nominatim's usage policy (the search screen debounces).
 */
export async function searchPlacesRemote(query: string, signal?: AbortSignal): Promise<NamedPlace[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}` +
    `&countrycodes=np&format=jsonv2&addressdetails=1&limit=12`;

  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const rows: NominatimRow[] = await res.json();
    return rows.map(toNamedPlace);
  } catch {
    // Network/abort — caller falls back to local results.
    return [];
  }
}

type NominatimRow = {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  address?: Record<string, string>;
};

function toNamedPlace(row: NominatimRow): NamedPlace {
  // Prefer the specific name as the title; show the FULL address underneath so
  // every result carries detail (street, ward, city, district, province…),
  // not just the headline place name.
  const segments = row.display_name.split(',').map((s) => s.trim());
  const primary = row.name || segments[0];

  // Drop a leading segment that just repeats the title, and Nepal's country
  // suffix, then rejoin the rest as the detailed address line.
  const rest = segments.filter((s, i) => !(i === 0 && s === primary) && s !== 'Nepal' && s !== 'नेपाल');
  const subtitle = rest.join(', ');

  return {
    id: `osm-${row.place_id}`,
    title: primary,
    subtitle: subtitle || undefined,
    coordinate: { latitude: parseFloat(row.lat), longitude: parseFloat(row.lon) },
  };
}
