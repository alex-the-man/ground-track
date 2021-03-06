import { degToRad } from './MathUtils';
import EquatorialCoordinate from './EquatorialCoordinate';

const earthObliquity = degToRad(23.4397);

export default class EclipticSphericalCoordinate {
  lon: number;
  lat: number;
  r: number;

  constructor(lon: number, lat: number, r: number) {
    this.lon = lon;
    this.lat = lat;
    this.r = r;
  }

  // Assume lon/lat/dist are geocentric.
  toECI(): EquatorialCoordinate {
    const e = earthObliquity;
    const lon = this.lon, lat = this.lat;

    const ra = Math.atan2(Math.sin(lon) * Math.cos(e) - Math.tan(lat) * Math.sin(e), Math.cos(lon));
    const dec = Math.asin(Math.sin(lat) * Math.cos(e) + Math.cos(lat) * Math.sin(e) * Math.sin(lon));

    return new EquatorialCoordinate(ra, dec, this.r);
  }
}
