import { j2000jd } from './JulianUtils'
import { degToRad, normalizeRadian } from './MathUtils'
import EclipticSphericalCoordinate from './EclipticSphericalCoordinate'

// http://www.geoastro.de/moonmotion/index.html
const l0 = degToRad(218.31617);
const l1 = degToRad(481267.88088 / 36525);
const l2 = degToRad(4.06 / 3600 / 36525 / 36525);

const m0 = degToRad(134.96292);
const m1 = degToRad(477198.86753 / 36525);
const m2 = degToRad(33.25 / 3600 / 36525 / 36525);

const f0 = degToRad(93.27283);
const f1 = degToRad(483202.01873 / 36525);
const f2 = degToRad(-11.56 / 3600 / 36525 / 36525);

const lon1 = degToRad(6.289);

const lat1 = degToRad(5.128);

const dist0 = 385001;
const dist1 = -20905;

export default class Moon {
  private L(jde: number): number {
    const jd2000 = j2000jd(jde);
    return l0 + l1 * jd2000 + l2 * jd2000 * jd2000;
  }
  
  private M(jde: number): number {
    const jd2000 = j2000jd(jde);
    return m0 + m1 * jd2000 + m2 * jd2000 * jd2000;
  }
  
  private F(jde: number): number {
    const jd2000 = j2000jd(jde);
    return f0 + f1 * jd2000 + f2 * jd2000 * jd2000;
  }

  // Return position in geocentric ecliptic coordinates.
  pos(jde: number): EclipticSphericalCoordinate {
    const l = this.L(jde);
    const m = this.M(jde);
    const f = this.F(jde);

    const lon = normalizeRadian(l + lon1 * Math.sin(m));
    const lat = normalizeRadian(lat1 * Math.sin(f));
    const dist = dist0 + dist1 * Math.cos(m);
    return new EclipticSphericalCoordinate(lon, lat, dist);
  }
}
