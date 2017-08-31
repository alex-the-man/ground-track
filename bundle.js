/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.j2000 = 2451545.0;
// Convert Julian Date to J2000 epoch Julian date 
function j2000jd(jd) {
    return jd - exports.j2000;
}
exports.j2000jd = j2000jd;
function unixTimestampToJulianDate(ts) {
    return ts / 86400 + 2440587.5;
}
exports.unixTimestampToJulianDate = unixTimestampToJulianDate;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function degToRad(d) {
    return d * Math.PI / 180.0;
}
exports.degToRad = degToRad;
function radToDeg(r) {
    return r * 180.0 / Math.PI;
}
exports.radToDeg = radToDeg;
function normalizeDegree(deg) {
    return deg % 360;
}
exports.normalizeDegree = normalizeDegree;
function normalizeGeoLon(deg) {
    deg = normalizeDegree(deg);
    if (deg > 180) {
        return deg - 360;
    }
    else if (deg < -180) {
        return deg + 360;
    }
    else {
        return deg;
    }
}
exports.normalizeGeoLon = normalizeGeoLon;
function normalizeRadian(rad) {
    return rad % (2 * Math.PI);
}
exports.normalizeRadian = normalizeRadian;
function normalizeEclipticLon(rad) {
    rad = normalizeRadian(rad);
    return (rad >= 0) ? rad : 2 * Math.PI + rad;
}
exports.normalizeEclipticLon = normalizeEclipticLon;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(15)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(14)();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */



