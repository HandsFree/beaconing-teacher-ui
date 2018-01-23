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
/******/ 	return __webpack_require__(__webpack_require__.s = "./modules/home/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/babel-runtime/regenerator/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__("../node_modules/regenerator-runtime/runtime-module.js");

/***/ }),

/***/ "../node_modules/browser-split/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = function split(undef) {

  var nativeSplit = String.prototype.split,
      compliantExecNpcg = /()??/.exec("")[1] === undef,

  // NPCG: nonparticipating capturing group
  self;

  self = function self(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
        flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + ( // Proposed for ES6
    separator.sticky ? "y" : ""),

    // Firefox 3+
    lastLastIndex = 0,

    // Make `global` and avoid `lastIndex` issues by working with a copy
    separator = new RegExp(separator.source, flags + "g"),
        separator2,
        match,
        lastIndex,
        lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function () {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
}();

/***/ }),

/***/ "../node_modules/class-list/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// contains, add, remove, toggle
var indexof = __webpack_require__("../node_modules/indexof/index.js");

module.exports = ClassList;

function ClassList(elem) {
    var cl = elem.classList;

    if (cl) {
        return cl;
    }

    var classList = {
        add: add,
        remove: remove,
        contains: contains,
        toggle: toggle,
        toString: $toString,
        length: 0,
        item: item
    };

    return classList;

    function add(token) {
        var list = getTokens();
        if (indexof(list, token) > -1) {
            return;
        }
        list.push(token);
        setTokens(list);
    }

    function remove(token) {
        var list = getTokens(),
            index = indexof(list, token);

        if (index === -1) {
            return;
        }

        list.splice(index, 1);
        setTokens(list);
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1;
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token);
            return false;
        } else {
            add(token);
            return true;
        }
    }

    function $toString() {
        return elem.className;
    }

    function item(index) {
        var tokens = getTokens();
        return tokens[index] || null;
    }

    function getTokens() {
        var className = elem.className;

        return filter(className.split(" "), isTruthy);
    }

    function setTokens(list) {
        var length = list.length;

        elem.className = list.join(" ");
        classList.length = length;

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i];
        }

        delete list[length];
    }
}

function filter(arr, fn) {
    var ret = [];
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i]);
    }
    return ret;
}

function isTruthy(value) {
    return !!value;
}

/***/ }),

/***/ "../node_modules/hyperscript-helpers/dist/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});
var isValidString = function isValidString(param) {
  return typeof param === 'string' && param.length > 0;
};

var startsWith = function startsWith(string, start) {
  return string[0] === start;
};

var isSelector = function isSelector(param) {
  return isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'));
};

var node = function node(h) {
  return function (tagName) {
    return function (first) {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      if (isSelector(first)) {
        return h.apply(undefined, [tagName + first].concat(rest));
      } else if (typeof first === 'undefined') {
        return h(tagName);
      } else {
        return h.apply(undefined, [tagName, first].concat(rest));
      }
    };
  };
};

var TAG_NAMES = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'math', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rb', 'rbc', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'];

exports['default'] = function (h) {
  var createTag = node(h);
  var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTag: createTag };
  TAG_NAMES.forEach(function (n) {
    exported[n] = createTag(n);
  });
  return exported;
};

module.exports = exports['default'];

/***/ }),

/***/ "../node_modules/hyperscript/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var split = __webpack_require__("../node_modules/browser-split/index.js");
var ClassList = __webpack_require__("../node_modules/class-list/index.js");

var w = typeof window === 'undefined' ? __webpack_require__(0) : window;
var document = w.document;
var Text = w.Text;

