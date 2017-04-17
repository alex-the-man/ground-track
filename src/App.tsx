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

const App = () => {
  var moon = new Moon();

  var pastLine: Array<LatLngLiteral> = [];
  var futureLine: Array<LatLngLiteral> = [];
  var moonPos: LatLngLiteral = null;

  // var nowJd = JulianUtils.j2000;
  // var nowJd = 2457858.5; // 2457858.55833;// 2457858.55384;
  var nowJd = unixTimestampToJulianDate(Date.now() / 1000);

  for (var i = -12; i <= 12; i++) {
    var jd = i / 24 + nowJd;
    var gecPos = moon.pos(jd);
    var eciPos = gecPos.toECI();
    var ecefPos = eciPos.eciToECEF(jd);
    // TODO Project ECEF to WGS84.

    // console.log(jd, radToDeg(gecPos.lon) % 360, normalizeAngle(radToDeg(gecPos.lat)));
    var latLng = {
      lng: normalizeAngle(radToDeg(ecefPos.ra)), 
      lat: radToDeg(ecefPos.dec)
    };
    if (i == 0) {
      pastLine.push(latLng);
      futureLine.push(latLng);
      moonPos = latLng;
    } else if (i > 0) {
      futureLine.push(latLng);
    } else {
      pastLine.push(latLng);
    }
  }
  
  return (
    <Map>
      <MapPolyline latLngs={pastLine}/>
      <MapMarker pos={moonPos} title={moonPos.lat.toString() + ", " + moonPos.lng.toString()}/>
      <MapPolyline latLngs={futureLine} dashedLine={true}/>
    </Map>
  );
};

ReactDOM.render(<App/>, document.getElementById("app"));
