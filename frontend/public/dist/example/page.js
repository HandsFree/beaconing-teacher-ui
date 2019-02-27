/*!
 * --- Compiled in Developer Mode ---
 * 
 * Example
 * ------------
 * Authors:
 * Elliott Judd <e@ejudd.uk>
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/dist/example/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/@hyperapp/html/dist/html.js":
/*!***************************************************!*\
  !*** ../node_modules/@hyperapp/html/dist/html.js ***!
  \***************************************************/
/*! exports provided: a, abbr, address, area, article, aside, audio, b, bdi, bdo, blockquote, br, button, canvas, caption, cite, code, col, colgroup, data, datalist, dd, del, details, dfn, dialog, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hr, i, iframe, img, input, ins, kbd, label, legend, li, main, map, mark, menu, menuitem, meter, nav, object, ol, optgroup, option, output, p, param, pre, progress, q, rp, rt, rtc, ruby, s, samp, section, select, small, source, span, strong, sub, summary, sup, svg, table, tbody, td, textarea, tfoot, th, thead, time, tr, track, u, ul, video, wbr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return a; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "abbr", function() { return abbr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "address", function() { return address; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "area", function() { return area; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "article", function() { return article; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "aside", function() { return aside; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "audio", function() { return audio; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return b; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bdi", function() { return bdi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bdo", function() { return bdo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blockquote", function() { return blockquote; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "br", function() { return br; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "button", function() { return button; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvas", function() { return canvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "caption", function() { return caption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cite", function() { return cite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "code", function() { return code; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "col", function() { return col; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colgroup", function() { return colgroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "data", function() { return data; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "datalist", function() { return datalist; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dd", function() { return dd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "del", function() { return del; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "details", function() { return details; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dfn", function() { return dfn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dialog", function() { return dialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "div", function() { return div; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dl", function() { return dl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dt", function() { return dt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "em", function() { return em; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "embed", function() { return embed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fieldset", function() { return fieldset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "figcaption", function() { return figcaption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "figure", function() { return figure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "footer", function() { return footer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "form", function() { return form; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h1", function() { return h1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h2", function() { return h2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h3", function() { return h3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h4", function() { return h4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h5", function() { return h5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h6", function() { return h6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "header", function() { return header; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hr", function() { return hr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return i; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iframe", function() { return iframe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "img", function() { return img; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "input", function() { return input; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ins", function() { return ins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kbd", function() { return kbd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "label", function() { return label; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "legend", function() { return legend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "li", function() { return li; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "main", function() { return main; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mark", function() { return mark; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menu", function() { return menu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuitem", function() { return menuitem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "meter", function() { return meter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nav", function() { return nav; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "object", function() { return object; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ol", function() { return ol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "optgroup", function() { return optgroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "option", function() { return option; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "output", function() { return output; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return p; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "param", function() { return param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pre", function() { return pre; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "progress", function() { return progress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return q; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rp", function() { return rp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rt", function() { return rt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rtc", function() { return rtc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ruby", function() { return ruby; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return s; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "samp", function() { return samp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "section", function() { return section; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "select", function() { return select; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "small", function() { return small; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "source", function() { return source; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "span", function() { return span; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "strong", function() { return strong; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sub", function() { return sub; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "summary", function() { return summary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sup", function() { return sup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "svg", function() { return svg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "table", function() { return table; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tbody", function() { return tbody; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "td", function() { return td; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "textarea", function() { return textarea; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tfoot", function() { return tfoot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "th", function() { return th; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "thead", function() { return thead; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "time", function() { return time; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tr", function() { return tr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "track", function() { return track; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return u; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ul", function() { return ul; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "video", function() { return video; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wbr", function() { return wbr; });
/* harmony import */ var hyperapp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hyperapp */ "../node_modules/hyperapp/src/index.js");


function vnode(name) {
  return function (attributes, children) {
    return typeof attributes === "object" && !Array.isArray(attributes)
      ? Object(hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])(name, attributes, children)
      : Object(hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])(name, {}, attributes)
  }
}


function a(attributes, children) {
  return vnode("a")(attributes, children)
}

function abbr(attributes, children) {
  return vnode("abbr")(attributes, children)
}

function address(attributes, children) {
  return vnode("address")(attributes, children)
}

function area(attributes, children) {
  return vnode("area")(attributes, children)
}

function article(attributes, children) {
  return vnode("article")(attributes, children)
}

function aside(attributes, children) {
  return vnode("aside")(attributes, children)
}

function audio(attributes, children) {
  return vnode("audio")(attributes, children)
}

function b(attributes, children) {
  return vnode("b")(attributes, children)
}

function bdi(attributes, children) {
  return vnode("bdi")(attributes, children)
}

function bdo(attributes, children) {
  return vnode("bdo")(attributes, children)
}

function blockquote(attributes, children) {
  return vnode("blockquote")(attributes, children)
}

function br(attributes, children) {
  return vnode("br")(attributes, children)
}

function button(attributes, children) {
  return vnode("button")(attributes, children)
}

function canvas(attributes, children) {
  return vnode("canvas")(attributes, children)
}

function caption(attributes, children) {
  return vnode("caption")(attributes, children)
}

function cite(attributes, children) {
  return vnode("cite")(attributes, children)
}

function code(attributes, children) {
  return vnode("code")(attributes, children)
}

function col(attributes, children) {
  return vnode("col")(attributes, children)
}

function colgroup(attributes, children) {
  return vnode("colgroup")(attributes, children)
}

function data(attributes, children) {
  return vnode("data")(attributes, children)
}

function datalist(attributes, children) {
  return vnode("datalist")(attributes, children)
}

function dd(attributes, children) {
  return vnode("dd")(attributes, children)
}

function del(attributes, children) {
  return vnode("del")(attributes, children)
}

function details(attributes, children) {
  return vnode("details")(attributes, children)
}

function dfn(attributes, children) {
  return vnode("dfn")(attributes, children)
}

function dialog(attributes, children) {
  return vnode("dialog")(attributes, children)
}

function div(attributes, children) {
  return vnode("div")(attributes, children)
}

function dl(attributes, children) {
  return vnode("dl")(attributes, children)
}

function dt(attributes, children) {
  return vnode("dt")(attributes, children)
}

function em(attributes, children) {
  return vnode("em")(attributes, children)
}

function embed(attributes, children) {
  return vnode("embed")(attributes, children)
}

function fieldset(attributes, children) {
  return vnode("fieldset")(attributes, children)
}

function figcaption(attributes, children) {
  return vnode("figcaption")(attributes, children)
}

function figure(attributes, children) {
  return vnode("figure")(attributes, children)
}

function footer(attributes, children) {
  return vnode("footer")(attributes, children)
}

function form(attributes, children) {
  return vnode("form")(attributes, children)
}

function h1(attributes, children) {
  return vnode("h1")(attributes, children)
}

function h2(attributes, children) {
  return vnode("h2")(attributes, children)
}

function h3(attributes, children) {
  return vnode("h3")(attributes, children)
}

function h4(attributes, children) {
  return vnode("h4")(attributes, children)
}

function h5(attributes, children) {
  return vnode("h5")(attributes, children)
}

function h6(attributes, children) {
  return vnode("h6")(attributes, children)
}

function header(attributes, children) {
  return vnode("header")(attributes, children)
}

function hr(attributes, children) {
  return vnode("hr")(attributes, children)
}

function i(attributes, children) {
  return vnode("i")(attributes, children)
}

function iframe(attributes, children) {
  return vnode("iframe")(attributes, children)
}

function img(attributes, children) {
  return vnode("img")(attributes, children)
}

function input(attributes, children) {
  return vnode("input")(attributes, children)
}

function ins(attributes, children) {
  return vnode("ins")(attributes, children)
}

function kbd(attributes, children) {
  return vnode("kbd")(attributes, children)
}

