require("file-loader?name=[name].[ext]!./index.html")

import * as React from "react";
import * as ReactDOM from "react-dom";

import { radToDeg, normalizeAngle } from "./MathUtils";
import { j2000, unixTimestampToJulianDate } from "./JulianUtils";
import Moon from "./Moon";
import Map from "./Map";
import MapPolyline from "./MapPolyline";
import MapMarker from "./MapMarker";

import LatLngLiteral = google.maps.LatLngLiteral

const moonIconUrl = require("../assets/moon.png");

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
    // TODO Project ECEF to WGS84.

    // console.log(jd, radToDeg(gecPos.lon) % 360, normalizeAngle(radToDeg(gecPos.lat)));
    const latLng = {
      lng: normalizeAngle(radToDeg(ecefPos.ra)), 
      lat: radToDeg(ecefPos.dec)
    };
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
    // var nowJd = JulianUtils.j2000;
    // var nowJd = 2457858.5; // 2457858.55833;// 2457858.55384;
    const nowJd = unixTimestampToJulianDate(this.state.now / 1000);
    const periodInJulianDay = 2;

    const gt = calculateGroundTrack(this.moon, nowJd, periodInJulianDay, 180);

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
        <MapMarker pos={gt.moonPos} title={gt.moonPos.lat.toString() + ", " + gt.moonPos.lng.toString()} iconUrl={moonIconUrl} iconSize={40} />
        <MapPolyline latLngs={gt.futureLine} opacity={0.9}/>
      </Map>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));
