import SP_CITIES_RAW from '../../../data/spCities.json';

export const CITY_COORDS = new Map<string, { lat: number; lng: number }>(
    (SP_CITIES_RAW as { name: string; lat: number; lng: number }[]).map((c) => [
        c.name.toUpperCase().trim(),
        { lat: c.lat, lng: c.lng },
    ]),
);

export function haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function distanceBetweenCities(a: string, b: string): number | null {
    const ca = CITY_COORDS.get(a.toUpperCase().trim());
    const cb = CITY_COORDS.get(b.toUpperCase().trim());
    if (!ca || !cb) return null;
    return haversineKm(ca.lat, ca.lng, cb.lat, cb.lng);
}