function context() {

  var cleanupFuncs = [];

  function h() {
    var args = [].slice.call(arguments),
        e = null;
    function item(l) {
      var r;
      function parseClass(string) {
        // Our minimal parser doesn’t understand escaping CSS special
        // characters like `#`. Don’t use them. More reading:
        // https://mathiasbynens.be/notes/css-escapes .

        var m = split(string, /([\.#]?[^\s#.]+)/);
        if (/^\.|#/.test(m[1])) e = document.createElement('div');
        forEach(m, function (v) {
          var s = v.substring(1, v.length);
          if (!v) return;
          if (!e) e = document.createElement(v);else if (v[0] === '.') ClassList(e).add(s);else if (v[0] === '#') e.setAttribute('id', s);
        });
      }

      if (l == null) ;else if ('string' === typeof l) {
        if (!e) parseClass(l);else e.appendChild(r = document.createTextNode(l));
      } else if ('number' === typeof l || 'boolean' === typeof l || l instanceof Date || l instanceof RegExp) {
        e.appendChild(r = document.createTextNode(l.toString()));
      }
      //there might be a better way to handle this...
      else if (isArray(l)) forEach(l, item);else if (isNode(l)) e.appendChild(r = l);else if (l instanceof Text) e.appendChild(r = l);else if ('object' === (typeof l === 'undefined' ? 'undefined' : _typeof(l))) {
          for (var k in l) {
            if ('function' === typeof l[k]) {
              if (/^on\w+/.test(k)) {
                (function (k, l) {
                  // capture k, l in the closure
                  if (e.addEventListener) {
                    e.addEventListener(k.substring(2), l[k], false);
                    cleanupFuncs.push(function () {
                      e.removeEventListener(k.substring(2), l[k], false);
                    });
                  } else {
                    e.attachEvent(k, l[k]);
                    cleanupFuncs.push(function () {
                      e.detachEvent(k, l[k]);
                    });
                  }
                })(k, l);
              } else {
                // observable
                e[k] = l[k]();
                cleanupFuncs.push(l[k](function (v) {
                  e[k] = v;
                }));
              }
            } else if (k === 'style') {
              if ('string' === typeof l[k]) {
                e.style.cssText = l[k];
              } else {
                for (var s in l[k]) {
                  (function (s, v) {
                    if ('function' === typeof v) {
                      // observable
                      e.style.setProperty(s, v());
                      cleanupFuncs.push(v(function (val) {
                        e.style.setProperty(s, val);
                      }));
                    } else var match = l[k][s].match(/(.*)\W+!important\W*$/);
                    if (match) {
                      e.style.setProperty(s, match[1], 'important');
                    } else {
                      e.style.setProperty(s, l[k][s]);
                    }
                  })(s, l[k][s]);
                }
              }
            } else if (k === 'attrs') {
              for (var v in l[k]) {
                e.setAttribute(v, l[k][v]);
              }
            } else if (k.substr(0, 5) === "data-") {
              e.setAttribute(k, l[k]);
            } else {
              e[k] = l[k];
            }
          }
        } else if ('function' === typeof l) {
          //assume it's an observable!
          var v = l();
          e.appendChild(r = isNode(v) ? v : document.createTextNode(v));

          cleanupFuncs.push(l(function (v) {
            if (isNode(v) && r.parentElement) r.parentElement.replaceChild(v, r), r = v;else r.textContent = v;
          }));
        }

      return r;
    }
    while (args.length) {
      item(args.shift());
    }return e;
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++) {
      cleanupFuncs[i]();
    }
    cleanupFuncs.length = 0;
  };

  return h;
}

var h = module.exports = context();
h.context = context;

function isNode(el) {
  return el && el.nodeName && el.nodeType;
}

function forEach(arr, fn) {
  if (arr.forEach) return arr.forEach(fn);
  for (var i = 0; i < arr.length; i++) {
    fn(arr[i], i);
  }
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
}

/***/ }),

/***/ "../node_modules/indexof/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var indexOf = [].indexOf;

module.exports = function (arr, obj) {
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),

/***/ "../node_modules/regenerator-runtime/runtime-module.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = function () {
  return this;
}() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__("../node_modules/regenerator-runtime/runtime.js");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch (e) {
    g.regeneratorRuntime = undefined;
  }
}

/***/ }),

/***/ "../node_modules/regenerator-runtime/runtime.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!function (global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = ( false ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function (arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
}(
// In sloppy mode, unbound `this` refers to the global object, fallback to
// Function constructor if we're in global strict mode. That is sadly a form
// of indirect eval which violates Content Security Policy.
function () {
  return this;
}() || Function("return this")());
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../node_modules/webpack/buildin/module.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),

/***/ "./core/component.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RootComponent = exports.Component = undefined;

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this, no-restricted-syntax */

