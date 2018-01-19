/*!
 * --- Compiled in Developer Mode ---
 * 
 * Beaconing Teacher UI
 * ------------
 * Authors:
 * Elliott Judd <elliott.judd@hands-free.co.uk>
 */
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./core/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./core/beaconing.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BeaconingCore = function BeaconingCore() {
    _classCallCheck(this, BeaconingCore);

    this.test = 'Loaded!';

    console.log('[Beaconing Core] ' + this.test);
};

exports.default = BeaconingCore;

/***/ }),

/***/ "./core/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("./scss/index.js");

var _beaconing = __webpack_require__("./core/beaconing.js");

var _beaconing2 = _interopRequireDefault(_beaconing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const rollbar = new Rollbar(rollbarConfig);


// Rollbar - only use when needed
// import Rollbar from 'rollbar';
// import rollbarConfig from '../config/rollbar.config.json';

// scss
var beaconing = new _beaconing2.default();

// Beaconing

var accessabar = new window.Accessabar();

window.beaconingCore = beaconing;
window.abarRuntime = accessabar; // temporary

/***/ }),

/***/ "./scss/app.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./scss/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("./scss/app.scss");

/***/ })

/******/ });
//# sourceMappingURL=core.js.map