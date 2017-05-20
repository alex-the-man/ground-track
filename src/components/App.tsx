import * as React from "react";
import * as ReactDOM from "react-dom";

import { radToDeg, normalizeDegree } from "../astronomy/MathUtils";
import { j2000, unixTimestampToJulianDate } from "../astronomy/JulianUtils";
import CelestialObject from "../astronomy/CelestialObject";
import Sun from "../astronomy/Sun";
import Moon from "../astronomy/Moon";
import MapCircle from "./MapCircle";
import MapPolyline from "./MapPolyline";
import MapMarker from "./MapMarker";
import Map from "./Map";

import LatLngLiteral = google.maps.LatLngLiteral

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
    this.timerId = window.setInterval(
      () => {
        this.setState({
          now: this.state.now + 1000 * 60 // * 60 * 30
        });
      }, 100);
  }

  componentWillUnmount() {
    window.clearInterval(this.timerId);
  }

  render(): any {
    const nowJd = unixTimestampToJulianDate(this.state.now / 1000);
    const periodInJulianDay = 1.5;

    const sunTrack = calculateGroundTrack(this.sun, nowJd, periodInJulianDay, 64);
    const moonTrack = calculateGroundTrack(this.moon, nowJd, periodInJulianDay, 64);
    const nightOverlayCenter = {lat: -sunTrack.position.lat, lng: sunTrack.position.lng + 180};

    return (
      <Map>
        <div className="info-box">{ new Date(this.state.now).toUTCString() }</div>
        <MapCircle center={nightOverlayCenter} radius={6371e3 * Math.PI * 0.5}/>
        <MapGroundTrack groundTrack={moonTrack} iconUrl="moon.png" iconSize={26} />
        <MapGroundTrack groundTrack={sunTrack} iconUrl="sun.png" iconSize={40} />
      </Map>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));