var RootComponent = function () {
    function RootComponent() {
        _classCallCheck(this, RootComponent);

        this.containerID = 'app';
        this.state = {};
        this.params = {};
    }

    _createClass(RootComponent, [{
        key: 'updateView',
        value: function updateView(view) {
            if (document.body) {
                this.view = view;
                document.body.insertAdjacentElement('afterbegin', this.view);
            } else {
                throw new Error('[Beaconing] Document Body not found');
            }
        }
    }, {
        key: 'appendView',
        value: function appendView(view) {
            if (!this.view) {
                this.view = [];
            }

            if (document.body) {
                this.view.push(view);
                document.body.appendChild(view);
            } else {
                throw new Error('[Beaconing] Document Body not found');
            }
        }
    }, {
        key: 'startLifecycle',
        value: function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                var element, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, view;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.render();

                            case 2:
                                element = _context.sent;

                                if (!Array.isArray(element)) {
                                    _context.next = 25;
                                    break;
                                }

                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 7;

                                for (_iterator = element[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    view = _step.value;

                                    this.appendView(view);
                                }
                                _context.next = 15;
                                break;

                            case 11:
                                _context.prev = 11;
                                _context.t0 = _context['catch'](7);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 15:
                                _context.prev = 15;
                                _context.prev = 16;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 18:
                                _context.prev = 18;

                                if (!_didIteratorError) {
                                    _context.next = 21;
                                    break;
                                }

                                throw _iteratorError;

                            case 21:
                                return _context.finish(18);

                            case 22:
                                return _context.finish(15);

                            case 23:
                                _context.next = 26;
                                break;

                            case 25:
                                this.updateView(element);

                            case 26:

                                if (this.afterMount) {
                                    this.afterMount();
                                }

                            case 27:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[7, 11, 15, 23], [16,, 18, 22]]);
            }));

            function startLifecycle() {
                return _ref.apply(this, arguments);
            }

            return startLifecycle;
        }()
    }, {
        key: 'start',
        value: function () {
            var _ref2 = _asyncToGenerator(_regenerator2.default.mark(function _callee2(params) {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (params) {
                                    this.params = params;
                                }

                                this.startLifecycle();
                                console.log('[Beaconing] Root Component Started!');

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function start(_x) {
                return _ref2.apply(this, arguments);
            }

            return start;
        }()
    }]);

    return RootComponent;
}();

