import { j2000jd } from './JulianUtils'
import { jdeHorner2, jdeHornerDeg1, jdeHornerDeg2, jdeHornerDeg3, jdeHornerDeg4 } from './Horner'
import { degToRad, normalizeEclipticLon, normalizeRadian } from './MathUtils'
import EclipticSphericalCoordinate from './EclipticSphericalCoordinate'

const sin = Math.sin, cos = Math.cos;

// Astronomical Algorithms, Second Edition page 338.
// Moon's mean longitude (47.1): L'
const l: (jde: number) => number =
  jdeHornerDeg4(218.3164477, 481267.88123421, -0.0015786, 1 / 538841, -1 / 65194000);
// Moon's mean elongation (47.2): D
const d: (jde: number) => number =
  jdeHornerDeg4(297.8501921, 445267.1114034, -0.0018819, 1 / 545868, -1 / 113065000);
// Sun's mean anomaly (47.3): M
const sunM: (jde: number) => number =
  jdeHornerDeg3(357.5291092, 35999.0502909, -0.0001536, 1 / 24490000);
// Moon's mean anomaly (47.4): M'
const m: (jde: number) => number =
  jdeHornerDeg4(134.9633964, 477198.8675055, 0.0087414, 1 / 69699, -1 / 14712000);
// Moon's argument of latitude (47.5): F
const f: (jde: number) => number =
  jdeHornerDeg4(93.2720950, 483202.0175233, -0.0036539, -1 / 3526000, 1 / 863310000);

const a1: (jde: number) => number = jdeHornerDeg1(119.75, 131.849);
const a2: (jde: number) => number = jdeHornerDeg1(53.09, 479264.290);
const a3: (jde: number) => number = jdeHornerDeg1(313.45, 481266.484);

// 47.6
const e: (jde: number) => number = jdeHorner2(1, -0.002516, -0.0000074);

// Earth's precession. http://www.stjarnhimlen.se/comp/ppcomp.html#8
const p0 =  degToRad(-3.82394E-5);
function p(jde: number): number {
  return p0 * j2000jd(jde);
}

// Table 47.A.
const moonLonDistTable = [
  [0, 0, 1, 0, 6288774, -20905355],
  [2, 0, -1, 0, 1274027, -3699111],
  [2, 0, 0, 0, 658314, -2955968],
  [0, 0, 2, 0, 213618, -569925],

  [0, 1, 0, 0, -185116, 48888],
  [0, 0, 0, 2, -114332, -3149],
  [2, 0, -2, 0, 58793, 246158],
  [2, -1, -1, 0, 57066, -152138],

  [2, 0, 1, 0, 53322, -170733],
  [2, -1, 0, 0, 45758, -204586],
  [0, 1, -1, 0, -40923, -129620],
  [1, 0, 0, 0, -34720, 108743],

  [0, 1, 1, 0, -30383, 104755],
  [2, 0, 0, -2, 15327, 10321],
  [0, 0, 1, 2, -12528, 0],
  [0, 0, 1, -2, 10980, 79661],

  [4, 0, -1, 0, 10675, -34782],
  [0, 0, 3, 0, 10034, -23210],
  [4, 0, -2, 0, 8548, -21636],
  [2, 1, -1, 0, -7888, 24208],

  [2, 1, 0, 0, -6766, 30824],
  [1, 0, -1, 0, -5163, -8379],
  [1, 1, 0, 0, 4987, -16675],
  [2, -1, 1, 0, 4036, -12831],

  [2, 0, 2, 0, 3994, -10445],
  [4, 0, 0, 0, 3861, -11650],
  [2, 0, -3, 0, 3665, 14403],
  [0, 1, -2, 0, -2689, -7003],

  [2, 0, -1, 2, -2602, 0],
  [2, -1, -2, 0, 2390, 10056],
  [1, 0, 1, 0, -2348, 6322],
  [2, -2, 0, 0, 2236, -9884],

  [0, 1, 2, 0, -2120, 5751],
  [0, 2, 0, 0, -2069, 0],
  [2, -2, -1, 0, 2048, -4950],
  [2, 0, 1, -2, -1773, 4130],

  [2, 0, 0, 2, -1595, 0],
  [4, -1, -1, 0, 1215, -3958],
  [0, 0, 2, 2, -1110, 0],
  [3, 0, -1, 0, -892, 3258],

  [2, 1, 1, 0, -810, 2616],
  [4, -1, -2, 0, 759, -1897],
  [0, 2, -1, 0, -713, -2117],
  [2, 2, -1, 0, -700, 2354],

  [2, 1, -2, 0, 691, 0],
  [2, -1, 0, -2, 596, 0],
  [4, 0, 1, 0, 549, -1423],
  [0, 0, 4, 0, 537, -1117],

  [4, -1, 0, 0, 520, -1571],
  [1, 0, -2, 0, -487, -1739],
  [2, 1, 0, -2, -399, 0],
  [0, 0, 2, -2, -381, -4421],

  [1, 1, 1, 0, 351, 0],
  [3, 0, -2, 0, -340, 0],
  [4, 0, -3, 0, 330, 0],
  [2, -1, 2, 0, 327, 0],

  [0, 2, 1, 0, -323, 1165],
  [1, 1, -1, 0, 299, 0],
  [2, 0, 3, 0, 294, 0],
  [2, 0, -1, -2, 0, 8752]
];

for (var i = 0; i < moonLonDistTable.length; ++i) {
  const row = moonLonDistTable[i];
  row[4] = degToRad(row[4]);
}

