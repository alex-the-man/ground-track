import { degToRad, normalizeDegree, normalizeGeoLon, radToDeg } from './MathUtils';
import { j2000jd } from './JulianUtils';

import LatLngLiteral = google.maps.LatLngLiteral

const earthFlatteningFactor = 1 / 298.257223563; // WGS84

// Return time, not angle.
function greenwichSideralTime(jde: number): number {
  return 18.697374558 + 24.06570982441908 * j2000jd(jde);
}

export default class EquatorialCoordinate {
  ra: number; // In angle, not in time.
  dec: number;
  r: number;

  constructor(ra: number, dec: number, r: number) {
    this.ra = ra;
    this.dec = dec;
    this.r = r;
  }

  // Assume current ra & dec are in ECI.
  eciToECEF(jde: number): EquatorialCoordinate {
    const ra = this.ra - degToRad(greenwichSideralTime(jde) * 15);
    return new EquatorialCoordinate(ra, this.dec, this.r);
  }

  ecefToWGS84(): LatLngLiteral {
    const flatteningRatio = (1 - earthFlatteningFactor);
    const lat = Math.atan2(Math.tan(this.dec) / flatteningRatio / flatteningRatio, Math.cos(this.dec));

    return {
      lat: normalizeDegree(radToDeg(lat)),
      lng: normalizeGeoLon(radToDeg(this.ra))
    }
  }

  toLatLng(): LatLngLiteral {
    return {
      lat: normalizeDegree(radToDeg(this.dec)),
      lng: normalizeGeoLon(radToDeg(this.ra))
    }
  }
}
