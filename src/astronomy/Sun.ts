import { j2000jd } from './JulianUtils'
import { jdeHorner2, jdeHornerDeg1, jdeHornerDeg2 } from './Horner'
import { degToRad, normalizeEclipticLon } from './MathUtils'
import CelestialObject from './CelestialObject'
import EclipticSphericalCoordinate from './EclipticSphericalCoordinate'

const sin = Math.sin;

// Astronomical Algorithms, Second Edition page 163.
// Sun's mean longitude (25.2): L0
const l: (jde: number) => number = jdeHornerDeg2(280.46646, 36000.76983, 0.0003032);

// Sun's mean anomaly (25.3): M
const m: (jde: number) => number = jdeHornerDeg2(357.52911, 35999.05029, -0.0001537);

// Eccentricity of Earth (25.4): e
const e: (jde: number) => number = jdeHorner2(0.016708634, -0.000042037, -0.0000001267);

// Sun's equation of center: C
const c0 = jdeHornerDeg2(1.914602, -0.004817, -0.000014);
const c1 = jdeHornerDeg1(0.019993, -0.000101);
const c2term = degToRad(0.000289);
function c(jde: number): number {
  const m_ = m(jde);
  return c0(jde) * sin(m_) + c1(jde) * sin(2 * m_) + c2term * sin(3 * m_);
}

const precessionRate = degToRad(-0.01397) / 365.25;
function p(jde: number): number {
  return precessionRate * j2000jd(jde);
}

const lon0 = degToRad(-0.00569);
const lon1 = degToRad(-0.00478);

const lonOfAscNode: (jde: number) => number = jdeHornerDeg1(125.04, -1934.136);

export default class Sun implements CelestialObject {
  // Return position in ECLIPJ2000.
  pos(jde: number): EclipticSphericalCoordinate {
    const trueLon = l(jde) + c(jde) + p(jde); // True longitude
    const v =  m(jde) + c(jde); // True anomaly
    const lon = trueLon - lon0 - lon1 * sin(lonOfAscNode(jde));
    return new EclipticSphericalCoordinate(normalizeEclipticLon(lon), 0, 1);
  }
}
