import * as React from "react";
import * as ReactDOM from "react-dom";

import { radToDeg, normalizeDegree } from "../astronomy/MathUtils";
import { j2000, unixTimestampToJulianDate } from "../astronomy/JulianUtils";
import Moon from "../astronomy/Moon";
import MapPolyline from "./MapPolyline";
import MapMarker from "./MapMarker";
import Map from "./Map";

import LatLngLiteral = google.maps.LatLngLiteral

class GroundTrack {
  pastLine: Array<LatLngLiteral> = [];
  futureLine: Array<LatLngLiteral> = [];
  moonPos: LatLngLiteral;
}

function calculateGroundTrack(moon: Moon, midpointJd: number, periodInJulianDay: number, numSamples: number): GroundTrack {
  const midpoint = Math.floor(numSamples / 2);
  const gt: GroundTrack = new GroundTrack();

  for (var i = 0; i <= numSamples; i++) {
    const jd = (i - midpoint) / numSamples * periodInJulianDay + midpointJd;
    const gecPos = moon.pos(jd);
    const eciPos = gecPos.toECI();
    const ecefPos = eciPos.eciToECEF(jd);
    const latLng = ecefPos.ecefToWGS84();

    if (i == midpoint) {
      gt.pastLine.push(latLng);
      gt.futureLine.push(latLng);
      gt.moonPos = latLng;
    } else if (i > midpoint) {
      gt.futureLine.push(latLng);
    } else {
      gt.pastLine.push(latLng);
    }
  }

  return gt;
}

interface AppState {
  now: number
}

class App extends React.Component<undefined, AppState> {
  private moon = new Moon();
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
          now: this.state.now + 1000 * 60 // * 60
        });
      }, 100);
  }

  componentWillUnmount() {
    window.clearInterval(this.timerId);
  }

  render(): any {
    const nowJd = unixTimestampToJulianDate(this.state.now / 1000);
    const periodInJulianDay = 1.5;

    const gt = calculateGroundTrack(this.moon, nowJd, periodInJulianDay, 64);

    const infoBoxStyle: React.CSSProperties = {
      background: "#CCC",
      opacity: 0.7,
      padding: "1px",
      position: "absolute",
      right: "0px",
      top: "0px",
      zIndex: 10
    };

    return (
      <Map>
        <div style={infoBoxStyle}>{ new Date(this.state.now).toUTCString() }</div>
        <MapPolyline latLngs={gt.pastLine} color="#AAA" opacity={0.9}/>
        <MapMarker pos={gt.moonPos} title={gt.moonPos.lat.toString() + ", " + gt.moonPos.lng.toString()} iconUrl="moon.png" iconSize={40} />
        <MapPolyline latLngs={gt.futureLine} opacity={0.9}/>
      </Map>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));