var Component = function () {
    function Component() {
        _classCallCheck(this, Component);

        this.state = {};
    }

    _createClass(Component, [{
        key: 'updateView',
        value: function updateView(view) {
            var _this = this;

            if (document.readyState !== 'complete') {
                document.body.onload = function () {
                    if (_this.view.parentElement) {
                        _this.view.parentElement.replaceChild(view, _this.view);
                        _this.view = view;
                    }
                };
            } else if (this.view.parentElement) {
                this.view.parentElement.replaceChild(view, this.view);
                this.view = view;
            }
        }
    }, {
        key: 'appendView',
        value: function appendView(view) {
            this.view.appendChild(view);
        }
    }, {
        key: 'attach',
        value: function () {
            var _ref3 = _asyncToGenerator(_regenerator2.default.mark(function _callee3() {
                var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var element;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.start();

                                _context3.next = 3;
                                return this.render(data);

                            case 3:
                                element = _context3.sent;


                                this.view = element;

                                return _context3.abrupt('return', this.view);

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function attach() {
                return _ref3.apply(this, arguments);
            }

            return attach;
        }()
    }, {
        key: 'startLifecycle',
        value: function () {
            var _ref4 = _asyncToGenerator(_regenerator2.default.mark(function _callee4() {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (this.afterMount) {
                                    this.afterMount();
                                }

                            case 1:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function startLifecycle() {
                return _ref4.apply(this, arguments);
            }

            return startLifecycle;
        }()
    }, {
        key: 'start',
        value: function () {
            var _ref5 = _asyncToGenerator(_regenerator2.default.mark(function _callee5() {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                this.startLifecycle();
                                console.log('[Beaconing] Started Component ' + this.constructor.name);

                            case 2:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function start() {
                return _ref5.apply(this, arguments);
            }

            return start;
        }()
    }]);

    return Component;
}();

exports.default = {
    Component: Component,
    RootComponent: RootComponent
};
exports.Component = Component;
exports.RootComponent = RootComponent;

/***/ }),

/***/ "./core/html.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ul = exports.u = exports.textarea = exports.summary = exports.strong = exports.span = exports.small = exports.select = exports.section = exports.script = exports.p = exports.option = exports.nav = exports.meter = exports.meta = exports.main = exports.link = exports.li = exports.legend = exports.label = exports.input = exports.img = exports.iframe = exports.i = exports.hr = exports.header = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.form = exports.footer = exports.figure = exports.figcaption = exports.div = exports.command = exports.caption = exports.canvas = exports.button = exports.br = exports.aside = exports.article = exports.a = undefined;

var _hyperscript = __webpack_require__("../node_modules/hyperscript/index.js");

var _hyperscript2 = _interopRequireDefault(_hyperscript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = __webpack_require__("../node_modules/hyperscript-helpers/dist/index.js")(_hyperscript2.default),
    a = _require.a,
    article = _require.article,
    aside = _require.aside,
    br = _require.br,
    button = _require.button,
    canvas = _require.canvas,
    caption = _require.caption,
    command = _require.command,
    div = _require.div,
    figcaption = _require.figcaption,
    figure = _require.figure,
    footer = _require.footer,
    form = _require.form,
    h1 = _require.h1,
    h2 = _require.h2,
    h3 = _require.h3,
    h4 = _require.h4,
    h5 = _require.h5,
    h6 = _require.h6,
    header = _require.header,
    hr = _require.hr,
    i = _require.i,
    iframe = _require.iframe,
    img = _require.img,
    input = _require.input,
    label = _require.label,
    legend = _require.legend,
    li = _require.li,
    link = _require.link,
    main = _require.main,
    meta = _require.meta,
    meter = _require.meter,
    nav = _require.nav,
    option = _require.option,
    p = _require.p,
    script = _require.script,
    section = _require.section,
    select = _require.select,
    small = _require.small,
    span = _require.span,
    strong = _require.strong,
    summary = _require.summary,
    textarea = _require.textarea,
    u = _require.u,
    ul = _require.ul;

exports.a = a;
exports.article = article;
exports.aside = aside;
exports.br = br;
exports.button = button;
exports.canvas = canvas;
exports.caption = caption;
exports.command = command;
exports.div = div;
exports.figcaption = figcaption;
exports.figure = figure;
exports.footer = footer;
exports.form = form;
exports.h1 = h1;
exports.h2 = h2;
exports.h3 = h3;
exports.h4 = h4;
exports.h5 = h5;
exports.h6 = h6;
exports.header = header;
exports.hr = hr;
exports.i = i;
exports.iframe = iframe;
exports.img = img;
exports.input = input;
exports.label = label;
exports.legend = legend;
exports.li = li;
exports.link = link;
exports.main = main;
exports.meta = meta;
exports.meter = meter;
exports.nav = nav;
exports.option = option;
exports.p = p;
exports.script = script;
exports.section = section;
exports.select = select;
exports.small = small;
exports.span = span;
exports.strong = strong;
exports.summary = summary;
exports.textarea = textarea;
exports.u = u;
exports.ul = ul;

/***/ }),

/***/ "./core/router.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-restricted-syntax */

var Router = function () {
    function Router() {
        _classCallCheck(this, Router);

        this.routes = new Map();
        this.params = {};
    }

    _createClass(Router, [{
        key: 'initRoute',
        value: function initRoute(path, controller) {
            this.routes.set(path, controller);
        }
    }, {
        key: 'setRoutes',
        value: function setRoutes(routes) {
            var _this = this;

            routes.forEach(function (routeObj) {
                _this.initRoute(routeObj.path, routeObj.controller);
            });
        }
    }, {
        key: 'getParams',
        value: function getParams() {
            var path = window.location.href;

            if (/\?/g.test(path)) {
                var index = path.search(/\?/g);
                var query = path.substr(index + 1);
                var vars = query.split('&');
                var params = {};

                vars.forEach(function (value) {
                    var _value$split$filter = value.split('=').filter(function (v) {
                        return v !== '=';
                    }),
                        _value$split$filter2 = _slicedToArray(_value$split$filter, 2),
                        first = _value$split$filter2[0],
                        second = _value$split$filter2[1];

                    params[first] = second;
                });

                this.params = params;
            }
        }
    }, {
        key: 'start',
        value: function start() {
            this.getParams();
            this.initEvents();
            this.findController();
        }
    }, {
        key: 'initEvents',
        value: function initEvents() {
            window.addEventListener('hashchange', this);
        }
    }, {
        key: 'handleEvent',
        value: function handleEvent() {
            this.findController();
        }
    }, {
        key: 'findController',
        value: function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                var hash, path, controller, container;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                hash = window.location.hash;
                                path = hash.slice(1).split('?')[0];


                                if (path === '') {
                                    path = '/';
                                }

                                // console.log(path);

                                if (this.routes.has(path)) {
                                    controller = this.routes.get(path);


                                    if (controller) {
                                        controller.start(this.params);
                                    }
                                } else {
                                    container = document.getElementById('app');

                                    if (container) {
                                        container.innerHTML = '<p>Error (404): Page not found</p>';
                                    }
                                }

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function findController() {
                return _ref.apply(this, arguments);
            }

            return findController;
        }()
    }]);

    return Router;
}();

exports.default = Router;

/***/ }),

/***/ "./modules/header/root/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html = __webpack_require__("./core/html.js");

var _component = __webpack_require__("./core/component.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import Identicon from 'identicon.js';


var Header = function (_Component) {
    _inherits(Header, _Component);

    function Header() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Header);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Header.__proto__ || Object.getPrototypeOf(Header)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            teacherName: 'John Smith',
            teacherIMG: '//' + window.location.host + '/dist/beaconing/images/profile.png'
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Header, [{
        key: 'render',
        value: function () {
            var _ref2 = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', (0, _html.header)('#main-header', (0, _html.div)('.logo', (0, _html.a)({
                                    href: './'
                                }, (0, _html.img)({
                                    src: '//' + window.location.host + '/dist/beaconing/images/logo.png',
                                    alt: 'Click to go to Home'
                                }))), (0, _html.div)('.profile', (0, _html.div)('.logout', (0, _html.a)('Log Out')), (0, _html.div)('.profile-img', (0, _html.img)('.profile-blue', {
                                    src: this.state.teacherIMG,
                                    alt: this.state.teacherName
                                })))));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render() {
                return _ref2.apply(this, arguments);
            }

            return render;
        }()
    }]);

    return Header;
}(_component.Component);

