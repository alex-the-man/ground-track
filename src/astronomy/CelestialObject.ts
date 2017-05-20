import EclipticSphericalCoordinate from './EclipticSphericalCoordinate'

interface CelestialObject {
  // Return position in ECLIPJ2000.
  pos(jde: number): EclipticSphericalCoordinate;
}

export default CelestialObject;
