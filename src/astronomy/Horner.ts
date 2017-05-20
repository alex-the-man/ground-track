import { j2000jd } from './JulianUtils'
import { degToRad } from './MathUtils'

// Horner's method to calculate polynomial.
export function jcHorner(a0: number, a1: number, a2: number, a3: number, a4: number, jde: number): number {
  const t = j2000jd(jde) / 36525; // Convert Julian centuries to Julian day.
  return a0 + t * (a1 + t * (a2 + t * (a3 + t * a4)));
}

export function jdeHorner2(a0: number, a1: number, a2: number): (jde: number) => number {
  return jcHorner.bind(this, a0, a1, a2, 0, 0);
}

// Convert angles from degree to radian.
export function jdeHornerDeg4(a0: number, a1: number, a2: number, a3: number, a4: number): (jde: number) => number {
  return jcHorner.bind(this, degToRad(a0), degToRad(a1), degToRad(a2), degToRad(a3), degToRad(a4));
}

export function jdeHornerDeg3(a0: number, a1: number, a2: number, a3: number): (jde: number) => number {
  return jdeHornerDeg4(a0, a1, a2, a3, 0);
}

export function jdeHornerDeg2(a0: number, a1: number, a2: number): (jde: number) => number {
  return jdeHornerDeg4(a0, a1, a2, 0, 0);
}

export function jdeHornerDeg1(a0: number, a1: number): (jde: number) => number {
  return jdeHornerDeg4(a0, a1, 0, 0, 0);
}
