import * as chai from "chai";

import { j2000jd } from "../../src/astronomy/JulianUtils"
import { degToRad, radToDeg } from "../../src/astronomy/MathUtils"

import { unixTimestampToJulianDate } from "../../src/astronomy/JulianUtils"
import Moon from "../../src/astronomy/Moon"

chai.should();

function angleShouldBeCloseTo(actualRadian: number, expectedRadian: number, e: number, errorMessage: string): void {
  if (actualRadian < e / 2 && Math.abs(expectedRadian - 2 * Math.PI) < e / 2) {
    (actualRadian + 2 * Math.PI).should.be.closeTo(expectedRadian, e, errorMessage);
  } else if (expectedRadian < e / 2 && Math.abs(actualRadian - 2 * Math.PI) < e / 2) {
    actualRadian.should.be.closeTo(expectedRadian + 2 * Math.PI, e, errorMessage);
  } else {
    actualRadian.should.be.closeTo(expectedRadian, e, errorMessage);
  }
}

describe("Moon", () => {
  const moon = new Moon();
  const eclipticTestData = require("./MoonPosition.json")

  it("should match example 47.a on page 342", () => {
    const jde = 2448724.5;
    const p = moon.pos(jde); // 1992 April 12 0h TD.
    // The book doesn't account of precession.
    const precession = 3.82394E-5 * -j2000jd(jde);
    radToDeg(p.lon).should.be.closeTo(133.162655 + precession, 5e-7);
    radToDeg(p.lat).should.be.closeTo(-3.229126, 5e-7);
    p.r.should.be.closeTo(368409.7, 0.05);
  });

  it("should compute ra and dec in sufficient accruacy", () => {
    var lonMaxError = 0, latMaxError = 0;
    var lonStdDev = 0, latStdDev = 0;
    for (var i = 0; i < eclipticTestData.length; ++i) {
      const testEntry = eclipticTestData[i];
      const jd = unixTimestampToJulianDate(testEntry.timestamp);
      const p = moon.pos(jd);

      const datetimeInUTC = new Date(testEntry.timestamp * 1000).toUTCString();
      const lonError = Math.abs(p.lon - testEntry.lon);
      const latError = Math.abs(p.lat - testEntry.lat);
      lonMaxError = Math.max(lonMaxError, lonError);
      latMaxError = Math.max(latMaxError, latError);
      lonStdDev += lonError * lonError;
      latStdDev += latError * latError;
      angleShouldBeCloseTo(p.lon, testEntry.lon, 1e-1, "Lon is too inaccurate at " + datetimeInUTC);
      angleShouldBeCloseTo(p.lat, testEntry.lat, 1e-3, "Lat is too inaccurate at " + datetimeInUTC);
    }
    lonStdDev = Math.sqrt(lonStdDev / eclipticTestData.length);
    latStdDev = Math.sqrt(latStdDev / eclipticTestData.length);
    console.log("Max error in Lon: ", radToDeg(lonMaxError) + "°", "σ=" + radToDeg(lonStdDev) + "°",
      "Lat: ", radToDeg(latMaxError) + "°", "σ=" + radToDeg(latStdDev) + "°");
  });
});