// Table 47.B.
const moonLatTable = [
	[0, 0, 0, 1, 5128122],
	[0, 0, 1, 1, 280602],
	[0, 0, 1, -1, 277693],
	[2, 0, 0, -1, 173237],

	[2, 0, -1, 1, 55413],
	[2, 0, -1, -1, 46271],
	[2, 0, 0, 1, 32573],
	[0, 0, 2, 1, 17198],

	[2, 0, 1, -1, 9266],
	[0, 0, 2, -1, 8822],
	[2, -1, 0, -1, 8216],
	[2, 0, -2, -1, 4324],

	[2, 0, 1, 1, 4200],
	[2, 1, 0, -1, -3359],
	[2, -1, -1, 1, 2463],
	[2, -1, 0, 1, 2211],

	[2, -1, -1, -1, 2065],
	[0, 1, -1, -1, -1870],
	[4, 0, -1, -1, 1828],
	[0, 1, 0, 1, -1794],

	[0, 0, 0, 3, -1749],
	[0, 1, -1, 1, -1565],
	[1, 0, 0, 1, -1491],
	[0, 1, 1, 1, -1475],

	[0, 1, 1, -1, -1410],
	[0, 1, 0, -1, -1344],
	[1, 0, 0, -1, -1335],
	[0, 0, 3, 1, 1107],

	[4, 0, 0, -1, 1021],
	[4, 0, -1, 1, 833],

	[0, 0, 1, -3, 777],
	[4, 0, -2, 1, 671],
	[2, 0, 0, -3, 607],
	[2, 0, 2, -1, 596],

	[2, -1, 1, -1, 491],
	[2, 0, -2, 1, -451],
	[0, 0, 3, -1, 439],
	[2, 0, 2, 1, 422],

	[2, 0, -3, -1, 421],
	[2, 1, -1, 1, -366],
	[2, 1, 0, 1, -351],
	[4, 0, 0, 1, 331],

	[2, -1, 1, 1, 315],
	[2, -2, 0, -1, 302],
	[0, 0, 1, 3, -283],
	[2, 1, 1, -1, -229],

	[1, 1, 0, -1, 223],
	[1, 1, 0, 1, 223],
	[0, 1, -2, -1, -220],
	[2, 1, -1, -1, -220],

	[1, 0, 1, 1, -185],
	[2, -1, -2, -1, 181],
	[0, 1, 2, 1, -177],
	[4, 0, -2, -1, 176],

	[4, -1, -1, -1, 166],
	[1, 0, 1, -1, -164],
	[4, 0, 1, -1, 132],
	[1, 0, -1, -1, -119],

	[4, -1, 0, -1, 115],
	[2, -2, 0, 1, 107]
];

for (var i = 0; i < moonLatTable.length; ++i) {
  const row = moonLatTable[i];
  row[4] = degToRad(row[4]);
}

// 47.6
function eFactor(m: number, e_: number): number {
  var eFactor = 1;
  switch(m) {
    case 2:
    case -2:
      eFactor *= e_;
    case 1:
    case -1:
      eFactor *= e_;
  }
  return eFactor;
}

// Coefficients of additive terms. Page 342.
const lonCoeff = [degToRad(3958), degToRad(1962), degToRad(318)];
const latCoeff = [degToRad(-2235), degToRad(382), degToRad(175), degToRad(175), degToRad(127), degToRad(-115)];

function periodicTerms(jde: number, l_: number): [number, number, number] {
  var lon = 0, lat = 0, r = 0;
  const m_ = m(jde);
  const f_ = f(jde);
  const e_ = e(jde);
  const dmmf = [d(jde), sunM(jde), m_, f_];

  for (var i = 0; i < moonLonDistTable.length; ++i) {
    const row = moonLonDistTable[i]; // row: [D. M, M', F]
    var arg = 0;
    for (var j = 0; j < 4; ++j) {
      arg += row[j] * dmmf[j];
    }
    const eFactor_ = eFactor(row[1], e_);
    lon += row[4] * eFactor_ * sin(arg);
    r += row[5] * eFactor_ * cos(arg);
  }

  for (var i = 0; i < moonLatTable.length; ++i) {
    const row = moonLatTable[i]; // row: [D, M, M', F]
    var arg = 0;
    for (var j = 0; j < 4; ++j) {
      arg += row[j] * dmmf[j];
    }
    lat += row[4] * eFactor(row[1], e_) * sin(arg);
  }

  // Additive terms. Page 342.
  const a1_ = a1(jde);
  const a2_ = a2(jde);
  const a3_ = a3(jde);

  lon += lonCoeff[0] * sin(a1_) + lonCoeff[1] * sin(l_ - f_) + lonCoeff[2] * sin(a2_);
  lat += latCoeff[0] * sin(l_) + latCoeff[1] * sin(a3_) +
    latCoeff[2] * sin(a1_ - f_) + latCoeff[3] * sin(a1_ + f_) +
    latCoeff[4] * sin(l_ - m_) + latCoeff[5] * sin(l_ + m_);

  return [lon * 1e-6, lat * 1e-6, r * 1e-3];
}

export default class Moon {
  // Return position in ECLIPJ2000.
  pos(jde: number): EclipticSphericalCoordinate {
    const l_ = l(jde);
    const terms = periodicTerms(jde, l_);
    const lon = l_ + terms[0] + p(jde); // Add precession to convert "equinox of date" to J2000 standard equinox.
    const lat = terms[1];
    const r = 385000.56 + terms[2];
    return new EclipticSphericalCoordinate(normalizeEclipticLon(lon), normalizeRadian(lat), r);
  }
}