function label(attributes, children) {
  return vnode("label")(attributes, children)
}

function legend(attributes, children) {
  return vnode("legend")(attributes, children)
}

function li(attributes, children) {
  return vnode("li")(attributes, children)
}

function main(attributes, children) {
  return vnode("main")(attributes, children)
}

function map(attributes, children) {
  return vnode("map")(attributes, children)
}

function mark(attributes, children) {
  return vnode("mark")(attributes, children)
}

function menu(attributes, children) {
  return vnode("menu")(attributes, children)
}

function menuitem(attributes, children) {
  return vnode("menuitem")(attributes, children)
}

function meter(attributes, children) {
  return vnode("meter")(attributes, children)
}

function nav(attributes, children) {
  return vnode("nav")(attributes, children)
}

function object(attributes, children) {
  return vnode("object")(attributes, children)
}

function ol(attributes, children) {
  return vnode("ol")(attributes, children)
}

function optgroup(attributes, children) {
  return vnode("optgroup")(attributes, children)
}

function option(attributes, children) {
  return vnode("option")(attributes, children)
}

function output(attributes, children) {
  return vnode("output")(attributes, children)
}

function p(attributes, children) {
  return vnode("p")(attributes, children)
}

function param(attributes, children) {
  return vnode("param")(attributes, children)
}

function pre(attributes, children) {
  return vnode("pre")(attributes, children)
}

function progress(attributes, children) {
  return vnode("progress")(attributes, children)
}

function q(attributes, children) {
  return vnode("q")(attributes, children)
}

function rp(attributes, children) {
  return vnode("rp")(attributes, children)
}

function rt(attributes, children) {
  return vnode("rt")(attributes, children)
}

function rtc(attributes, children) {
  return vnode("rtc")(attributes, children)
}

function ruby(attributes, children) {
  return vnode("ruby")(attributes, children)
}

function s(attributes, children) {
  return vnode("s")(attributes, children)
}

function samp(attributes, children) {
  return vnode("samp")(attributes, children)
}

function section(attributes, children) {
  return vnode("section")(attributes, children)
}

function select(attributes, children) {
  return vnode("select")(attributes, children)
}

function small(attributes, children) {
  return vnode("small")(attributes, children)
}

function source(attributes, children) {
  return vnode("source")(attributes, children)
}

function span(attributes, children) {
  return vnode("span")(attributes, children)
}

function strong(attributes, children) {
  return vnode("strong")(attributes, children)
}

function sub(attributes, children) {
  return vnode("sub")(attributes, children)
}

function summary(attributes, children) {
  return vnode("summary")(attributes, children)
}

function sup(attributes, children) {
  return vnode("sup")(attributes, children)
}

function svg(attributes, children) {
  return vnode("svg")(attributes, children)
}

function table(attributes, children) {
  return vnode("table")(attributes, children)
}

function tbody(attributes, children) {
  return vnode("tbody")(attributes, children)
}

function td(attributes, children) {
  return vnode("td")(attributes, children)
}

function textarea(attributes, children) {
  return vnode("textarea")(attributes, children)
}

function tfoot(attributes, children) {
  return vnode("tfoot")(attributes, children)
}

function th(attributes, children) {
  return vnode("th")(attributes, children)
}

function thead(attributes, children) {
  return vnode("thead")(attributes, children)
}

function time(attributes, children) {
  return vnode("time")(attributes, children)
}

function tr(attributes, children) {
  return vnode("tr")(attributes, children)
}

function track(attributes, children) {
  return vnode("track")(attributes, children)
}

function u(attributes, children) {
  return vnode("u")(attributes, children)
}

function ul(attributes, children) {
  return vnode("ul")(attributes, children)
}

function video(attributes, children) {
  return vnode("video")(attributes, children)
}

function wbr(attributes, children) {
  return vnode("wbr")(attributes, children)
}



/***/ }),

/***/ "../node_modules/hyperapp/src/index.js":
/*!*********************************************!*\
  !*** ../node_modules/hyperapp/src/index.js ***!
  \*********************************************/
/*! exports provided: h, app */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "app", function() { return app; });
function h(name, attributes) {
  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    var node = rest.pop()
    if (node && node.pop) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return typeof name === "function"
    ? name(attributes || {}, children)
    : {
        nodeName: name,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
      }
}

function app(state, actions, view, container) {
  var map = [].map
  var rootElement = (container && container.children[0]) || null
  var oldNode = rootElement && recycleElement(rootElement)
  var lifecycle = []
  var skipRender
  var isRecycling = true
  var globalState = clone(state)
  var wiredActions = wireStateToActions([], globalState, clone(actions))

  scheduleRender()

  return wiredActions

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function(element) {
        return element.nodeType === 3 // Node.TEXT_NODE
          ? element.nodeValue
          : recycleElement(element)
      })
    }
  }

  function resolveNode(node) {
    return typeof node === "function"
      ? resolveNode(node(globalState, wiredActions))
      : node != null
        ? node
        : ""
  }

  function render() {
    skipRender = !skipRender

    var node = resolveNode(view)

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, (oldNode = node))
    }

    isRecycling = false

    while (lifecycle.length) lifecycle.pop()()
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true
      setTimeout(render)
    }
  }

  function clone(target, source) {
    var out = {}

    for (var i in target) out[i] = target[i]
    for (var i in source) out[i] = source[i]

    return out
  }

  function setPartialState(path, value, source) {
    var target = {}
    if (path.length) {
      target[path[0]] =
        path.length > 1
          ? setPartialState(path.slice(1), value, source[path[0]])
          : value
      return clone(source, target)
    }
    return value
  }

  function getPartialState(path, source) {
    var i = 0
    while (i < path.length) {
      source = source[path[i++]]
    }
    return source
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function"
        ? (function(key, action) {
            actions[key] = function(data) {
              var result = action(data)

              if (typeof result === "function") {
                result = result(getPartialState(path, globalState), actions)
              }

              if (
                result &&
                result !== (state = getPartialState(path, globalState)) &&
                !result.then // !isPromise
              ) {
                scheduleRender(
                  (globalState = setPartialState(
                    path,
                    clone(state, result),
                    globalState
                  ))
                )
              }

              return result
            }
          })(key, actions[key])
        : wireStateToActions(
            path.concat(key),
            (state[key] = clone(state[key])),
            (actions[key] = clone(actions[key]))
          )
    }

    return actions
  }

  function getKey(node) {
    return node ? node.key : null
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event)
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") {
    } else if (name === "style") {
      if (typeof value === "string") {
        element.style.cssText = value
      } else {
        if (typeof oldValue === "string") oldValue = element.style.cssText = ""
        for (var i in clone(oldValue, value)) {
          var style = value == null || value[i] == null ? "" : value[i]
          if (i[0] === "-") {
            element.style.setProperty(i, style)
          } else {
            element.style[i] = style
          }
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        name = name.slice(2)

        if (element.events) {
          if (!oldValue) oldValue = element.events[name]
        } else {
          element.events = {}
        }

        element.events[name] = value

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener)
          }
        } else {
          element.removeEventListener(name, eventListener)
        }
      } else if (
        name in element &&
        name !== "list" &&
        name !== "type" &&
        name !== "draggable" &&
        name !== "spellcheck" &&
        name !== "translate" &&
        !isSvg
      ) {
        element[name] = value == null ? "" : value
      } else if (value != null && value !== false) {
        element.setAttribute(name, value)
      }

      if (value == null || value === false) {
        element.removeAttribute(name)
      }
    }
  }

  function createElement(node, isSvg) {
    var element =
      typeof node === "string" || typeof node === "number"
        ? document.createTextNode(node)
        : (isSvg = isSvg || node.nodeName === "svg")
          ? document.createElementNS(
              "http://www.w3.org/2000/svg",
              node.nodeName
            )
          : document.createElement(node.nodeName)

    var attributes = node.attributes
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function() {
          attributes.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(
          createElement(
            (node.children[i] = resolveNode(node.children[i])),
            isSvg
          )
        )
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg)
      }
    }

    return element
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (
        attributes[name] !==
        (name === "value" || name === "checked"
          ? element[name]
          : oldAttributes[name])
      ) {
        updateAttribute(
          element,
          name,
          attributes[name],
          oldAttributes[name],
          isSvg
        )
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate
    if (cb) {
      lifecycle.push(function() {
        cb(element, oldAttributes)
      })
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes
    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i])
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element)
      }
    }
    return element
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node))
    }

    var cb = node.attributes && node.attributes.onremove
    if (cb) {
      cb(element, done)
    } else {
      done()
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node === oldNode) {
    } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSvg)
      parent.insertBefore(newElement, element)

      if (oldNode != null) {
        removeElement(parent, element, oldNode)
      }

      element = newElement
    } else if (oldNode.nodeName == null) {
      element.nodeValue = node
    } else {
      updateElement(
        element,
        oldNode.attributes,
        node.attributes,
        (isSvg = isSvg || node.nodeName === "svg")
      )

      var oldKeyed = {}
      var newKeyed = {}
      var oldElements = []
      var oldChildren = oldNode.children
      var children = node.children

      for (var i = 0; i < oldChildren.length; i++) {
        oldElements[i] = element.childNodes[i]

        var oldKey = getKey(oldChildren[i])
        if (oldKey != null) {
          oldKeyed[oldKey] = [oldElements[i], oldChildren[i]]
        }
      }

      var i = 0
      var k = 0

      while (k < children.length) {
        var oldKey = getKey(oldChildren[i])
        var newKey = getKey((children[k] = resolveNode(children[k])))

        if (newKeyed[oldKey]) {
          i++
          continue
        }

        if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
          if (oldKey == null) {
            removeElement(element, oldElements[i], oldChildren[i])
          }
          i++
          continue
        }

        if (newKey == null || isRecycling) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChildren[i], children[k], isSvg)
            k++
          }
          i++
        } else {
          var keyedNode = oldKeyed[newKey] || []

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg)
            i++
          } else if (keyedNode[0]) {
            patch(
              element,
              element.insertBefore(keyedNode[0], oldElements[i]),
              keyedNode[1],
              children[k],
              isSvg
            )
          } else {
            patch(element, oldElements[i], null, children[k], isSvg)
          }

          newKeyed[newKey] = children[k]
          k++
        }
      }

      while (i < oldChildren.length) {
        if (getKey(oldChildren[i]) == null) {
          removeElement(element, oldElements[i], oldChildren[i])
        }
        i++
      }

      for (var i in oldKeyed) {
        if (!newKeyed[i]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
        }
      }
    }
    return element
  }
}


