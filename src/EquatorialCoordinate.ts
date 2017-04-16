import { degToRad } from './MathUtils';
import { j2000jd } from './JulianUtils';

// Return time, not angle.
function greenwichSideralTime(jd: number): number {
  return 18.697374558 + 24.06570982441908 * j2000jd(jd);
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
  eciToECEF(jd: number): EquatorialCoordinate {
    var ra = this.ra - degToRad(greenwichSideralTime(jd) * 15);
    return new EquatorialCoordinate(ra, this.dec, this.r);
  }
}