exports.default = Header;

/***/ }),

/***/ "./modules/home/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _router = __webpack_require__("./core/router.js");

var _router2 = _interopRequireDefault(_router);

var _home = __webpack_require__("./modules/home/root/home.js");

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _router2.default();

router.setRoutes([{
    path: '/',
    controller: new _home2.default()
}]);

router.start();

/***/ }),

/***/ "./modules/home/root/active_plans.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html = __webpack_require__("./core/html.js");

var _component = __webpack_require__("./core/component.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActivePlans = function (_Component) {
    _inherits(ActivePlans, _Component);

    function ActivePlans() {
        _classCallCheck(this, ActivePlans);

        return _possibleConstructorReturn(this, (ActivePlans.__proto__ || Object.getPrototypeOf(ActivePlans)).apply(this, arguments));
    }

    _createClass(ActivePlans, [{
        key: 'render',
        value: function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', (0, _html.div)('.tile.flex-column.flex-2', (0, _html.div)('.title', (0, _html.p)('Active Lesson Plans'), (0, _html.a)({
                                    href: './lesson_manager/'
                                }, (0, _html.i)('.icon-link-ext-alt', {
                                    title: 'View Active Lesson Plans',
                                    'aria-hidden': true
                                }))), (0, _html.div)('.content', (0, _html.div)('#active-plan-summary', (0, _html.div)('.plan', (0, _html.div)('.image', (0, _html.img)({
                                    src: '//' + window.location.host + '/dist/beaconing/images/quest-image.jpg',
                                    alt: 'Algebra Beginnings'
                                })), (0, _html.div)('.info', (0, _html.div)('.name', (0, _html.p)('Algebra Beginnings')))), (0, _html.div)('.plan', (0, _html.div)('.image', (0, _html.img)({
                                    src: '//' + window.location.host + '/dist/beaconing/images/quest-image.jpg',
                                    alt: 'First steps to Engineering'
                                })), (0, _html.div)('.info', (0, _html.div)('.name', (0, _html.p)('First steps to Engineering')))), (0, _html.div)('.plan', (0, _html.div)('.image', (0, _html.img)({
                                    src: '//' + window.location.host + '/dist/beaconing/images/quest-image.jpg',
                                    alt: 'Advanced Masonary'
                                })), (0, _html.div)('.info', (0, _html.div)('.name', (0, _html.p)('Advanced Masonary'))))))));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render() {
                return _ref.apply(this, arguments);
            }

            return render;
        }()
    }]);

    return ActivePlans;
}(_component.Component);

