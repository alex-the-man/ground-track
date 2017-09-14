import * as React from "react";
import * as ReactDOM from "react-dom";

import { radToDeg, degToRad, normalizeDegree } from "../astronomy/MathUtils";
import { j2000, unixTimestampToJulianDate } from "../astronomy/JulianUtils";
import CelestialObject from "../astronomy/CelestialObject";
import Sun from "../astronomy/Sun";
import Moon from "../astronomy/Moon";
import MapCircle from "./MapCircle";
import MapPolyline from "./MapPolyline";
import MapMarker from "./MapMarker";
import Map from "./Map";

import EquatorialCoordinate from "../astronomy/EquatorialCoordinate";

import LatLngLiteral = google.maps.LatLngLiteral

import math = require("mathjs")

class GroundTrack {
  pastLine: Array<LatLngLiteral> = [];
  futureLine: Array<LatLngLiteral> = [];
  position: LatLngLiteral;
}

function calculateGroundTrack(object: CelestialObject, midpointJd: number, periodInJulianDay: number, numSamples: number): GroundTrack {
  const midpoint = Math.floor(numSamples / 2);
  const track: GroundTrack = new GroundTrack();

  for (var i = 0; i <= numSamples; i++) {
    const jd = (i - midpoint) / numSamples * periodInJulianDay + midpointJd;
    const gecPos = object.pos(jd);
    const eciPos = gecPos.toECI();
    const ecefPos = eciPos.eciToECEF(jd);
    const latLng = ecefPos.ecefToWGS84();

    if (i == midpoint) {
      track.pastLine.push(latLng);
      track.futureLine.push(latLng);
      track.position = latLng;
    } else if (i > midpoint) {
      track.futureLine.push(latLng);
    } else {
      track.pastLine.push(latLng);
    }
  }

  return track;
}

interface AppState {
  now: number
}

class MapGroundTrackProps {
  groundTrack: GroundTrack;
  iconSize?: number;
  iconUrl?: string;
}

class MapGroundTrack extends React.Component<MapGroundTrackProps, undefined> {
  render(): any {
    const track = this.props.groundTrack;
    const iconUrl = this.props.iconUrl;
    const iconSize = this.props.iconSize;

    return (
      <div>
        <MapPolyline latLngs={track.pastLine} color="#AAA" opacity={0.9}/>
        <MapMarker pos={track.position} iconUrl={iconUrl} iconSize={iconSize} />
        <MapPolyline latLngs={track.futureLine} opacity={0.9}/>
      </div>
    );
  }
}