/***/ }),

/***/ "../node_modules/offline-plugin/runtime.js":
/*!*************************************************!*\
  !*** ../node_modules/offline-plugin/runtime.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var warn = "offline-plugin: runtime was installed without OfflinePlugin being added to the webpack.config.js. See https://goo.gl/2Ca7NO for details.";

if (window.console) {
  if (console.info) {
    console.info(warn);
  } else if (console.log) {
    console.log(warn);
  }
}

exports.install = function() {};
exports.applyUpdate = function() {};
exports.update = function() {};

/***/ }),

/***/ "../node_modules/webpack/buildin/harmony-module.js":
/*!*********************************************************!*\
  !*** ../node_modules/webpack/buildin/harmony-module.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./app/actions/index.ts":
/*!******************************!*\
  !*** ./app/actions/index.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var actions = {
  down: function down() {
    return function (_ref) {
      var count = _ref.count;
      return {
        count: count - 1
      };
    };
  },
  reset: function reset() {
    return {
      count: 0
    };
  },
  up: function up() {
    return function (_ref2) {
      var count = _ref2.count;
      return {
        count: count + 1
      };
    };
  }
};
/* harmony default export */ __webpack_exports__["default"] = (actions);

/***/ }),

/***/ "./app/components/counter.component.ts":
/*!*********************************************!*\
  !*** ./app/components/counter.component.ts ***!
  \*********************************************/
/*! exports provided: default, counter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "counter", function() { return counter; });
/* harmony import */ var _hyperapp_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hyperapp/html */ "../node_modules/@hyperapp/html/dist/html.js");


var counter = function counter(_ref, _ref2) {
  var count = _ref.count;
  var up = _ref2.up,
      down = _ref2.down,
      reset = _ref2.reset;
  return Object(_hyperapp_html__WEBPACK_IMPORTED_MODULE_0__["div"])({
    class: 'counter-grid'
  }, [Object(_hyperapp_html__WEBPACK_IMPORTED_MODULE_0__["h1"])({
    class: 'counter-header'
  }, count), Object(_hyperapp_html__WEBPACK_IMPORTED_MODULE_0__["div"])({
    class: 'button-container'
  }, [Object(_hyperapp_html__WEBPACK_IMPORTED_MODULE_0__["button"])({
    class: 'button',
    onclick: function onclick() {
      down();
    }
  }, '-'), Object(_hyperapp_html__WEBPACK_IMPORTED_MODULE_0__["button"])({
    class: 'button',
    onclick: function onclick() {
      reset();
    }
  }, "\u27F2" // ⟲
  ), Object(_hyperapp_html__WEBPACK_IMPORTED_MODULE_0__["button"])({
    class: 'button',
    onclick: function onclick() {
      up();
    }
  }, '+')])]);
};

/* harmony default export */ __webpack_exports__["default"] = (counter);


/***/ }),

/***/ "./app/index.ts":
/*!**********************!*\
  !*** ./app/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var hyperapp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hyperapp */ "../node_modules/hyperapp/src/index.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./app/state/index.ts");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions */ "./app/actions/index.ts");
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./main */ "./app/main.ts");



 // element to bind app to

const bindTo = document.body; // render app

Object(hyperapp__WEBPACK_IMPORTED_MODULE_0__["app"])(_state__WEBPACK_IMPORTED_MODULE_1__["default"], _actions__WEBPACK_IMPORTED_MODULE_2__["default"], _main__WEBPACK_IMPORTED_MODULE_3__["default"], bindTo);

/***/ }),

/***/ "./app/main.ts":
/*!*********************!*\
  !*** ./app/main.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hyperapp_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hyperapp/html */ "../node_modules/@hyperapp/html/dist/html.js");
/* harmony import */ var _components_counter_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/counter.component */ "./app/components/counter.component.ts");



var mainView = function mainView(state, actions) {
  return Object(_hyperapp_html__WEBPACK_IMPORTED_MODULE_0__["div"])({
    id: 'app'
  }, [Object(_components_counter_component__WEBPACK_IMPORTED_MODULE_1__["default"])(state, actions)]);
};

/* harmony default export */ __webpack_exports__["default"] = (mainView);

/***/ }),

/***/ "./app/state/index.ts":
/*!****************************!*\
  !*** ./app/state/index.ts ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var state = {
  count: 0
};
/* harmony default export */ __webpack_exports__["default"] = (state);

/***/ }),

/***/ "./css/app.pcss":
/*!**********************!*\
  !*** ./css/app.pcss ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ }),

/***/ "./css/index.ts":
/*!**********************!*\
  !*** ./css/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_pcss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.pcss */ "./css/app.pcss");
