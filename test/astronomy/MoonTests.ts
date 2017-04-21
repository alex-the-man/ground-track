import * as chai from "chai";

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

  it("should compute ra and dec in sufficient accruacy", () => {
    for (var i = 0; i < eclipticTestData.length; ++i) {
      const testEntry = eclipticTestData[i];
      const jd = unixTimestampToJulianDate(testEntry.timestamp);
      const p = moon.pos(jd);

      const datetimeInUTC = new Date(testEntry.timestamp * 1000).toUTCString();
      angleShouldBeCloseTo(p.lat, testEntry.lat, 0.08, "Lat is too inaccurate at " + datetimeInUTC);
      angleShouldBeCloseTo(p.lon, testEntry.lon, 0.08, "Lon is too inaccurate at " + datetimeInUTC);
    }
  });
});