exports.default = ActivePlans;

/***/ }),

/***/ "./modules/home/root/dashboard_nav.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html = __webpack_require__("./core/html.js");

var _component = __webpack_require__("./core/component.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DashboardNav = function (_Component) {
    _inherits(DashboardNav, _Component);

    function DashboardNav() {
        _classCallCheck(this, DashboardNav);

        return _possibleConstructorReturn(this, (DashboardNav.__proto__ || Object.getPrototypeOf(DashboardNav)).apply(this, arguments));
    }

    _createClass(DashboardNav, [{
        key: 'render',
        value: function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', (0, _html.nav)('.mini.spaced.flex-justify-end', (0, _html.a)('.item', 'Edit Layout')));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render() {
                return _ref.apply(this, arguments);
            }

            return render;
        }()
    }]);

    return DashboardNav;
}(_component.Component);

exports.default = DashboardNav;

/***/ }),

/***/ "./modules/home/root/home.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html = __webpack_require__("./core/html.js");

var _component = __webpack_require__("./core/component.js");

var _root = __webpack_require__("./modules/header/root/index.js");

var _root2 = _interopRequireDefault(_root);

var _main = __webpack_require__("./modules/nav/main/index.js");

var _main2 = _interopRequireDefault(_main);

var _dashboard_nav = __webpack_require__("./modules/home/root/dashboard_nav.js");

var _dashboard_nav2 = _interopRequireDefault(_dashboard_nav);

var _basic = __webpack_require__("./modules/search/basic/index.js");

var _basic2 = _interopRequireDefault(_basic);

var _recent_activities = __webpack_require__("./modules/home/root/recent_activities.js");

var _recent_activities2 = _interopRequireDefault(_recent_activities);

var _active_plans = __webpack_require__("./modules/home/root/active_plans.js");

var _active_plans2 = _interopRequireDefault(_active_plans);

var _student_overview = __webpack_require__("./modules/home/root/student_overview.js");

var _student_overview2 = _interopRequireDefault(_student_overview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_RootComponent) {
    _inherits(Home, _RootComponent);

    function Home() {
        _classCallCheck(this, Home);

        return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
    }

    _createClass(Home, [{
        key: 'render',
        value: function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                var header, mainNav, dashboardNav, search, recentActivities, activePlans, studentOverview;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                header = new _root2.default();
                                mainNav = new _main2.default();
                                dashboardNav = new _dashboard_nav2.default();
                                search = new _basic2.default();
                                recentActivities = new _recent_activities2.default();
                                activePlans = new _active_plans2.default();
                                studentOverview = new _student_overview2.default();
                                return _context.abrupt('return', Promise.all([header.attach(), mainNav.attach(), dashboardNav.attach(), search.attach({
                                    searchType: 'width-expand'
                                }), recentActivities.attach(), activePlans.attach(), studentOverview.attach()]).then(function (values) {
                                    var _values = _slicedToArray(values, 7),
                                        headerEl = _values[0],
                                        mainNavEl = _values[1],
                                        dashboardNavEl = _values[2],
                                        searchEl = _values[3],
                                        recentActivitiesEl = _values[4],
                                        activePlansEl = _values[5],
                                        studentOverviewEl = _values[6];

                                    return (0, _html.div)('#app', headerEl, (0, _html.div)('.flex-container.expand.margin-top-2', mainNavEl, (0, _html.main)((0, _html.section)('.flex-column', dashboardNavEl), (0, _html.section)('.flex-column', searchEl), (0, _html.section)('.flex-spacearound.mobile-collapse', recentActivitiesEl, activePlansEl), (0, _html.section)('.flex-column', studentOverviewEl))));
                                }));

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render() {
                return _ref.apply(this, arguments);
            }

            return render;
        }()

        // async afterMount() {

        // }

    }]);

    return Home;
}(_component.RootComponent);

exports.default = Home;

/***/ }),

/***/ "./modules/home/root/recent_activities.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html = __webpack_require__("./core/html.js");