class App extends React.Component<undefined, AppState> {
  private moon = new Moon();
  private sun = new Sun();
  private timerId = -1;

  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      now: Date.now()
    }
  }

  componentDidMount() {
    /* this.timerId = window.setInterval(
      () => {
        this.setState({
          now: this.state.now + 1000 * 60 // * 60 * 30
        });
      }, 100); */
  }

  componentWillUnmount() {
    window.clearInterval(this.timerId);
  }

  len(v: number[] | mathjs.Matrix): number {
    return math.sqrt(math.dot(v, v));
  }

  normalize(v: number[] | mathjs.Matrix): number[] {
    return math.divide(v, this.len(v)) as number[];
  }

  raySphereIntersection(sphereRadius: number, rayStart: number[] | mathjs.Matrix, rayDirection: number[] | mathjs.Matrix): number[] {
    const a = math.dot(rayDirection, rayDirection); // Should be 1.
    const b = 2 * math.dot(rayStart, rayDirection);
    const c = math.dot(rayStart, rayStart) - sphereRadius * sphereRadius;

    const d = b * b - 4 * a * c;

    if (d < 0) {
      return null;
    } else if (d >= 0) {
      const t = (-b + math.sqrt(d)) / a / 2;
      const p = math.add(rayStart, math.multiply(rayDirection, t)) as number[];

      return p;
    }
  }

  rayEllipsoidIntersection(eqR: number, polarR: number, rayStart: number[] | mathjs.Matrix, rayDirection: number[] | mathjs.Matrix): number[] {
    const polarScale = eqR / polarR;
    const scale = [1, 1 , polarScale];
    const rayStartScaled = math.dotMultiply(rayStart, scale) as mathjs.Matrix;
    const rayDirectionScaled = math.dotMultiply(rayDirection, scale) as mathjs.Matrix;
    return this.raySphereIntersection(eqR, rayStartScaled, rayDirectionScaled);
  }

  xyzToSpherical(xyz: any): EquatorialCoordinate {
    const r = this.len(xyz);
    const dec = math.asin(xyz._data[2] / r);
    const ra = math.atan2(xyz._data[1], xyz._data[0]);
    return new EquatorialCoordinate(ra, dec, r);
  }

  render(): any {
    // Radius.
    const sunR = 695700; // in km.
    const moonR = 1737; // in km.
    const earthR = 6371; // Mean
    const earthPolarR = 6356.752;
    const earthEqR = 6378.137;

    // const fixedJde = 2457987.267766; // 18:25:35.0
    const fixedJde = 2457987.266667; // 18:24:00.0

    // From PyEphem. They are in Geocentic Equatorial space.
    // const sunGeocenticPos = [-129219042.12033698, 72251925.53185461, 31322144.954296015];
    // const moonGeocenticPos = [-317578.3699640539, 176801.90765448488, 79659.81420635643];
    const sunGeocenticPos = [-129543897.83845954, 71761895.41801041, 31106238.079610456]
    const moonGeocenticPos = [-318345.5914855474, 175643.69220487468, 79139.07074740899]

    // Find the shadow cone length and angle.
    const moonFromSunPos = math.subtract(moonGeocenticPos, sunGeocenticPos) as number[];
    const moonDistFromSun = this.len(moonFromSunPos) as number;
    const coneLength = moonDistFromSun * sunR / (sunR - moonR);
    const coneAngle = math.asin((sunR - moonR) / moonDistFromSun);

    // Sun-Moon space: Sun is at [0, 0, 0]. Moon is at [moonDistFromSun, 0, 0].
    // Construct the cone (vertex and directions) in the Sun-Moon space to exploit symmetry.
    const coneVertexSunMoonPos = [coneLength, 0, 0];
    const rayX = -math.cos(coneAngle); // Pointing from the vertex back to the Sun.
    const rayY = (sunR - moonR) / moonDistFromSun;
    const angles = [ degToRad(90), degToRad(45 + 22.5), degToRad(45), degToRad(22.5), degToRad(0) ]
    var coneSunMoonDirs: number[][] = [];
    angles.forEach(a => {
      coneSunMoonDirs.push([rayX, math.cos(a) * rayY, math.sin(a) * rayY]);
      coneSunMoonDirs.push([rayX, math.cos(a) * rayY, math.sin(a) * -rayY]);
      coneSunMoonDirs.push([rayX, math.cos(a) * -rayY, math.sin(a) * rayY]);
      coneSunMoonDirs.push([rayX, math.cos(a) * -rayY, math.sin(a) * -rayY]);
    });

    // Calculate the basis of the Sun-Moon space to transform the cone.
    const xAxisSunMoon = this.normalize(moonFromSunPos);
    // This will work as Earth's ecliptic plane will never be parallel to the Sun-Moon plane.
    const zAxisSunMoon = this.normalize(math.cross(xAxisSunMoon, [0, 0, 1]));
    const yAxisSunMoon = this.normalize(math.cross(zAxisSunMoon, xAxisSunMoon));

    // Construct the rotation matrix from basis.
    const sunMoonBasis = math.matrix([xAxisSunMoon, yAxisSunMoon, zAxisSunMoon]);

    // Now, transform the cone into Geocentic Equatorial space.
    const coneVertexGeocenticPos = math.add(sunGeocenticPos, math.multiply(coneVertexSunMoonPos, sunMoonBasis)) as number[];
    const coneGeocenticDirs = coneSunMoonDirs.map(d => this.normalize(math.multiply(d, sunMoonBasis)));

    // const shadowXyzs = coneGeocenticDirs.map(d => this.raySphereIntersection(earthR, coneVertexGeocenticPos, d));
    const shadowXyzs = coneGeocenticDirs.map(d => this.rayEllipsoidIntersection(earthEqR, earthPolarR, coneVertexGeocenticPos, d));
    const shadowEquatorialCoordinates = shadowXyzs.map(c => this.xyzToSpherical(c)).map(c => c.eciToECEF(fixedJde));
    const shadowLatLon = shadowEquatorialCoordinates.map(c => c.toLatLng());

    const nowJd = unixTimestampToJulianDate(this.state.now / 1000);
    const periodInJulianDay = 1.5;

    const sunTrack = calculateGroundTrack(this.sun, nowJd, periodInJulianDay, 64);
    const moonTrack = calculateGroundTrack(this.moon, nowJd, periodInJulianDay, 64);
    const nightOverlayCenter = {lat: -sunTrack.position.lat, lng: sunTrack.position.lng + 180};

    const shadowsMarkers = shadowLatLon.map(latLon => <MapMarker pos={latLon} />);

    return (
      <Map>
        <div className="info-box">{ new Date(this.state.now).toUTCString() }</div>
        { shadowsMarkers }
        <MapGroundTrack groundTrack={moonTrack} iconUrl="moon.png" iconSize={26} />
        <MapGroundTrack groundTrack={sunTrack} iconUrl="sun.png" iconSize={40} />
      </Map>
        // <MapCircle center={nightOverlayCenter} radius={6371e3 * Math.PI * 0.5}/>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));
