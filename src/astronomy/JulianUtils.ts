export const j2000 = 2451545.0;

// Convert Julian Date to J2000 epoch Julian date 
export function j2000jd(jd: number): number {
  return jd - j2000;
}

export function unixTimestampToJulianDate(ts: number): number {
  return ts / 86400 + 2440587.5;
}