var emptyFunction = __webpack_require__(5);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var MathUtils_1 = __webpack_require__(2);
var EquatorialCoordinate_1 = __webpack_require__(16);
var earthObliquity = MathUtils_1.degToRad(23.4397);
var EclipticSphericalCoordinate = (function () {
    function EclipticSphericalCoordinate(lon, lat, r) {
        this.lon = lon;
        this.lat = lat;
        this.r = r;
    }
    // Assume lon/lat/dist are geocentric.
    EclipticSphericalCoordinate.prototype.toECI = function () {
        var e = earthObliquity;
        var lon = this.lon, lat = this.lat;
        var ra = Math.atan2(Math.sin(lon) * Math.cos(e) - Math.tan(lat) * Math.sin(e), Math.cos(lon));
        var dec = Math.asin(Math.sin(lat) * Math.cos(e) + Math.cos(lat) * Math.sin(e) * Math.sin(lon));
        return new EquatorialCoordinate_1["default"](ra, dec, this.r);
    };
    return EclipticSphericalCoordinate;
}());
exports["default"] = EclipticSphericalCoordinate;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var JulianUtils_1 = __webpack_require__(1);
var MathUtils_1 = __webpack_require__(2);
// Horner's method to calculate polynomial.
function jcHorner(a0, a1, a2, a3, a4, jde) {
    var t = JulianUtils_1.j2000jd(jde) / 36525; // Convert Julian centuries to Julian day.
    return a0 + t * (a1 + t * (a2 + t * (a3 + t * a4)));
}
exports.jcHorner = jcHorner;
function jdeHorner2(a0, a1, a2) {
    return jcHorner.bind(this, a0, a1, a2, 0, 0);
}
exports.jdeHorner2 = jdeHorner2;
// Convert angles from degree to radian.
function jdeHornerDeg4(a0, a1, a2, a3, a4) {
    return jcHorner.bind(this, MathUtils_1.degToRad(a0), MathUtils_1.degToRad(a1), MathUtils_1.degToRad(a2), MathUtils_1.degToRad(a3), MathUtils_1.degToRad(a4));
}
exports.jdeHornerDeg4 = jdeHornerDeg4;
function jdeHornerDeg3(a0, a1, a2, a3) {
    return jdeHornerDeg4(a0, a1, a2, a3, 0);
}
exports.jdeHornerDeg3 = jdeHornerDeg3;
function jdeHornerDeg2(a0, a1, a2) {
    return jdeHornerDeg4(a0, a1, a2, 0, 0);
}
exports.jdeHornerDeg2 = jdeHornerDeg2;
function jdeHornerDeg1(a0, a1) {
    return jdeHornerDeg4(a0, a1, 0, 0, 0);
}
exports.jdeHornerDeg1 = jdeHornerDeg1;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = __webpack_require__(3);
var ReactDOM = __webpack_require__(11);
var JulianUtils_1 = __webpack_require__(1);
var Sun_1 = __webpack_require__(18);
var Moon_1 = __webpack_require__(17);
var MapCircle_1 = __webpack_require__(20);
var MapPolyline_1 = __webpack_require__(22);
var MapMarker_1 = __webpack_require__(21);
var Map_1 = __webpack_require__(19);
var GroundTrack = (function () {
    function GroundTrack() {
        this.pastLine = [];
        this.futureLine = [];
    }
    return GroundTrack;
}());
function calculateGroundTrack(object, midpointJd, periodInJulianDay, numSamples) {
    var midpoint = Math.floor(numSamples / 2);
    var track = new GroundTrack();
    for (var i = 0; i <= numSamples; i++) {
        var jd = (i - midpoint) / numSamples * periodInJulianDay + midpointJd;
        var gecPos = object.pos(jd);
        var eciPos = gecPos.toECI();
        var ecefPos = eciPos.eciToECEF(jd);
        var latLng = ecefPos.ecefToWGS84();
        if (i == midpoint) {
            track.pastLine.push(latLng);
            track.futureLine.push(latLng);
            track.position = latLng;
        }
        else if (i > midpoint) {
            track.futureLine.push(latLng);
        }
        else {
            track.pastLine.push(latLng);
        }
    }
    return track;
}
var MapGroundTrackProps = (function () {
    function MapGroundTrackProps() {
    }
    return MapGroundTrackProps;
}());
var MapGroundTrack = (function (_super) {
    __extends(MapGroundTrack, _super);
    function MapGroundTrack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapGroundTrack.prototype.render = function () {
        var track = this.props.groundTrack;
        var iconUrl = this.props.iconUrl;
        var iconSize = this.props.iconSize;
        return (React.createElement("div", null,
            React.createElement(MapPolyline_1["default"], { latLngs: track.pastLine, color: "#AAA", opacity: 0.9 }),
            React.createElement(MapMarker_1["default"], { pos: track.position, iconUrl: iconUrl, iconSize: iconSize }),
            React.createElement(MapPolyline_1["default"], { latLngs: track.futureLine, opacity: 0.9 })));
    };
    return MapGroundTrack;
}(React.Component));
var App = (function (_super) {
    __extends(App, _super);
    function App(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.moon = new Moon_1["default"]();
        _this.sun = new Sun_1["default"]();
        _this.timerId = -1;
        _this.state = {
            now: Date.now()
        };
        return _this;
    }
    App.prototype.componentDidMount = function () {
        var _this = this;
        this.timerId = window.setInterval(function () {
            _this.setState({
                now: _this.state.now + 1000 * 60 // * 60 * 30
            });
        }, 100);
    };
    App.prototype.componentWillUnmount = function () {
        window.clearInterval(this.timerId);
    };
    App.prototype.render = function () {
        var nowJd = JulianUtils_1.unixTimestampToJulianDate(this.state.now / 1000);
        var periodInJulianDay = 1.5;
        var sunTrack = calculateGroundTrack(this.sun, nowJd, periodInJulianDay, 64);
        var moonTrack = calculateGroundTrack(this.moon, nowJd, periodInJulianDay, 64);
        var nightOverlayCenter = { lat: -sunTrack.position.lat, lng: sunTrack.position.lng + 180 };
        return (React.createElement(Map_1["default"], null,
            React.createElement("div", { className: "info-box" }, new Date(this.state.now).toUTCString()),
            React.createElement(MapCircle_1["default"], { center: nightOverlayCenter, radius: 6371e3 * Math.PI * 0.5 }),
            React.createElement(MapGroundTrack, { groundTrack: moonTrack, iconUrl: "moon.png", iconSize: 26 }),
            React.createElement(MapGroundTrack, { groundTrack: sunTrack, iconUrl: "sun.png", iconSize: 40 })));
    };
    return App;
}(React.Component));
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



