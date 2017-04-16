export function degToRad(d: number): number {
  return d * Math.PI / 180.0;
}

export function radToDeg(r: number): number {
  return r * 180.0 / Math.PI;
}

export function normalizeAngle(deg: number): number {
  return deg % 360;
}
