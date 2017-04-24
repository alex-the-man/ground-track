export function degToRad(d: number): number {
  return d * Math.PI / 180.0;
}

export function radToDeg(r: number): number {
  return r * 180.0 / Math.PI;
}

export function normalizeDegree(deg: number): number {
  return deg % 360;
}

export function normalizeGeoLon(deg: number): number {
  deg = normalizeDegree(deg);
  if (deg > 180) {
    return deg - 360;
  } else if (deg < -180) {
    return deg + 360;
  } else {
    return deg;
  }
}

export function normalizeRadian(rad: number): number {
  return rad % (2 * Math.PI);
}

export function normalizeEclipticLon(rad: number): number {
  rad = normalizeRadian(rad);
  return (rad >= 0) ? rad : 2 * Math.PI + rad;
}