if (process.env.NODE_ENV !== 'production') {
  var invariant = __webpack_require__(6);
  var warning = __webpack_require__(8);
  var ReactPropTypesSecret = __webpack_require__(7);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var emptyFunction = __webpack_require__(5);
var invariant = __webpack_require__(6);
var ReactPropTypesSecret = __webpack_require__(7);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var emptyFunction = __webpack_require__(5);
var invariant = __webpack_require__(6);
var warning = __webpack_require__(8);

var ReactPropTypesSecret = __webpack_require__(7);
var checkPropTypes = __webpack_require__(13);

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var MathUtils_1 = __webpack_require__(2);
var JulianUtils_1 = __webpack_require__(1);
var earthFlatteningFactor = 1 / 298.257223563; // WGS84
// Return time, not angle.
function greenwichSideralTime(jde) {
    return 18.697374558 + 24.06570982441908 * JulianUtils_1.j2000jd(jde);
}
var EquatorialCoordinate = (function () {
    function EquatorialCoordinate(ra, dec, r) {
        this.ra = ra;
        this.dec = dec;
        this.r = r;
    }
    // Assume current ra & dec are in ECI.
    EquatorialCoordinate.prototype.eciToECEF = function (jde) {
        var ra = this.ra - MathUtils_1.degToRad(greenwichSideralTime(jde) * 15);
        return new EquatorialCoordinate(ra, this.dec, this.r);
    };
    EquatorialCoordinate.prototype.ecefToWGS84 = function () {
        var flatteningRatio = (1 - earthFlatteningFactor);
        var lat = Math.atan2(Math.tan(this.dec) / flatteningRatio / flatteningRatio, Math.cos(this.dec));
        return {
            lat: MathUtils_1.normalizeDegree(MathUtils_1.radToDeg(lat)),
            lng: MathUtils_1.normalizeGeoLon(MathUtils_1.radToDeg(this.ra))
        };
    };
    return EquatorialCoordinate;
}());
exports["default"] = EquatorialCoordinate;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var JulianUtils_1 = __webpack_require__(1);
var Horner_1 = __webpack_require__(10);
var MathUtils_1 = __webpack_require__(2);
var EclipticSphericalCoordinate_1 = __webpack_require__(9);
var sin = Math.sin, cos = Math.cos;
// Astronomical Algorithms, Second Edition page 338.
// Moon's mean longitude (47.1): L'
var l = Horner_1.jdeHornerDeg4(218.3164477, 481267.88123421, -0.0015786, 1 / 538841, -1 / 65194000);
// Moon's mean elongation (47.2): D
var d = Horner_1.jdeHornerDeg4(297.8501921, 445267.1114034, -0.0018819, 1 / 545868, -1 / 113065000);
// Sun's mean anomaly (47.3): M
var sunM = Horner_1.jdeHornerDeg3(357.5291092, 35999.0502909, -0.0001536, 1 / 24490000);
// Moon's mean anomaly (47.4): M'
var m = Horner_1.jdeHornerDeg4(134.9633964, 477198.8675055, 0.0087414, 1 / 69699, -1 / 14712000);
// Moon's argument of latitude (47.5): F
var f = Horner_1.jdeHornerDeg4(93.2720950, 483202.0175233, -0.0036539, -1 / 3526000, 1 / 863310000);
var a1 = Horner_1.jdeHornerDeg1(119.75, 131.849);
var a2 = Horner_1.jdeHornerDeg1(53.09, 479264.290);
var a3 = Horner_1.jdeHornerDeg1(313.45, 481266.484);
// 47.6
var e = Horner_1.jdeHorner2(1, -0.002516, -0.0000074);
// Earth's precession. http://www.stjarnhimlen.se/comp/ppcomp.html#8
var p0 = MathUtils_1.degToRad(-3.82394E-5);
function p(jde) {
    return p0 * JulianUtils_1.j2000jd(jde);
}
// Table 47.A.
var moonLonDistTable = [
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
    var row = moonLonDistTable[i];
    row[4] = MathUtils_1.degToRad(row[4]);
}
// Table 47.B.
var moonLatTable = [
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
    var row = moonLatTable[i];
    row[4] = MathUtils_1.degToRad(row[4]);
}
// 47.6
function eFactor(m, e_) {
    var eFactor = 1;
    switch (m) {
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
var lonCoeff = [MathUtils_1.degToRad(3958), MathUtils_1.degToRad(1962), MathUtils_1.degToRad(318)];
var latCoeff = [MathUtils_1.degToRad(-2235), MathUtils_1.degToRad(382), MathUtils_1.degToRad(175), MathUtils_1.degToRad(175), MathUtils_1.degToRad(127), MathUtils_1.degToRad(-115)];
function periodicTerms(jde, l_) {
    var lon = 0, lat = 0, r = 0;
    var m_ = m(jde);
    var f_ = f(jde);
    var e_ = e(jde);
    var dmmf = [d(jde), sunM(jde), m_, f_];
    for (var i = 0; i < moonLonDistTable.length; ++i) {
        var row = moonLonDistTable[i]; // row: [D. M, M', F]
        var arg = 0;
        for (var j = 0; j < 4; ++j) {
            arg += row[j] * dmmf[j];
        }
        var eFactor_ = eFactor(row[1], e_);
        lon += row[4] * eFactor_ * sin(arg);
        r += row[5] * eFactor_ * cos(arg);
    }
    for (var i = 0; i < moonLatTable.length; ++i) {
        var row = moonLatTable[i]; // row: [D, M, M', F]
        var arg = 0;
        for (var j = 0; j < 4; ++j) {
            arg += row[j] * dmmf[j];
        }
        lat += row[4] * eFactor(row[1], e_) * sin(arg);
    }
    // Additive terms. Page 342.
    var a1_ = a1(jde);
    var a2_ = a2(jde);
    var a3_ = a3(jde);
    lon += lonCoeff[0] * sin(a1_) + lonCoeff[1] * sin(l_ - f_) + lonCoeff[2] * sin(a2_);
    lat += latCoeff[0] * sin(l_) + latCoeff[1] * sin(a3_) +
        latCoeff[2] * sin(a1_ - f_) + latCoeff[3] * sin(a1_ + f_) +
        latCoeff[4] * sin(l_ - m_) + latCoeff[5] * sin(l_ + m_);
    return [lon * 1e-6, lat * 1e-6, r * 1e-3];
}
var Moon = (function () {
    function Moon() {
    }
    // Return position in ECLIPJ2000.
    Moon.prototype.pos = function (jde) {
        var l_ = l(jde);
        var terms = periodicTerms(jde, l_);
        var lon = l_ + terms[0] + p(jde); // Add precession to convert "equinox of date" to J2000 standard equinox.
        var lat = terms[1];
        var r = 385000.56 + terms[2]; // In km
        return new EclipticSphericalCoordinate_1["default"](MathUtils_1.normalizeEclipticLon(lon), MathUtils_1.normalizeRadian(lat), r);
    };
    return Moon;
}());
exports["default"] = Moon;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var JulianUtils_1 = __webpack_require__(1);
var Horner_1 = __webpack_require__(10);
var MathUtils_1 = __webpack_require__(2);
var EclipticSphericalCoordinate_1 = __webpack_require__(9);
var cos = Math.cos;
var sin = Math.sin;
// Astronomical Algorithms, Second Edition page 163.
// Sun's mean longitude (25.2): L0
var l = Horner_1.jdeHornerDeg2(280.46646, 36000.76983, 0.0003032);
// Sun's mean anomaly (25.3): M
var m = Horner_1.jdeHornerDeg2(357.52911, 35999.05029, -0.0001537);
// Eccentricity of Earth (25.4): e
var e = Horner_1.jdeHorner2(0.016708634, -0.000042037, -0.0000001267);
// Sun's equation of center: C
var c0 = Horner_1.jdeHornerDeg2(1.914602, -0.004817, -0.000014);
var c1 = Horner_1.jdeHornerDeg1(0.019993, -0.000101);
var c2term = MathUtils_1.degToRad(0.000289);
function c(jde, m_) {
    return c0(jde) * sin(m_) + c1(jde) * sin(2 * m_) + c2term * sin(3 * m_);
}
var precessionRate = MathUtils_1.degToRad(-0.01397) / 365.25;
function p(jde) {
    return precessionRate * JulianUtils_1.j2000jd(jde);
}
var lon0 = MathUtils_1.degToRad(-0.00569);
var lon1 = MathUtils_1.degToRad(-0.00478);
var lonOfAscNode = Horner_1.jdeHornerDeg1(125.04, -1934.136);
var Sun = (function () {
    function Sun() {
    }
    // Return position in ECLIPJ2000.
    Sun.prototype.pos = function (jde) {
        var m_ = m(jde);
        var c_ = c(jde, m_);
        var trueLon = l(jde) + c_ + p(jde); // True longitude
        var lon = trueLon - lon0 - lon1 * sin(lonOfAscNode(jde));
        var v = m_ + c_; // True anomaly
        var e_ = e(jde);
        var rAU = 1.000001018 * (1 - e_ * e_) / (1 + e_ * cos(v)); // Sun's radius vector (25.5)
        var rKM = rAU * 149598e3;
        return new EclipticSphericalCoordinate_1["default"](MathUtils_1.normalizeEclipticLon(lon), 0, rKM);
    };
    return Sun;
}());
exports["default"] = Sun;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = __webpack_require__(3);
var ReactDOM = __webpack_require__(11);
// Can't do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
var PropTypes = __webpack_require__(4);
var GMap = google.maps;
var Map = (function (_super) {
    __extends(Map, _super);
    function Map(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            map: null
        };
        return _this;
    }
    Map.prototype.componentDidMount = function () {
        var mapOptions = {
            center: new GMap.LatLng(0, 0),
            zoom: 2
        };
        this.setState({
            map: new GMap.Map(ReactDOM.findDOMNode(this.refs.mapContainer), mapOptions)
        });
    };
    Map.prototype.componentWillUnmount = function () {
        console.warn("componentWillUnmount() on <Map> is not supported.");
    };
    Map.prototype.getChildContext = function () {
        return {
            map: this.state.map
        };
    };
    Map.prototype.render = function () {
        return (React.createElement("div", { ref: "mapContainer", style: { height: "100%" } }, this.state.map != null ? this.props.children : null));
    };
    Map.childContextTypes = {
        map: PropTypes.any
    };
    return Map;
}(React.Component));
exports["default"] = Map;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = __webpack_require__(3);
// Can't do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
var PropTypes = __webpack_require__(4);
var GMap = google.maps;
var MapCircle = (function (_super) {
    __extends(MapCircle, _super);
    function MapCircle(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            circle: null
        };
        return _this;
    }
    MapCircle.prototype.componentDidMount = function () {
        var circle = new GMap.Circle({
            clickable: false,
            editable: false,
            fillColor: "#000",
            fillOpacity: 0.4,
            map: this.context.map,
            radius: this.props.radius,
            strokeOpacity: 0
        });
        this.setState({
            circle: circle
        });
    };
    MapCircle.prototype.componentWillUnmount = function () {
        this.state.circle.setMap(null);
    };
    MapCircle.prototype.render = function () {
        if (this.state.circle) {
            this.state.circle.setOptions({
                center: this.props.center
            });
        }
        return null;
    };
    MapCircle.contextTypes = {
        map: PropTypes.any
    };
    return MapCircle;
}(React.Component));
exports["default"] = MapCircle;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = __webpack_require__(3);
// Can't do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
var PropTypes = __webpack_require__(4);
var GMap = google.maps;
var MapMarker = (function (_super) {
    __extends(MapMarker, _super);
    function MapMarker(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            marker: null
        };
        return _this;
    }
    MapMarker.prototype.componentDidMount = function () {
        var marker = new GMap.Marker();
        marker.setMap(this.context.map);
        this.setState({
            marker: marker
        });
    };
    MapMarker.prototype.componentWillUnmount = function () {
        this.state.marker.setMap(null);
    };
    MapMarker.prototype.render = function () {
        if (this.state.marker) {
            var iconSize = this.props.iconSize;
            this.state.marker.setOptions({
                position: this.props.pos,
                title: this.props.title,
                icon: {
                    anchor: iconSize ? new GMap.Point(iconSize / 2, iconSize / 2) : null,
                    scaledSize: iconSize ? new GMap.Size(iconSize, iconSize) : null,
                    url: this.props.iconUrl
                }
            });
        }
        return null;
    };
    MapMarker.contextTypes = {
        map: PropTypes.any
    };
    return MapMarker;
}(React.Component));
exports["default"] = MapMarker;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = __webpack_require__(3);
// Can't do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
var PropTypes = __webpack_require__(4);
var GMap = google.maps;
var MapPolyline = (function (_super) {
    __extends(MapPolyline, _super);
    function MapPolyline(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            polyline: null
        };
        return _this;
    }
    MapPolyline.prototype.componentDidMount = function () {
        this.setState({
            polyline: new GMap.Polyline({
                map: this.context.map
            })
        });
    };
    MapPolyline.prototype.componentWillUnmount = function () {
        this.state.polyline.setMap(null);
    };
    MapPolyline.prototype.render = function () {
        if (this.state.polyline) {
            var polylineOptions = {
                path: this.props.latLngs,
                strokeColor: this.props.color,
                strokeOpacity: this.props.opacity
            };
            this.state.polyline.setOptions(polylineOptions);
        }
        return null;
    };
    MapPolyline.contextTypes = {
        map: PropTypes.any
    };
    MapPolyline.defaultProps = {
        color: "#FFF",
        opacity: 1
    };
    MapPolyline.propTypes = {
        color: PropTypes.string,
        latLngs: PropTypes.any.isRequired,
        opacity: PropTypes.number
    };
    return MapPolyline;
}(React.Component));
exports["default"] = MapPolyline;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ })
/******/ ]);