/* harmony import */ var _app_pcss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_pcss__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var offline_plugin_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! offline-plugin/runtime */ "../node_modules/offline-plugin/runtime.js");
/* harmony import */ var offline_plugin_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(offline_plugin_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css */ "./css/index.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app */ "./app/index.ts");
 // import css

 // import app

 // service worker

offline_plugin_runtime__WEBPACK_IMPORTED_MODULE_0__["install"](); // accept HMR

if (module && module.hot) {
  module.hot.accept();
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "../node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9AaHlwZXJhcHAvaHRtbC9kaXN0L2h0bWwuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9oeXBlcmFwcC9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9vZmZsaW5lLXBsdWdpbi9ydW50aW1lLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2hhcm1vbnktbW9kdWxlLmpzIiwid2VicGFjazovLy8uL2FwcC9hY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL2FwcC9jb21wb25lbnRzL2NvdW50ZXIuY29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL2FwcC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9hcHAvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9hcHAvc3RhdGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY3NzL2FwcC5wY3NzIiwid2VicGFjazovLy8uL2Nzcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9pbmRleC50cyJdLCJuYW1lcyI6WyJhY3Rpb25zIiwiZG93biIsImNvdW50IiwicmVzZXQiLCJ1cCIsImNvdW50ZXIiLCJkaXYiLCJjbGFzcyIsImgxIiwiYnV0dG9uIiwib25jbGljayIsImJpbmRUbyIsImRvY3VtZW50IiwiYm9keSIsImFwcCIsInN0YXRlIiwidmlldyIsIm1haW5WaWV3IiwiaWQiLCJPZmZsaW5lUGx1Z2luUnVudGltZSIsIm1vZHVsZSIsImhvdCIsImFjY2VwdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE0Qjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0EsUUFBUSxrREFBQztBQUNULFFBQVEsa0RBQUMsU0FBUztBQUNsQjtBQUNBOzs7QUFHTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDelpBO0FBQUE7QUFBQTtBQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxVQUFVO0FBQzFDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsd0JBQXdCO0FBQzdDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xaQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQjs7Ozs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNyQkE7QUFBQSxJQUFNQSxPQUFzRCxHQUFHO0FBQzNEQyxNQUFJLEVBQUU7QUFBQSxXQUFNO0FBQUEsVUFBR0MsS0FBSCxRQUFHQSxLQUFIO0FBQUEsYUFBZ0I7QUFBRUEsYUFBSyxFQUFFQSxLQUFLLEdBQUc7QUFBakIsT0FBaEI7QUFBQSxLQUFOO0FBQUEsR0FEcUQ7QUFFM0RDLE9BQUssRUFBRTtBQUFBLFdBQU87QUFBRUQsV0FBSyxFQUFFO0FBQVQsS0FBUDtBQUFBLEdBRm9EO0FBRzNERSxJQUFFLEVBQUU7QUFBQSxXQUFNO0FBQUEsVUFBR0YsS0FBSCxTQUFHQSxLQUFIO0FBQUEsYUFBZ0I7QUFBRUEsYUFBSyxFQUFFQSxLQUFLLEdBQUc7QUFBakIsT0FBaEI7QUFBQSxLQUFOO0FBQUE7QUFIdUQsQ0FBL0Q7QUFNZUYsc0VBQWYsRTs7Ozs7Ozs7Ozs7O0FDUkE7QUFBQTtBQUFBO0FBQUE7O0FBRUEsSUFBTUssT0FBTyxHQUFHLFNBQVZBLE9BQVUsY0FBb0M7QUFBQSxNQUFqQ0gsS0FBaUMsUUFBakNBLEtBQWlDO0FBQUEsTUFBdEJFLEVBQXNCLFNBQXRCQSxFQUFzQjtBQUFBLE1BQWxCSCxJQUFrQixTQUFsQkEsSUFBa0I7QUFBQSxNQUFaRSxLQUFZLFNBQVpBLEtBQVk7QUFDaEQsU0FBT0csMERBQUcsQ0FBQztBQUFFQyxTQUFLLEVBQUU7QUFBVCxHQUFELEVBQTRCLENBQ2xDQyx5REFBRSxDQUFDO0FBQUVELFNBQUssRUFBRTtBQUFULEdBQUQsRUFBOEJMLEtBQTlCLENBRGdDLEVBRWxDSSwwREFBRyxDQUFDO0FBQUVDLFNBQUssRUFBRTtBQUFULEdBQUQsRUFBZ0MsQ0FDL0JFLDZEQUFNLENBQ0Y7QUFDSUYsU0FBSyxFQUFFLFFBRFg7QUFFSUcsV0FBTyxFQUFFLG1CQUFNO0FBQ1hULFVBQUk7QUFDUDtBQUpMLEdBREUsRUFPRixHQVBFLENBRHlCLEVBVS9CUSw2REFBTSxDQUNGO0FBQ0lGLFNBQUssRUFBRSxRQURYO0FBRUlHLFdBQU8sRUFBRSxtQkFBTTtBQUNYUCxXQUFLO0FBQ1I7QUFKTCxHQURFLEVBT0YsUUFQRSxDQU9RO0FBUFIsR0FWeUIsRUFtQi9CTSw2REFBTSxDQUNGO0FBQ0lGLFNBQUssRUFBRSxRQURYO0FBRUlHLFdBQU8sRUFBRSxtQkFBTTtBQUNYTixRQUFFO0FBQ0w7QUFKTCxHQURFLEVBT0YsR0FQRSxDQW5CeUIsQ0FBaEMsQ0FGK0IsQ0FBNUIsQ0FBVjtBQWdDSCxDQWpDRDs7QUFtQ2VDLHNFQUFmOzs7Ozs7Ozs7Ozs7O0FDckNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7Q0FHQTs7QUFDQSxNQUFNTSxNQUFNLEdBQUdDLFFBQVEsQ0FBQ0MsSUFBeEIsQyxDQUVBOztBQUNBQyxvREFBRyxDQUFDQyw4Q0FBRCxFQUFRZixnREFBUixFQUFpQmdCLDZDQUFqQixFQUF1QkwsTUFBdkIsQ0FBSCxDOzs7Ozs7Ozs7Ozs7QUNUQTtBQUFBO0FBQUE7QUFBQTtBQUNBOztBQUVBLElBQU1NLFFBQWdELEdBQUcsU0FBbkRBLFFBQW1ELENBQUNGLEtBQUQsRUFBUWYsT0FBUjtBQUFBLFNBQW9CTSwwREFBRyxDQUFDO0FBQUVZLE1BQUUsRUFBRTtBQUFOLEdBQUQsRUFBZ0IsQ0FBQ2IsNkVBQU8sQ0FBQ1UsS0FBRCxFQUFRZixPQUFSLENBQVIsQ0FBaEIsQ0FBdkI7QUFBQSxDQUF6RDs7QUFFZWlCLHVFQUFmLEU7Ozs7Ozs7Ozs7OztBQ05BO0FBQUEsSUFBTUYsS0FBcUIsR0FBRztBQUMxQmIsT0FBSyxFQUFFO0FBRG1CLENBQTlCO0FBSWVhLG9FQUFmLEU7Ozs7Ozs7Ozs7O0FDSkE7QUFDQSxPQUFPLEtBQVUsRUFBRSxrQkFLZDs7Ozs7Ozs7Ozs7OztBQ05MO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Q0FFQTs7Q0FHQTs7Q0FHQTs7QUFDQUksOERBQUEsRyxDQUVBOztBQUNBLElBQUlDLE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxHQUFyQixFQUEwQjtBQUN0QkQsUUFBTSxDQUFDQyxHQUFQLENBQVdDLE1BQVg7QUFDSCxDIiwiZmlsZSI6InBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kaXN0L2V4YW1wbGUvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcImh5cGVyYXBwXCJcblxuZnVuY3Rpb24gdm5vZGUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhdHRyaWJ1dGVzID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KGF0dHJpYnV0ZXMpXG4gICAgICA/IGgobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4pXG4gICAgICA6IGgobmFtZSwge30sIGF0dHJpYnV0ZXMpXG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJhXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWJicihhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJhYmJyXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkcmVzcyhhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJhZGRyZXNzXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJlYShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJhcmVhXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJ0aWNsZShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJhcnRpY2xlXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNpZGUoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiYXNpZGVcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdWRpbyhhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJhdWRpb1wiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGIoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiYlwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJkaShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJiZGlcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiZG8oYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiYmRvXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYmxvY2txdW90ZShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJibG9ja3F1b3RlXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnIoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiYnJcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidXR0b24oYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiYnV0dG9uXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FudmFzKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImNhbnZhc1wiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcHRpb24oYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiY2FwdGlvblwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNpdGUoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiY2l0ZVwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvZGUoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiY29kZVwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJjb2xcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xncm91cChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJjb2xncm91cFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGEoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiZGF0YVwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGFsaXN0KGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImRhdGFsaXN0XCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGQoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiZGRcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWwoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiZGVsXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0YWlscyhhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJkZXRhaWxzXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGZuKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImRmblwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpYWxvZyhhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJkaWFsb2dcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXYoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiZGl2XCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGwoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiZGxcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkdChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJkdFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVtKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImVtXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW1iZWQoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiZW1iZWRcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZHNldChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJmaWVsZHNldFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZ2NhcHRpb24oYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiZmlnY2FwdGlvblwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZ3VyZShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJmaWd1cmVcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb290ZXIoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiZm9vdGVyXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJmb3JtXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaDEoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiaDFcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoMihhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJoMlwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGgzKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImgzXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaDQoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwiaDRcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoNShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJoNVwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGg2KGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImg2XCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGVhZGVyKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImhlYWRlclwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhyKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImhyXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJpXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaWZyYW1lKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcImlmcmFtZVwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGltZyhhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJpbWdcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnB1dChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJpbnB1dFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlucyhhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJpbnNcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrYmQoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwia2JkXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFiZWwoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwibGFiZWxcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsZWdlbmQoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwibGVnZW5kXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGkoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwibGlcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcIm1haW5cIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXAoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwibWFwXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFyayhhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJtYXJrXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVudShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJtZW51XCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVudWl0ZW0oYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwibWVudWl0ZW1cIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXRlcihhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJtZXRlclwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdihhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJuYXZcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvYmplY3QoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwib2JqZWN0XCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb2woYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwib2xcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcHRncm91cChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJvcHRncm91cFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wdGlvbihhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJvcHRpb25cIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXQoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwib3V0cHV0XCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJwXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYW0oYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwicGFyYW1cIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmUoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwicHJlXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvZ3Jlc3MoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwicHJvZ3Jlc3NcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInFcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBycChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJycFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ0KGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInJ0XCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcnRjKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInJ0Y1wiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1YnkoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwicnVieVwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHMoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwic1wiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbXAoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwic2FtcFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlY3Rpb24oYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwic2VjdGlvblwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJzZWxlY3RcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbWFsbChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJzbWFsbFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvdXJjZShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJzb3VyY2VcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGFuKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInNwYW5cIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJvbmcoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwic3Ryb25nXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3ViKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInN1YlwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1bW1hcnkoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwic3VtbWFyeVwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1cChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJzdXBcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdmcoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwic3ZnXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGFibGUoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwidGFibGVcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0Ym9keShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJ0Ym9keVwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRkKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInRkXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dGFyZWEoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwidGV4dGFyZWFcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0Zm9vdChhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJ0Zm9vdFwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRoKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInRoXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGhlYWQoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwidGhlYWRcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW1lKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInRpbWVcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cihhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJ0clwiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYWNrKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gIHJldHVybiB2bm9kZShcInRyYWNrXCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdShhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJ1XCIpKGF0dHJpYnV0ZXMsIGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdWwoYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHZub2RlKFwidWxcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aWRlbyhhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJ2aWRlb1wiKShhdHRyaWJ1dGVzLCBjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdicihhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICByZXR1cm4gdm5vZGUoXCJ3YnJcIikoYXR0cmlidXRlcywgY2hpbGRyZW4pXG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBoKG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgdmFyIHJlc3QgPSBbXVxuICB2YXIgY2hpbGRyZW4gPSBbXVxuICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxuXG4gIHdoaWxlIChsZW5ndGgtLSA+IDIpIHJlc3QucHVzaChhcmd1bWVudHNbbGVuZ3RoXSlcblxuICB3aGlsZSAocmVzdC5sZW5ndGgpIHtcbiAgICB2YXIgbm9kZSA9IHJlc3QucG9wKClcbiAgICBpZiAobm9kZSAmJiBub2RlLnBvcCkge1xuICAgICAgZm9yIChsZW5ndGggPSBub2RlLmxlbmd0aDsgbGVuZ3RoLS07ICkge1xuICAgICAgICByZXN0LnB1c2gobm9kZVtsZW5ndGhdKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZSAhPSBudWxsICYmIG5vZGUgIT09IHRydWUgJiYgbm9kZSAhPT0gZmFsc2UpIHtcbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIlxuICAgID8gbmFtZShhdHRyaWJ1dGVzIHx8IHt9LCBjaGlsZHJlbilcbiAgICA6IHtcbiAgICAgICAgbm9kZU5hbWU6IG5hbWUsXG4gICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMgfHwge30sXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICAgICAga2V5OiBhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMua2V5XG4gICAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHAoc3RhdGUsIGFjdGlvbnMsIHZpZXcsIGNvbnRhaW5lcikge1xuICB2YXIgbWFwID0gW10ubWFwXG4gIHZhciByb290RWxlbWVudCA9IChjb250YWluZXIgJiYgY29udGFpbmVyLmNoaWxkcmVuWzBdKSB8fCBudWxsXG4gIHZhciBvbGROb2RlID0gcm9vdEVsZW1lbnQgJiYgcmVjeWNsZUVsZW1lbnQocm9vdEVsZW1lbnQpXG4gIHZhciBsaWZlY3ljbGUgPSBbXVxuICB2YXIgc2tpcFJlbmRlclxuICB2YXIgaXNSZWN5Y2xpbmcgPSB0cnVlXG4gIHZhciBnbG9iYWxTdGF0ZSA9IGNsb25lKHN0YXRlKVxuICB2YXIgd2lyZWRBY3Rpb25zID0gd2lyZVN0YXRlVG9BY3Rpb25zKFtdLCBnbG9iYWxTdGF0ZSwgY2xvbmUoYWN0aW9ucykpXG5cbiAgc2NoZWR1bGVSZW5kZXIoKVxuXG4gIHJldHVybiB3aXJlZEFjdGlvbnNcblxuICBmdW5jdGlvbiByZWN5Y2xlRWxlbWVudChlbGVtZW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGVOYW1lOiBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgIGNoaWxkcmVuOiBtYXAuY2FsbChlbGVtZW50LmNoaWxkTm9kZXMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQubm9kZVR5cGUgPT09IDMgLy8gTm9kZS5URVhUX05PREVcbiAgICAgICAgICA/IGVsZW1lbnQubm9kZVZhbHVlXG4gICAgICAgICAgOiByZWN5Y2xlRWxlbWVudChlbGVtZW50KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlTm9kZShub2RlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBub2RlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gcmVzb2x2ZU5vZGUobm9kZShnbG9iYWxTdGF0ZSwgd2lyZWRBY3Rpb25zKSlcbiAgICAgIDogbm9kZSAhPSBudWxsXG4gICAgICAgID8gbm9kZVxuICAgICAgICA6IFwiXCJcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBza2lwUmVuZGVyID0gIXNraXBSZW5kZXJcblxuICAgIHZhciBub2RlID0gcmVzb2x2ZU5vZGUodmlldylcblxuICAgIGlmIChjb250YWluZXIgJiYgIXNraXBSZW5kZXIpIHtcbiAgICAgIHJvb3RFbGVtZW50ID0gcGF0Y2goY29udGFpbmVyLCByb290RWxlbWVudCwgb2xkTm9kZSwgKG9sZE5vZGUgPSBub2RlKSlcbiAgICB9XG5cbiAgICBpc1JlY3ljbGluZyA9IGZhbHNlXG5cbiAgICB3aGlsZSAobGlmZWN5Y2xlLmxlbmd0aCkgbGlmZWN5Y2xlLnBvcCgpKClcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlUmVuZGVyKCkge1xuICAgIGlmICghc2tpcFJlbmRlcikge1xuICAgICAgc2tpcFJlbmRlciA9IHRydWVcbiAgICAgIHNldFRpbWVvdXQocmVuZGVyKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lKHRhcmdldCwgc291cmNlKSB7XG4gICAgdmFyIG91dCA9IHt9XG5cbiAgICBmb3IgKHZhciBpIGluIHRhcmdldCkgb3V0W2ldID0gdGFyZ2V0W2ldXG4gICAgZm9yICh2YXIgaSBpbiBzb3VyY2UpIG91dFtpXSA9IHNvdXJjZVtpXVxuXG4gICAgcmV0dXJuIG91dFxuICB9XG5cbiAgZnVuY3Rpb24gc2V0UGFydGlhbFN0YXRlKHBhdGgsIHZhbHVlLCBzb3VyY2UpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cbiAgICBpZiAocGF0aC5sZW5ndGgpIHtcbiAgICAgIHRhcmdldFtwYXRoWzBdXSA9XG4gICAgICAgIHBhdGgubGVuZ3RoID4gMVxuICAgICAgICAgID8gc2V0UGFydGlhbFN0YXRlKHBhdGguc2xpY2UoMSksIHZhbHVlLCBzb3VyY2VbcGF0aFswXV0pXG4gICAgICAgICAgOiB2YWx1ZVxuICAgICAgcmV0dXJuIGNsb25lKHNvdXJjZSwgdGFyZ2V0KVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBhcnRpYWxTdGF0ZShwYXRoLCBzb3VyY2UpIHtcbiAgICB2YXIgaSA9IDBcbiAgICB3aGlsZSAoaSA8IHBhdGgubGVuZ3RoKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2VbcGF0aFtpKytdXVxuICAgIH1cbiAgICByZXR1cm4gc291cmNlXG4gIH1cblxuICBmdW5jdGlvbiB3aXJlU3RhdGVUb0FjdGlvbnMocGF0aCwgc3RhdGUsIGFjdGlvbnMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gYWN0aW9ucykge1xuICAgICAgdHlwZW9mIGFjdGlvbnNba2V5XSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgID8gKGZ1bmN0aW9uKGtleSwgYWN0aW9uKSB7XG4gICAgICAgICAgICBhY3Rpb25zW2tleV0gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhY3Rpb24oZGF0YSlcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0KGdldFBhcnRpYWxTdGF0ZShwYXRoLCBnbG9iYWxTdGF0ZSksIGFjdGlvbnMpXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcmVzdWx0ICYmXG4gICAgICAgICAgICAgICAgcmVzdWx0ICE9PSAoc3RhdGUgPSBnZXRQYXJ0aWFsU3RhdGUocGF0aCwgZ2xvYmFsU3RhdGUpKSAmJlxuICAgICAgICAgICAgICAgICFyZXN1bHQudGhlbiAvLyAhaXNQcm9taXNlXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVuZGVyKFxuICAgICAgICAgICAgICAgICAgKGdsb2JhbFN0YXRlID0gc2V0UGFydGlhbFN0YXRlKFxuICAgICAgICAgICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgICAgICAgICBjbG9uZShzdGF0ZSwgcmVzdWx0KSxcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsU3RhdGVcbiAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKGtleSwgYWN0aW9uc1trZXldKVxuICAgICAgICA6IHdpcmVTdGF0ZVRvQWN0aW9ucyhcbiAgICAgICAgICAgIHBhdGguY29uY2F0KGtleSksXG4gICAgICAgICAgICAoc3RhdGVba2V5XSA9IGNsb25lKHN0YXRlW2tleV0pKSxcbiAgICAgICAgICAgIChhY3Rpb25zW2tleV0gPSBjbG9uZShhY3Rpb25zW2tleV0pKVxuICAgICAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9uc1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0S2V5KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSA/IG5vZGUua2V5IDogbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24gZXZlbnRMaXN0ZW5lcihldmVudCkge1xuICAgIHJldHVybiBldmVudC5jdXJyZW50VGFyZ2V0LmV2ZW50c1tldmVudC50eXBlXShldmVudClcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZShlbGVtZW50LCBuYW1lLCB2YWx1ZSwgb2xkVmFsdWUsIGlzU3ZnKSB7XG4gICAgaWYgKG5hbWUgPT09IFwia2V5XCIpIHtcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09IFwic3R5bGVcIikge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSB2YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvbGRWYWx1ZSA9PT0gXCJzdHJpbmdcIikgb2xkVmFsdWUgPSBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiXG4gICAgICAgIGZvciAodmFyIGkgaW4gY2xvbmUob2xkVmFsdWUsIHZhbHVlKSkge1xuICAgICAgICAgIHZhciBzdHlsZSA9IHZhbHVlID09IG51bGwgfHwgdmFsdWVbaV0gPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZVtpXVxuICAgICAgICAgIGlmIChpWzBdID09PSBcIi1cIikge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShpLCBzdHlsZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtpXSA9IHN0eWxlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuYW1lWzBdID09PSBcIm9cIiAmJiBuYW1lWzFdID09PSBcIm5cIikge1xuICAgICAgICBuYW1lID0gbmFtZS5zbGljZSgyKVxuXG4gICAgICAgIGlmIChlbGVtZW50LmV2ZW50cykge1xuICAgICAgICAgIGlmICghb2xkVmFsdWUpIG9sZFZhbHVlID0gZWxlbWVudC5ldmVudHNbbmFtZV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LmV2ZW50cyA9IHt9XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LmV2ZW50c1tuYW1lXSA9IHZhbHVlXG5cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudExpc3RlbmVyKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBuYW1lIGluIGVsZW1lbnQgJiZcbiAgICAgICAgbmFtZSAhPT0gXCJsaXN0XCIgJiZcbiAgICAgICAgbmFtZSAhPT0gXCJ0eXBlXCIgJiZcbiAgICAgICAgbmFtZSAhPT0gXCJkcmFnZ2FibGVcIiAmJlxuICAgICAgICBuYW1lICE9PSBcInNwZWxsY2hlY2tcIiAmJlxuICAgICAgICBuYW1lICE9PSBcInRyYW5zbGF0ZVwiICYmXG4gICAgICAgICFpc1N2Z1xuICAgICAgKSB7XG4gICAgICAgIGVsZW1lbnRbbmFtZV0gPSB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlXG4gICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKVxuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KG5vZGUsIGlzU3ZnKSB7XG4gICAgdmFyIGVsZW1lbnQgPVxuICAgICAgdHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIG5vZGUgPT09IFwibnVtYmVyXCJcbiAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShub2RlKVxuICAgICAgICA6IChpc1N2ZyA9IGlzU3ZnIHx8IG5vZGUubm9kZU5hbWUgPT09IFwic3ZnXCIpXG4gICAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICAgICAgbm9kZS5ub2RlTmFtZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5vZGVOYW1lKVxuXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXNcbiAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgaWYgKGF0dHJpYnV0ZXMub25jcmVhdGUpIHtcbiAgICAgICAgbGlmZWN5Y2xlLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5vbmNyZWF0ZShlbGVtZW50KVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgICBjcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgKG5vZGUuY2hpbGRyZW5baV0gPSByZXNvbHZlTm9kZShub2RlLmNoaWxkcmVuW2ldKSksXG4gICAgICAgICAgICBpc1N2Z1xuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBuYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdXBkYXRlQXR0cmlidXRlKGVsZW1lbnQsIG5hbWUsIGF0dHJpYnV0ZXNbbmFtZV0sIG51bGwsIGlzU3ZnKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVFbGVtZW50KGVsZW1lbnQsIG9sZEF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMsIGlzU3ZnKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBjbG9uZShvbGRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSkge1xuICAgICAgaWYgKFxuICAgICAgICBhdHRyaWJ1dGVzW25hbWVdICE9PVxuICAgICAgICAobmFtZSA9PT0gXCJ2YWx1ZVwiIHx8IG5hbWUgPT09IFwiY2hlY2tlZFwiXG4gICAgICAgICAgPyBlbGVtZW50W25hbWVdXG4gICAgICAgICAgOiBvbGRBdHRyaWJ1dGVzW25hbWVdKVxuICAgICAgKSB7XG4gICAgICAgIHVwZGF0ZUF0dHJpYnV0ZShcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgYXR0cmlidXRlc1tuYW1lXSxcbiAgICAgICAgICBvbGRBdHRyaWJ1dGVzW25hbWVdLFxuICAgICAgICAgIGlzU3ZnXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2IgPSBpc1JlY3ljbGluZyA/IGF0dHJpYnV0ZXMub25jcmVhdGUgOiBhdHRyaWJ1dGVzLm9udXBkYXRlXG4gICAgaWYgKGNiKSB7XG4gICAgICBsaWZlY3ljbGUucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgY2IoZWxlbWVudCwgb2xkQXR0cmlidXRlcylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4oZWxlbWVudCwgbm9kZSkge1xuICAgIHZhciBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzXG4gICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICByZW1vdmVDaGlsZHJlbihlbGVtZW50LmNoaWxkTm9kZXNbaV0sIG5vZGUuY2hpbGRyZW5baV0pXG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzLm9uZGVzdHJveSkge1xuICAgICAgICBhdHRyaWJ1dGVzLm9uZGVzdHJveShlbGVtZW50KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudFxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChwYXJlbnQsIGVsZW1lbnQsIG5vZGUpIHtcbiAgICBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHJlbW92ZUNoaWxkcmVuKGVsZW1lbnQsIG5vZGUpKVxuICAgIH1cblxuICAgIHZhciBjYiA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXMub25yZW1vdmVcbiAgICBpZiAoY2IpIHtcbiAgICAgIGNiKGVsZW1lbnQsIGRvbmUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbmUoKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdGNoKHBhcmVudCwgZWxlbWVudCwgb2xkTm9kZSwgbm9kZSwgaXNTdmcpIHtcbiAgICBpZiAobm9kZSA9PT0gb2xkTm9kZSkge1xuICAgIH0gZWxzZSBpZiAob2xkTm9kZSA9PSBudWxsIHx8IG9sZE5vZGUubm9kZU5hbWUgIT09IG5vZGUubm9kZU5hbWUpIHtcbiAgICAgIHZhciBuZXdFbGVtZW50ID0gY3JlYXRlRWxlbWVudChub2RlLCBpc1N2ZylcbiAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobmV3RWxlbWVudCwgZWxlbWVudClcblxuICAgICAgaWYgKG9sZE5vZGUgIT0gbnVsbCkge1xuICAgICAgICByZW1vdmVFbGVtZW50KHBhcmVudCwgZWxlbWVudCwgb2xkTm9kZSlcbiAgICAgIH1cblxuICAgICAgZWxlbWVudCA9IG5ld0VsZW1lbnRcbiAgICB9IGVsc2UgaWYgKG9sZE5vZGUubm9kZU5hbWUgPT0gbnVsbCkge1xuICAgICAgZWxlbWVudC5ub2RlVmFsdWUgPSBub2RlXG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZUVsZW1lbnQoXG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIG9sZE5vZGUuYXR0cmlidXRlcyxcbiAgICAgICAgbm9kZS5hdHRyaWJ1dGVzLFxuICAgICAgICAoaXNTdmcgPSBpc1N2ZyB8fCBub2RlLm5vZGVOYW1lID09PSBcInN2Z1wiKVxuICAgICAgKVxuXG4gICAgICB2YXIgb2xkS2V5ZWQgPSB7fVxuICAgICAgdmFyIG5ld0tleWVkID0ge31cbiAgICAgIHZhciBvbGRFbGVtZW50cyA9IFtdXG4gICAgICB2YXIgb2xkQ2hpbGRyZW4gPSBvbGROb2RlLmNoaWxkcmVuXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuXG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb2xkRWxlbWVudHNbaV0gPSBlbGVtZW50LmNoaWxkTm9kZXNbaV1cblxuICAgICAgICB2YXIgb2xkS2V5ID0gZ2V0S2V5KG9sZENoaWxkcmVuW2ldKVxuICAgICAgICBpZiAob2xkS2V5ICE9IG51bGwpIHtcbiAgICAgICAgICBvbGRLZXllZFtvbGRLZXldID0gW29sZEVsZW1lbnRzW2ldLCBvbGRDaGlsZHJlbltpXV1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaSA9IDBcbiAgICAgIHZhciBrID0gMFxuXG4gICAgICB3aGlsZSAoayA8IGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICB2YXIgb2xkS2V5ID0gZ2V0S2V5KG9sZENoaWxkcmVuW2ldKVxuICAgICAgICB2YXIgbmV3S2V5ID0gZ2V0S2V5KChjaGlsZHJlbltrXSA9IHJlc29sdmVOb2RlKGNoaWxkcmVuW2tdKSkpXG5cbiAgICAgICAgaWYgKG5ld0tleWVkW29sZEtleV0pIHtcbiAgICAgICAgICBpKytcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0tleSAhPSBudWxsICYmIG5ld0tleSA9PT0gZ2V0S2V5KG9sZENoaWxkcmVuW2kgKyAxXSkpIHtcbiAgICAgICAgICBpZiAob2xkS2V5ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJlbW92ZUVsZW1lbnQoZWxlbWVudCwgb2xkRWxlbWVudHNbaV0sIG9sZENoaWxkcmVuW2ldKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpKytcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0tleSA9PSBudWxsIHx8IGlzUmVjeWNsaW5nKSB7XG4gICAgICAgICAgaWYgKG9sZEtleSA9PSBudWxsKSB7XG4gICAgICAgICAgICBwYXRjaChlbGVtZW50LCBvbGRFbGVtZW50c1tpXSwgb2xkQ2hpbGRyZW5baV0sIGNoaWxkcmVuW2tdLCBpc1N2ZylcbiAgICAgICAgICAgIGsrK1xuICAgICAgICAgIH1cbiAgICAgICAgICBpKytcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIga2V5ZWROb2RlID0gb2xkS2V5ZWRbbmV3S2V5XSB8fCBbXVxuXG4gICAgICAgICAgaWYgKG9sZEtleSA9PT0gbmV3S2V5KSB7XG4gICAgICAgICAgICBwYXRjaChlbGVtZW50LCBrZXllZE5vZGVbMF0sIGtleWVkTm9kZVsxXSwgY2hpbGRyZW5ba10sIGlzU3ZnKVxuICAgICAgICAgICAgaSsrXG4gICAgICAgICAgfSBlbHNlIGlmIChrZXllZE5vZGVbMF0pIHtcbiAgICAgICAgICAgIHBhdGNoKFxuICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICBlbGVtZW50Lmluc2VydEJlZm9yZShrZXllZE5vZGVbMF0sIG9sZEVsZW1lbnRzW2ldKSxcbiAgICAgICAgICAgICAga2V5ZWROb2RlWzFdLFxuICAgICAgICAgICAgICBjaGlsZHJlbltrXSxcbiAgICAgICAgICAgICAgaXNTdmdcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0Y2goZWxlbWVudCwgb2xkRWxlbWVudHNbaV0sIG51bGwsIGNoaWxkcmVuW2tdLCBpc1N2ZylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXdLZXllZFtuZXdLZXldID0gY2hpbGRyZW5ba11cbiAgICAgICAgICBrKytcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB3aGlsZSAoaSA8IG9sZENoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBpZiAoZ2V0S2V5KG9sZENoaWxkcmVuW2ldKSA9PSBudWxsKSB7XG4gICAgICAgICAgcmVtb3ZlRWxlbWVudChlbGVtZW50LCBvbGRFbGVtZW50c1tpXSwgb2xkQ2hpbGRyZW5baV0pXG4gICAgICAgIH1cbiAgICAgICAgaSsrXG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgaW4gb2xkS2V5ZWQpIHtcbiAgICAgICAgaWYgKCFuZXdLZXllZFtpXSkge1xuICAgICAgICAgIHJlbW92ZUVsZW1lbnQoZWxlbWVudCwgb2xkS2V5ZWRbaV1bMF0sIG9sZEtleWVkW2ldWzFdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50XG4gIH1cbn1cbiIsInZhciB3YXJuID0gXCJvZmZsaW5lLXBsdWdpbjogcnVudGltZSB3YXMgaW5zdGFsbGVkIHdpdGhvdXQgT2ZmbGluZVBsdWdpbiBiZWluZyBhZGRlZCB0byB0aGUgd2VicGFjay5jb25maWcuanMuIFNlZSBodHRwczovL2dvby5nbC8yQ2E3Tk8gZm9yIGRldGFpbHMuXCI7XG5cbmlmICh3aW5kb3cuY29uc29sZSkge1xuICBpZiAoY29uc29sZS5pbmZvKSB7XG4gICAgY29uc29sZS5pbmZvKHdhcm4pO1xuICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nKSB7XG4gICAgY29uc29sZS5sb2cod2Fybik7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24oKSB7fTtcbmV4cG9ydHMuYXBwbHlVcGRhdGUgPSBmdW5jdGlvbigpIHt9O1xuZXhwb3J0cy51cGRhdGUgPSBmdW5jdGlvbigpIHt9OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWxNb2R1bGUpIHtcblx0aWYgKCFvcmlnaW5hbE1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHR2YXIgbW9kdWxlID0gT2JqZWN0LmNyZWF0ZShvcmlnaW5hbE1vZHVsZSk7XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiZXhwb3J0c1wiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iLCJpbXBvcnQgeyBBY3Rpb25zVHlwZSB9IGZyb20gJ2h5cGVyYXBwJztcblxuY29uc3QgYWN0aW9uczogQWN0aW9uc1R5cGU8Q291bnRlci5JU3RhdGUsIENvdW50ZXIuSUFjdGlvbnM+ID0ge1xuICAgIGRvd246ICgpID0+ICh7IGNvdW50IH0pID0+ICh7IGNvdW50OiBjb3VudCAtIDEgfSksXG4gICAgcmVzZXQ6ICgpID0+ICh7IGNvdW50OiAwIH0pLFxuICAgIHVwOiAoKSA9PiAoeyBjb3VudCB9KSA9PiAoeyBjb3VudDogY291bnQgKyAxIH0pLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWN0aW9ucztcbiIsImltcG9ydCB7IGRpdiwgYnV0dG9uLCBoMSB9IGZyb20gJ0BoeXBlcmFwcC9odG1sJztcblxuY29uc3QgY291bnRlciA9ICh7IGNvdW50IH0sIHsgdXAsIGRvd24sIHJlc2V0IH0pID0+IHtcbiAgICByZXR1cm4gZGl2KHsgY2xhc3M6ICdjb3VudGVyLWdyaWQnIH0sIFtcbiAgICAgICAgaDEoeyBjbGFzczogJ2NvdW50ZXItaGVhZGVyJyB9LCBjb3VudCksXG4gICAgICAgIGRpdih7IGNsYXNzOiAnYnV0dG9uLWNvbnRhaW5lcicgfSwgW1xuICAgICAgICAgICAgYnV0dG9uKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb3duKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLScsXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgYnV0dG9uKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1xcdTI3RjInLCAvLyDin7JcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBidXR0b24oXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnKycsXG4gICAgICAgICAgICApLFxuICAgICAgICBdKSxcbiAgICBdKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvdW50ZXI7XG5leHBvcnQgeyBjb3VudGVyIH07XG4iLCJpbXBvcnQgeyBhcHAgfSBmcm9tICdoeXBlcmFwcCc7XG5cbmltcG9ydCBzdGF0ZSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgdmlldyBmcm9tICcuL21haW4nO1xuXG4vLyBlbGVtZW50IHRvIGJpbmQgYXBwIHRvXG5jb25zdCBiaW5kVG8gPSBkb2N1bWVudC5ib2R5O1xuXG4vLyByZW5kZXIgYXBwXG5hcHAoc3RhdGUsIGFjdGlvbnMsIHZpZXcsIGJpbmRUbyk7XG4iLCJpbXBvcnQgeyBWaWV3IH0gZnJvbSAnaHlwZXJhcHAnO1xuaW1wb3J0IHsgZGl2IH0gZnJvbSAnQGh5cGVyYXBwL2h0bWwnO1xuaW1wb3J0IGNvdW50ZXIgZnJvbSAnLi9jb21wb25lbnRzL2NvdW50ZXIuY29tcG9uZW50JztcblxuY29uc3QgbWFpblZpZXc6IFZpZXc8Q291bnRlci5JU3RhdGUsIENvdW50ZXIuSUFjdGlvbnM+ID0gKHN0YXRlLCBhY3Rpb25zKSA9PiBkaXYoeyBpZDogJ2FwcCcgfSwgW2NvdW50ZXIoc3RhdGUsIGFjdGlvbnMpXSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1haW5WaWV3O1xuIiwiY29uc3Qgc3RhdGU6IENvdW50ZXIuSVN0YXRlID0ge1xuICAgIGNvdW50OiAwLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc3RhdGU7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbiAgICBpZihtb2R1bGUuaG90KSB7XG4gICAgICAvLyAxNTUwNjY0NDc4Mjc0XG4gICAgICB2YXIgY3NzUmVsb2FkID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWhvdC1sb2FkZXIvaG90TW9kdWxlUmVwbGFjZW1lbnQuanNcIikobW9kdWxlLmlkLCB7XCJmaWxlTWFwXCI6XCJ7ZmlsZU5hbWV9XCJ9KTtcbiAgICAgIG1vZHVsZS5ob3QuZGlzcG9zZShjc3NSZWxvYWQpO1xuICAgICAgbW9kdWxlLmhvdC5hY2NlcHQodW5kZWZpbmVkLCBjc3NSZWxvYWQpOztcbiAgICB9XG4gICIsImltcG9ydCAnLi9hcHAucGNzcyc7XG4iLCJpbXBvcnQgKiBhcyBPZmZsaW5lUGx1Z2luUnVudGltZSBmcm9tICdvZmZsaW5lLXBsdWdpbi9ydW50aW1lJztcblxuLy8gaW1wb3J0IGNzc1xuaW1wb3J0ICcuL2Nzcyc7XG5cbi8vIGltcG9ydCBhcHBcbmltcG9ydCAnLi9hcHAnO1xuXG4vLyBzZXJ2aWNlIHdvcmtlclxuT2ZmbGluZVBsdWdpblJ1bnRpbWUuaW5zdGFsbCgpO1xuXG4vLyBhY2NlcHQgSE1SXG5pZiAobW9kdWxlICYmIG1vZHVsZS5ob3QpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==