var _component = __webpack_require__("./core/component.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RecentActivities = function (_Component) {
    _inherits(RecentActivities, _Component);

    function RecentActivities() {
        _classCallCheck(this, RecentActivities);

        return _possibleConstructorReturn(this, (RecentActivities.__proto__ || Object.getPrototypeOf(RecentActivities)).apply(this, arguments));
    }

    _createClass(RecentActivities, [{
        key: 'render',
        value: function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', (0, _html.div)('.tile.flex-column.flex-2', (0, _html.div)('.title', (0, _html.p)('Your Recent Activities')), (0, _html.div)('.content', (0, _html.div)('#recent-activity', (0, _html.div)('.activity', (0, _html.div)('.info', (0, _html.p)('Assigned new lesson plan: ', (0, _html.a)('.link-underline', 'Algebra Beginnings'))), (0, _html.div)('.time', (0, _html.p)('12:54'))), (0, _html.div)('.activity', (0, _html.div)('.info', (0, _html.p)('Assigned new lesson plan: ', (0, _html.a)('.link-underline', 'First Steps to Engineering'))), (0, _html.div)('.time', (0, _html.p)({ title: '13:50' }, '12:54'))), (0, _html.div)('.activity', (0, _html.div)('.info', (0, _html.p)('Assigned new lesson plan: ', (0, _html.a)('.link-underline', 'Advanced Masonary'))), (0, _html.div)('.time', (0, _html.p)({ title: '17:02 03/06/2017' }, '03/06')))))));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render() {
                return _ref.apply(this, arguments);
            }

            return render;
        }()
    }]);

    return RecentActivities;
}(_component.Component);

exports.default = RecentActivities;

/***/ }),

/***/ "./modules/home/root/student_overview.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html = __webpack_require__("./core/html.js");

var _component = __webpack_require__("./core/component.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StudentOverview = function (_Component) {
    _inherits(StudentOverview, _Component);

    function StudentOverview() {
        _classCallCheck(this, StudentOverview);

        return _possibleConstructorReturn(this, (StudentOverview.__proto__ || Object.getPrototypeOf(StudentOverview)).apply(this, arguments));
    }

    _createClass(StudentOverview, [{
        key: 'render',
        value: function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', (0, _html.div)('.tile.flex-column', (0, _html.div)('.title', (0, _html.p)('Student Overview'), (0, _html.a)({
                                    href: './classroom/'
                                }, (0, _html.i)('.icon-link-ext-alt', {
                                    title: 'View Students',
                                    'aria-hidden': true
                                }))), (0, _html.div)('.content', (0, _html.div)('#student-overview', (0, _html.div)('.sorting', (0, _html.div)('.sort-menu', (0, _html.span)('Class: '), (0, _html.a)('.active', '11b'), (0, _html.a)('13a')), (0, _html.div)('.sort-menu', (0, _html.span)('Sort By: '), (0, _html.a)('This Week'), (0, _html.a)('.active', 'This Month'), (0, _html.a)('This Year'))), (0, _html.div)('.flex-container', (0, _html.div)('.student-section', (0, _html.div)('.title', (0, _html.h3)('Best Performing')), (0, _html.div)('.students', (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-green', {
                                    style: {
                                        width: '96%'
                                    }
                                }, (0, _html.span)('96%')))))), (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-green', {
                                    style: {
                                        width: '94%'
                                    }
                                }, (0, _html.span)('94%')))))), (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-green', {
                                    style: {
                                        width: '91%'
                                    }
                                }, (0, _html.span)('91%')))))))), (0, _html.div)('.student-section', (0, _html.div)('.title', (0, _html.h3)('Needs Attention')), (0, _html.div)('.students', (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-red', {
                                    style: {
                                        width: '30%'
                                    }
                                }, (0, _html.span)('30%')))))), (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-red', {
                                    style: {
                                        width: '28%'
                                    }
                                }, (0, _html.span)('28%')))))), (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-red', {
                                    style: {
                                        width: '25%'
                                    }
                                }, (0, _html.span)('25%')))))))), (0, _html.div)('.student-section', (0, _html.div)('.title', (0, _html.h3)('Most Improvement')), (0, _html.div)('.students', (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-amber', {
                                    style: {
                                        width: '70%'
                                    }
                                }, (0, _html.span)('70%')))))), (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-amber', {
                                    style: {
                                        width: '68%'
                                    }
                                }, (0, _html.span)('68%')))))), (0, _html.div)('.student', (0, _html.div)('.flex-container.tablet-hide', (0, _html.div)('.student-profile-image', (0, _html.img)('.profile-blue', {
                                    src: '//' + window.location.host + '/dist/beaconing/images/profile.png',
                                    alt: 'Example Student'
                                }))), (0, _html.div)('.flex-container.flex-column.flex-spacearound.flex-grow', (0, _html.div)('.student-name', (0, _html.p)('Example Student')), (0, _html.div)('.student-percentage', (0, _html.p)('Overall Percentage:'), (0, _html.div)('.progress-bar', (0, _html.div)('.status-amber', {
                                    style: {
                                        width: '59%'
                                    }
                                }, (0, _html.span)('59%')))))))))))));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render() {
                return _ref.apply(this, arguments);
            }

            return render;
        }()
    }]);

    return StudentOverview;
}(_component.Component);

