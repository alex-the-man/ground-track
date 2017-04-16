require("file-loader?name=[name].[ext]!./index.html")

import * as React from "react";
import * as ReactDOM from "react-dom";

import { j2000, unixTimestampToJulianDate } from "./JulianUtils";
import { radToDeg, normalizeAngle } from "./MathUtils";
import Map from "./Map";
import Moon from "./Moon";

import LatLngLiteral = google.maps.LatLngLiteral

const App = () => {
  var text = [];
  var moon = new Moon();
  var line: Array<LatLngLiteral> = [];

  for (var i = 0; i <= 24; i++) {
    //var jd = i / 24 + JulianUtils.j2000 + 7;
    //var jd = i / 24 + 2457858.5; // 2457858.55833;// 2457858.55384;
    var jd = i / 24 + unixTimestampToJulianDate(Date.now() / 1000);
    var gecPos = moon.pos(jd);
    var eciPos = gecPos.toECI();
    var ecefPos = eciPos.eciToECEF(jd);

    // console.log(jd, radToDeg(gecPos.lon) % 360, normalizeAngle(radToDeg(gecPos.lat)));
    line.push({
      lng: normalizeAngle(radToDeg(ecefPos.ra)), 
      lat: radToDeg(ecefPos.dec)
    });
  }
  
  return <Map lines={[line]}/>;
};

ReactDOM.render(<App/>, document.getElementById("app"));
