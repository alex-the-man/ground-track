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

class GroundTrack {
  pastLine: Array<LatLngLiteral> = [];
  futureLine: Array<LatLngLiteral> = [];
  moonPos: LatLngLiteral;
}

function calculateGroundTrack(moon: Moon, midpointJd: number, period: number, segments: number): GroundTrack {
  var midpoint = Math.floor(segments / 2);  
  var gt: GroundTrack = new GroundTrack();

  for (var i = 0; i <= segments; i++) {
    var jd = (i - midpoint) / segments * period + midpointJd;
    var gecPos = moon.pos(jd);
    var eciPos = gecPos.toECI();
    var ecefPos = eciPos.eciToECEF(jd);
    // TODO Project ECEF to WGS84.

    // console.log(jd, radToDeg(gecPos.lon) % 360, normalizeAngle(radToDeg(gecPos.lat)));
    var latLng = {
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

const App = () => {
  var moon = new Moon();

  // var nowJd = JulianUtils.j2000;
  // var nowJd = 2457858.5; // 2457858.55833;// 2457858.55384;
  var nowJd = unixTimestampToJulianDate(Date.now() / 1000);
  var period = 1; // A Julian day.
  var segments = 24; // A sample point per hour.

  var gt = calculateGroundTrack(moon, nowJd, period, segments);

  return (
    <Map>
      <MapPolyline latLngs={gt.pastLine}/>
      <MapMarker pos={gt.moonPos} title={gt.moonPos.lat.toString() + ", " + gt.moonPos.lng.toString()}/>
      <MapPolyline latLngs={gt.futureLine} dashedLine={true}/>
    </Map>
  );
};

ReactDOM.render(<App/>, document.getElementById("app"));