exports.default = StudentOverview;

/***/ }),

/***/ "./modules/nav/main/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html = __webpack_require__("./core/html.js");

var _component = __webpack_require__("./core/component.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainNav = function (_Component) {
    _inherits(MainNav, _Component);

    function MainNav() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, MainNav);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MainNav.__proto__ || Object.getPrototypeOf(MainNav)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            path: window.location.pathname.slice(1)
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(MainNav, [{
        key: 'render',
        value: function () {
            var _ref2 = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
                var path;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                path = this.state.path;
                                return _context.abrupt('return', (0, _html.nav)('#main', (0, _html.div)('.nav-group', (0, _html.a)(path === '' ? '.item.active' : '.item', {
                                    href: './'
                                }, (0, _html.i)('.icon-home'), (0, _html.span)('Home')), (0, _html.a)(/^classroom/.test(path) ? '.item.active-orange' : '.item', {
                                    href: './classroom/'
                                }, (0, _html.i)('.icon-graduation-cap'), (0, _html.span)('Classroom')), (0, _html.a)(/^lesson_manager/.test(path) ? '.item.active-orange' : '.item', {
                                    href: './lesson_manager/'
                                }, (0, _html.i)('.icon-authoring'), (0, _html.span)('Lesson Manager')), (0, _html.a)(/^calendar/.test(path) ? '.item.active' : '.item', {
                                    href: './calendar/'
                                }, (0, _html.i)('.icon-calendar'), (0, _html.span)('Calendar')), (0, _html.a)(/^messages/.test(path) ? '.item.active-orange' : '.item', {
                                    href: './messages/'
                                }, (0, _html.i)('.icon-chat'), (0, _html.span)('Messages'))), (0, _html.div)('.nav-group', (0, _html.a)(/^search/.test(path) ? '.item.active' : '.item', {
                                    href: './search/'
                                }, (0, _html.i)('.icon-search'), (0, _html.span)('Search')), (0, _html.a)(/^settings/.test(path) ? '.item.active' : '.item', {
                                    href: './settings/'
                                }, (0, _html.i)('.icon-cogs'), (0, _html.span)('Settings')), (0, _html.a)('.item', {
                                    onclick: function onclick() {
                                        window.abarRuntime.open();
                                    }
                                }, (0, _html.i)('.icon-key-inv'), (0, _html.span)('Accessibility')))));

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render() {
                return _ref2.apply(this, arguments);
            }

            return render;
        }()
    }]);

    return MainNav;
}(_component.Component);

exports.default = MainNav;

/***/ }),

/***/ "./modules/search/basic/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__("../node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html = __webpack_require__("./core/html.js");

var _component = __webpack_require__("./core/component.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasicSearch = function (_Component) {
    _inherits(BasicSearch, _Component);

    function BasicSearch() {
        _classCallCheck(this, BasicSearch);

        return _possibleConstructorReturn(this, (BasicSearch.__proto__ || Object.getPrototypeOf(BasicSearch)).apply(this, arguments));
    }

    _createClass(BasicSearch, [{
        key: 'render',
        value: function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(data) {
                var searchType;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                searchType = data.searchType;
                                return _context.abrupt('return', (0, _html.div)('.search.fuzzy-search', (0, _html.i)('.icon-search', { 'aria-hidden': true }), (0, _html.input)('.' + searchType, { type: 'text' })));

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render(_x) {
                return _ref.apply(this, arguments);
            }

            return render;
        }()
    }]);

    return BasicSearch;
}(_component.Component);

exports.default = BasicSearch;

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
//# sourceMappingURL=index.js.map