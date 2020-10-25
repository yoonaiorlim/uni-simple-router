/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Router"] = factory();
	else
		root["Router"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/path-to-regexp/index.js":
/*!**********************************************!*\
  !*** ./node_modules/path-to-regexp/index.js ***!
  \**********************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var isarray = __webpack_require__(/*! isarray */ \"./node_modules/path-to-regexp/node_modules/isarray/index.js\")\n\n/**\n * Expose `pathToRegexp`.\n */\nmodule.exports = pathToRegexp\nmodule.exports.parse = parse\nmodule.exports.compile = compile\nmodule.exports.tokensToFunction = tokensToFunction\nmodule.exports.tokensToRegExp = tokensToRegExp\n\n/**\n * The main path matching regexp utility.\n *\n * @type {RegExp}\n */\nvar PATH_REGEXP = new RegExp([\n  // Match escaped characters that would otherwise appear in future matches.\n  // This allows the user to escape special characters that won't transform.\n  '(\\\\\\\\.)',\n  // Match Express-style parameters and un-named parameters with a prefix\n  // and optional suffixes. Matches appear as:\n  //\n  // \"/:test(\\\\d+)?\" => [\"/\", \"test\", \"\\d+\", undefined, \"?\", undefined]\n  // \"/route(\\\\d+)\"  => [undefined, undefined, undefined, \"\\d+\", undefined, undefined]\n  // \"/*\"            => [\"/\", undefined, undefined, undefined, undefined, \"*\"]\n  '([\\\\/.])?(?:(?:\\\\:(\\\\w+)(?:\\\\(((?:\\\\\\\\.|[^\\\\\\\\()])+)\\\\))?|\\\\(((?:\\\\\\\\.|[^\\\\\\\\()])+)\\\\))([+*?])?|(\\\\*))'\n].join('|'), 'g')\n\n/**\n * Parse a string for the raw tokens.\n *\n * @param  {string}  str\n * @param  {Object=} options\n * @return {!Array}\n */\nfunction parse (str, options) {\n  var tokens = []\n  var key = 0\n  var index = 0\n  var path = ''\n  var defaultDelimiter = options && options.delimiter || '/'\n  var res\n\n  while ((res = PATH_REGEXP.exec(str)) != null) {\n    var m = res[0]\n    var escaped = res[1]\n    var offset = res.index\n    path += str.slice(index, offset)\n    index = offset + m.length\n\n    // Ignore already escaped sequences.\n    if (escaped) {\n      path += escaped[1]\n      continue\n    }\n\n    var next = str[index]\n    var prefix = res[2]\n    var name = res[3]\n    var capture = res[4]\n    var group = res[5]\n    var modifier = res[6]\n    var asterisk = res[7]\n\n    // Push the current path onto the tokens.\n    if (path) {\n      tokens.push(path)\n      path = ''\n    }\n\n    var partial = prefix != null && next != null && next !== prefix\n    var repeat = modifier === '+' || modifier === '*'\n    var optional = modifier === '?' || modifier === '*'\n    var delimiter = res[2] || defaultDelimiter\n    var pattern = capture || group\n\n    tokens.push({\n      name: name || key++,\n      prefix: prefix || '',\n      delimiter: delimiter,\n      optional: optional,\n      repeat: repeat,\n      partial: partial,\n      asterisk: !!asterisk,\n      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')\n    })\n  }\n\n  // Match any characters still remaining.\n  if (index < str.length) {\n    path += str.substr(index)\n  }\n\n  // If the path exists, push it onto the end.\n  if (path) {\n    tokens.push(path)\n  }\n\n  return tokens\n}\n\n/**\n * Compile a string to a template function for the path.\n *\n * @param  {string}             str\n * @param  {Object=}            options\n * @return {!function(Object=, Object=)}\n */\nfunction compile (str, options) {\n  return tokensToFunction(parse(str, options), options)\n}\n\n/**\n * Prettier encoding of URI path segments.\n *\n * @param  {string}\n * @return {string}\n */\nfunction encodeURIComponentPretty (str) {\n  return encodeURI(str).replace(/[\\/?#]/g, function (c) {\n    return '%' + c.charCodeAt(0).toString(16).toUpperCase()\n  })\n}\n\n/**\n * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.\n *\n * @param  {string}\n * @return {string}\n */\nfunction encodeAsterisk (str) {\n  return encodeURI(str).replace(/[?#]/g, function (c) {\n    return '%' + c.charCodeAt(0).toString(16).toUpperCase()\n  })\n}\n\n/**\n * Expose a method for transforming tokens into the path function.\n */\nfunction tokensToFunction (tokens, options) {\n  // Compile all the tokens into regexps.\n  var matches = new Array(tokens.length)\n\n  // Compile all the patterns before compilation.\n  for (var i = 0; i < tokens.length; i++) {\n    if (typeof tokens[i] === 'object') {\n      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options))\n    }\n  }\n\n  return function (obj, opts) {\n    var path = ''\n    var data = obj || {}\n    var options = opts || {}\n    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent\n\n    for (var i = 0; i < tokens.length; i++) {\n      var token = tokens[i]\n\n      if (typeof token === 'string') {\n        path += token\n\n        continue\n      }\n\n      var value = data[token.name]\n      var segment\n\n      if (value == null) {\n        if (token.optional) {\n          // Prepend partial segment prefixes.\n          if (token.partial) {\n            path += token.prefix\n          }\n\n          continue\n        } else {\n          throw new TypeError('Expected \"' + token.name + '\" to be defined')\n        }\n      }\n\n      if (isarray(value)) {\n        if (!token.repeat) {\n          throw new TypeError('Expected \"' + token.name + '\" to not repeat, but received `' + JSON.stringify(value) + '`')\n        }\n\n        if (value.length === 0) {\n          if (token.optional) {\n            continue\n          } else {\n            throw new TypeError('Expected \"' + token.name + '\" to not be empty')\n          }\n        }\n\n        for (var j = 0; j < value.length; j++) {\n          segment = encode(value[j])\n\n          if (!matches[i].test(segment)) {\n            throw new TypeError('Expected all \"' + token.name + '\" to match \"' + token.pattern + '\", but received `' + JSON.stringify(segment) + '`')\n          }\n\n          path += (j === 0 ? token.prefix : token.delimiter) + segment\n        }\n\n        continue\n      }\n\n      segment = token.asterisk ? encodeAsterisk(value) : encode(value)\n\n      if (!matches[i].test(segment)) {\n        throw new TypeError('Expected \"' + token.name + '\" to match \"' + token.pattern + '\", but received \"' + segment + '\"')\n      }\n\n      path += token.prefix + segment\n    }\n\n    return path\n  }\n}\n\n/**\n * Escape a regular expression string.\n *\n * @param  {string} str\n * @return {string}\n */\nfunction escapeString (str) {\n  return str.replace(/([.+*?=^!:${}()[\\]|\\/\\\\])/g, '\\\\$1')\n}\n\n/**\n * Escape the capturing group by escaping special characters and meaning.\n *\n * @param  {string} group\n * @return {string}\n */\nfunction escapeGroup (group) {\n  return group.replace(/([=!:$\\/()])/g, '\\\\$1')\n}\n\n/**\n * Attach the keys as a property of the regexp.\n *\n * @param  {!RegExp} re\n * @param  {Array}   keys\n * @return {!RegExp}\n */\nfunction attachKeys (re, keys) {\n  re.keys = keys\n  return re\n}\n\n/**\n * Get the flags for a regexp from the options.\n *\n * @param  {Object} options\n * @return {string}\n */\nfunction flags (options) {\n  return options && options.sensitive ? '' : 'i'\n}\n\n/**\n * Pull out keys from a regexp.\n *\n * @param  {!RegExp} path\n * @param  {!Array}  keys\n * @return {!RegExp}\n */\nfunction regexpToRegexp (path, keys) {\n  // Use a negative lookahead to match only capturing groups.\n  var groups = path.source.match(/\\((?!\\?)/g)\n\n  if (groups) {\n    for (var i = 0; i < groups.length; i++) {\n      keys.push({\n        name: i,\n        prefix: null,\n        delimiter: null,\n        optional: false,\n        repeat: false,\n        partial: false,\n        asterisk: false,\n        pattern: null\n      })\n    }\n  }\n\n  return attachKeys(path, keys)\n}\n\n/**\n * Transform an array into a regexp.\n *\n * @param  {!Array}  path\n * @param  {Array}   keys\n * @param  {!Object} options\n * @return {!RegExp}\n */\nfunction arrayToRegexp (path, keys, options) {\n  var parts = []\n\n  for (var i = 0; i < path.length; i++) {\n    parts.push(pathToRegexp(path[i], keys, options).source)\n  }\n\n  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))\n\n  return attachKeys(regexp, keys)\n}\n\n/**\n * Create a path regexp from string input.\n *\n * @param  {string}  path\n * @param  {!Array}  keys\n * @param  {!Object} options\n * @return {!RegExp}\n */\nfunction stringToRegexp (path, keys, options) {\n  return tokensToRegExp(parse(path, options), keys, options)\n}\n\n/**\n * Expose a function for taking tokens and returning a RegExp.\n *\n * @param  {!Array}          tokens\n * @param  {(Array|Object)=} keys\n * @param  {Object=}         options\n * @return {!RegExp}\n */\nfunction tokensToRegExp (tokens, keys, options) {\n  if (!isarray(keys)) {\n    options = /** @type {!Object} */ (keys || options)\n    keys = []\n  }\n\n  options = options || {}\n\n  var strict = options.strict\n  var end = options.end !== false\n  var route = ''\n\n  // Iterate over the tokens and create our regexp string.\n  for (var i = 0; i < tokens.length; i++) {\n    var token = tokens[i]\n\n    if (typeof token === 'string') {\n      route += escapeString(token)\n    } else {\n      var prefix = escapeString(token.prefix)\n      var capture = '(?:' + token.pattern + ')'\n\n      keys.push(token)\n\n      if (token.repeat) {\n        capture += '(?:' + prefix + capture + ')*'\n      }\n\n      if (token.optional) {\n        if (!token.partial) {\n          capture = '(?:' + prefix + '(' + capture + '))?'\n        } else {\n          capture = prefix + '(' + capture + ')?'\n        }\n      } else {\n        capture = prefix + '(' + capture + ')'\n      }\n\n      route += capture\n    }\n  }\n\n  var delimiter = escapeString(options.delimiter || '/')\n  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter\n\n  // In non-strict mode we allow a slash at the end of match. If the path to\n  // match already ends with a slash, we remove it for consistency. The slash\n  // is valid at the end of a path match, not in the middle. This is important\n  // in non-ending mode, where \"/test/\" shouldn't match \"/test//route\".\n  if (!strict) {\n    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'\n  }\n\n  if (end) {\n    route += '$'\n  } else {\n    // In non-ending mode, we need the capturing groups to match as much as\n    // possible by using a positive lookahead to the end or next path segment.\n    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'\n  }\n\n  return attachKeys(new RegExp('^' + route, flags(options)), keys)\n}\n\n/**\n * Normalize the given path string, returning a regular expression.\n *\n * An empty array can be passed in for the keys, which will hold the\n * placeholder key descriptions. For example, using `/user/:id`, `keys` will\n * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.\n *\n * @param  {(string|RegExp|Array)} path\n * @param  {(Array|Object)=}       keys\n * @param  {Object=}               options\n * @return {!RegExp}\n */\nfunction pathToRegexp (path, keys, options) {\n  if (!isarray(keys)) {\n    options = /** @type {!Object} */ (keys || options)\n    keys = []\n  }\n\n  options = options || {}\n\n  if (path instanceof RegExp) {\n    return regexpToRegexp(path, /** @type {!Array} */ (keys))\n  }\n\n  if (isarray(path)) {\n    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)\n  }\n\n  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)\n}\n\n\n//# sourceURL=webpack://Router/./node_modules/path-to-regexp/index.js?");

/***/ }),

/***/ "./node_modules/path-to-regexp/node_modules/isarray/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/path-to-regexp/node_modules/isarray/index.js ***!
  \*******************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = Array.isArray || function (arr) {\n  return Object.prototype.toString.call(arr) == '[object Array]';\n};\n\n\n//# sourceURL=webpack://Router/./node_modules/path-to-regexp/node_modules/isarray/index.js?");

/***/ }),

/***/ "./src/H5/buildRouter.ts":
/*!*******************************!*\
  !*** ./src/H5/buildRouter.ts ***!
  \*******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.buildVueRouter = exports.buildVueRoutes = void 0;\r\nvar warn_1 = __webpack_require__(/*! ../helpers/warn */ \"./src/helpers/warn.ts\");\r\nvar utils_1 = __webpack_require__(/*! ../helpers/utils */ \"./src/helpers/utils.ts\");\r\nfunction buildVueRoutes(router, vueRouteMap) {\r\n    var _a = router.routesMap, pathMap = _a.pathMap, finallyPathList = _a.finallyPathList;\r\n    var vueRoutePathList = Object.keys(vueRouteMap);\r\n    var h5Options = router.options.h5;\r\n    for (var i = 0; i < vueRoutePathList.length; i++) {\r\n        var path = vueRoutePathList[i];\r\n        var myRoute = pathMap[path];\r\n        var vueRoute = vueRouteMap[path];\r\n        if (!myRoute) {\r\n            warn_1.warn(path + \" \\u8DEF\\u7531\\u5730\\u5740\\u5728\\u8DEF\\u7531\\u8868\\u4E2D\\u672A\\u627E\\u5230\\uFF0C\\u786E\\u5B9A\\u662F\\u5426\\u4F20\\u9012\\u6F0F\\u5566\", router, true);\r\n        }\r\n        else {\r\n            var _b = utils_1.getRoutePath(myRoute), finallyPath = _b.finallyPath, alias = _b.alias;\r\n            if (finallyPath instanceof Array) {\r\n                throw new Error(\"\\u975E vueRouterDev \\u6A21\\u5F0F\\u4E0B\\uFF0Calias\\u3001aliasPath\\u3001path \\u65E0\\u6CD5\\u63D0\\u4F9B\\u6570\\u7EC4\\u7C7B\\u578B\\uFF01 \" + JSON.stringify(myRoute));\r\n            }\r\n            if (myRoute.name != null) {\r\n                vueRoute.name = myRoute.name;\r\n            }\r\n            if (h5Options.aliasCoverPath) {\r\n                vueRoute['path'] = finallyPath;\r\n            }\r\n            else {\r\n                if (alias != null) {\r\n                    vueRoute['alias'] = alias;\r\n                }\r\n            }\r\n            var beforeEnter = myRoute.beforeEnter;\r\n            if (beforeEnter) {\r\n                vueRoute['beforeEnter'] = beforeEnter;\r\n            }\r\n        }\r\n    }\r\n    if (finallyPathList.includes('*')) {\r\n        vueRouteMap['*'] = pathMap['*'];\r\n    }\r\n    return vueRouteMap;\r\n}\r\nexports.buildVueRoutes = buildVueRoutes;\r\nfunction buildVueRouter(router, vueRouter, vueRouteMap) {\r\n    var routes = Object.values(vueRouteMap);\r\n    // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465\r\n    var newVueRouter = new vueRouter.constructor(__assign(__assign({}, router.options.h5), { routes: routes }));\r\n    vueRouter.matcher = newVueRouter.matcher;\r\n    console.log('实例化完成');\r\n    // const [mount] = router.mount;\r\n    // if (mount == null) {\r\n    //     throw new Error(`你真的不需要挂载实例吗？要不要试试\\r\\n\\r\\n RouterMount(Vim:any, router:Router, el:string | undefined = '#app') :void|never \\r\\n`);\r\n    // }\r\n    // mount.app.$mount();\r\n}\r\nexports.buildVueRouter = buildVueRouter;\r\n\n\n//# sourceURL=webpack://Router/./src/H5/buildRouter.ts?");

/***/ }),

/***/ "./src/H5/proxyHook.ts":
/*!*****************************!*\
  !*** ./src/H5/proxyHook.ts ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__ */
/***/ (function(__unused_webpack_module, exports) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.proxyH5Mount = exports.proxyEachHook = exports.MyArray = void 0;\r\nvar MyArray = /** @class */ (function (_super) {\r\n    __extends(MyArray, _super);\r\n    function MyArray(router, vueEachArray, myEachHook) {\r\n        var _this = _super.call(this) || this;\r\n        _this.router = router;\r\n        _this.vueEachArray = vueEachArray;\r\n        _this.myEachHook = myEachHook;\r\n        Object.setPrototypeOf(_this, MyArray.prototype);\r\n        return _this;\r\n    }\r\n    MyArray.prototype.push = function (v) {\r\n        var _this = this;\r\n        this.vueEachArray.splice(0, 1, v);\r\n        this[this.length] = function (to, from, next) {\r\n            _this.myEachHook(to, from, next, _this.router, true);\r\n        };\r\n    };\r\n    return MyArray;\r\n}(Array));\r\nexports.MyArray = MyArray;\r\nfunction proxyEachHook(router, vueRouter) {\r\n    var hookList = ['beforeHooks', 'afterHooks'];\r\n    for (var i = 0; i < hookList.length; i++) {\r\n        var hookName = hookList[i];\r\n        var myEachHook = router.lifeCycle[hookName][0];\r\n        if (myEachHook) {\r\n            var vueEachArray = vueRouter[hookName];\r\n            vueRouter[hookName] = new MyArray(router, vueEachArray, myEachHook);\r\n        }\r\n    }\r\n}\r\nexports.proxyEachHook = proxyEachHook;\r\nfunction proxyH5Mount(Vim, router) {\r\n    var vueRouter = router.$route;\r\n    vueRouter.replace(vueRouter.currentRoute.fullPath, function (to) {\r\n        Vim.$mount();\r\n    }, function (abort) {\r\n        console.log(abort);\r\n    });\r\n}\r\nexports.proxyH5Mount = proxyH5Mount;\r\n\n\n//# sourceURL=webpack://Router/./src/H5/proxyHook.ts?");

/***/ }),

/***/ "./src/helpers/config.ts":
/*!*******************************!*\
  !*** ./src/helpers/config.ts ***!
  \*******************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export baseConfig [provided] [no usage info] [missing usage info prevents renaming] */
/*! export lifeCycle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export mpPlatformReg [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.lifeCycle = exports.baseConfig = exports.mpPlatformReg = void 0;\r\nvar types_1 = __webpack_require__(/*! ../types */ \"./src/types/index.ts\");\r\nvar warn_1 = __webpack_require__(/*! ./warn */ \"./src/helpers/warn.ts\");\r\nexports.mpPlatformReg = /(^mp-weixin$)|(^mp-baidu$)|(^mp-alipay$)|(^mp-toutiao$)|(^mp-qq$)|(^mp-360$)/g;\r\nexports.baseConfig = {\r\n    platform: 'h5',\r\n    h5: {\r\n        aliasCoverPath: false,\r\n        rewriteFun: true,\r\n        paramsToQuery: false,\r\n        loading: true,\r\n        vueRouterDev: false,\r\n        useUniConfig: true,\r\n        keepUniIntercept: false,\r\n        vueNext: false,\r\n        replaceStyle: false,\r\n        resetStyle: function () { return JSON.parse('{}'); },\r\n        mode: 'hash',\r\n        base: '/',\r\n        linkActiveClass: 'router-link-active',\r\n        linkExactActiveClass: 'router-link-exact-active',\r\n        scrollBehavior: function (to, from, savedPostion) { return savedPostion; },\r\n        fallback: true\r\n    },\r\n    APP: {\r\n        holdTabbar: true,\r\n        loddingPageStyle: function () { return JSON.parse('{\"backgroundColor\":\"#FFF\"}'); },\r\n        loddingPageHook: function (view) { types_1.plus.navigator.closeSplashscreen(); view.show(); },\r\n        animation: { animationType: 'pop-in', animationDuration: 300 }\r\n    },\r\n    debugger: false,\r\n    encodeURI: true,\r\n    routerBeforeEach: function (to, from, next) { next(); },\r\n    routerAfterEach: function (to, from) { },\r\n    routerErrorEach: function (error, router) { warn_1.err(error, router, true); },\r\n    routes: [\r\n        {\r\n            path: '/choose-location'\r\n        },\r\n        {\r\n            path: '/open-location'\r\n        },\r\n        {\r\n            path: '/preview-image'\r\n        }\r\n    ]\r\n};\r\nexports.lifeCycle = {\r\n    beforeHooks: [],\r\n    afterHooks: [],\r\n    routerBeforeHooks: [],\r\n    routerAfterHooks: [],\r\n    routerErrorHooks: []\r\n};\r\n\n\n//# sourceURL=webpack://Router/./src/helpers/config.ts?");

/***/ }),

/***/ "./src/helpers/createRouteMap.ts":
/*!***************************************!*\
  !*** ./src/helpers/createRouteMap.ts ***!
  \***************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createRouteMap [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createRouteMap = void 0;\r\nvar warn_1 = __webpack_require__(/*! ./warn */ \"./src/helpers/warn.ts\");\r\nvar utils_1 = __webpack_require__(/*! ./utils */ \"./src/helpers/utils.ts\");\r\nfunction createRouteMap(router, routes) {\r\n    var routesMap = {\r\n        finallyPathList: [],\r\n        finallyPathMap: Object.create(null),\r\n        aliasPathMap: Object.create(null),\r\n        pathMap: Object.create(null),\r\n        vueRouteMap: Object.create(null),\r\n        nameMap: Object.create(null)\r\n    };\r\n    routes.forEach(function (route) {\r\n        var _a = utils_1.getRoutePath(route), finallyPath = _a.finallyPath, aliasPath = _a.aliasPath, path = _a.path;\r\n        if (path == null) {\r\n            throw new Error(\"\\u8BF7\\u63D0\\u4F9B\\u4E00\\u4E2A\\u5B8C\\u6574\\u7684\\u8DEF\\u7531\\u5BF9\\u8C61\\uFF0C\\u5305\\u62EC\\u4EE5\\u7EDD\\u5BF9\\u8DEF\\u5F84\\u5F00\\u59CB\\u7684 \\u2018path\\u2019 \\u5B57\\u7B26\\u4E32 \" + JSON.stringify(route));\r\n        }\r\n        if (finallyPath instanceof Array) {\r\n            if (!router.options.h5.vueRouterDev && router.options.platform === 'h5') {\r\n                throw new Error(\"\\u975E vueRouterDev \\u6A21\\u5F0F\\u4E0B\\uFF0Croute.alias \\u76EE\\u524D\\u65E0\\u6CD5\\u63D0\\u4F9B\\u6570\\u7EC4\\u7C7B\\u578B\\uFF01 \" + JSON.stringify(route));\r\n            }\r\n        }\r\n        var strFinallyPath = finallyPath;\r\n        var strAliasPath = aliasPath;\r\n        if (router.options.platform !== 'h5') {\r\n            if (strFinallyPath.indexOf('/') !== 0) {\r\n                warn_1.warn(\"\\u5F53\\u524D\\u8DEF\\u7531\\u5BF9\\u8C61\\u4E0B\\uFF0Croute\\uFF1A\" + route + \" \\u662F\\u5426\\u7F3A\\u5C11\\u4E86\\u524D\\u7F00 \\u2018/\\u2019\", router, true);\r\n            }\r\n        }\r\n        if (!routesMap.finallyPathMap[strFinallyPath]) {\r\n            routesMap.finallyPathMap[strFinallyPath] = route;\r\n            routesMap.aliasPathMap[strAliasPath] = route;\r\n            routesMap.pathMap[path] = route;\r\n            routesMap.finallyPathList.push(strFinallyPath);\r\n            if (route.name != null) {\r\n                routesMap.nameMap[route.name] = route;\r\n            }\r\n        }\r\n    });\r\n    return routesMap;\r\n}\r\nexports.createRouteMap = createRouteMap;\r\n\n\n//# sourceURL=webpack://Router/./src/helpers/createRouteMap.ts?");

/***/ }),

/***/ "./src/helpers/lifeCycle.ts":
/*!**********************************!*\
  !*** ./src/helpers/lifeCycle.ts ***!
  \**********************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export registerEachHooks [provided] [no usage info] [missing usage info prevents renaming] */
/*! export registerHook [provided] [no usage info] [missing usage info prevents renaming] */
/*! export registerRouterHooks [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.registerEachHooks = exports.registerRouterHooks = exports.registerHook = void 0;\r\nvar base_1 = __webpack_require__(/*! ../options/base */ \"./src/options/base.ts\");\r\nvar hooks_1 = __webpack_require__(/*! ../public/hooks */ \"./src/public/hooks.ts\");\r\nfunction registerHook(list, fn) {\r\n    list.push(fn);\r\n    return function () {\r\n        var i = list.indexOf(fn);\r\n        if (i > 0)\r\n            list.splice(i, 1);\r\n    };\r\n}\r\nexports.registerHook = registerHook;\r\nfunction registerRouterHooks(cycleHooks, options) {\r\n    registerHook(cycleHooks.routerBeforeHooks, function (to, from, next) {\r\n        options.routerBeforeEach(to, from, next);\r\n    })();\r\n    registerHook(cycleHooks.routerAfterHooks, function (to, from) {\r\n        options.routerAfterEach(to, from);\r\n    })();\r\n    registerHook(cycleHooks.routerErrorHooks, function (error, router) {\r\n        options.routerErrorEach(error, router);\r\n    })();\r\n    return cycleHooks;\r\n}\r\nexports.registerRouterHooks = registerRouterHooks;\r\nfunction registerEachHooks(router, hookType, userGuard) {\r\n    registerHook(router.lifeCycle[hookType], function (to, from, next, router, auto) {\r\n        if (auto) { // h5端 vue-router自动触发 非自己调用触发\r\n            hooks_1.onTriggerEachHook(to, from, router, base_1.hookToggle[hookType], next);\r\n        }\r\n        else {\r\n            userGuard(to, from, next);\r\n        }\r\n    });\r\n}\r\nexports.registerEachHooks = registerEachHooks;\r\n\n\n//# sourceURL=webpack://Router/./src/helpers/lifeCycle.ts?");

/***/ }),

/***/ "./src/helpers/mixins.ts":
/*!*******************************!*\
  !*** ./src/helpers/mixins.ts ***!
  \*******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.initMixins = exports.getMixins = void 0;\r\nvar createRouteMap_1 = __webpack_require__(/*! ../helpers/createRouteMap */ \"./src/helpers/createRouteMap.ts\");\r\nvar buildRouter_1 = __webpack_require__(/*! ../H5/buildRouter */ \"./src/H5/buildRouter.ts\");\r\nvar proxyHook_1 = __webpack_require__(/*! ../H5/proxyHook */ \"./src/H5/proxyHook.ts\");\r\nvar config_1 = __webpack_require__(/*! ./config */ \"./src/helpers/config.ts\");\r\nfunction getMixins(router) {\r\n    var platform = router.options.platform;\r\n    if (config_1.mpPlatformReg.test(platform)) {\r\n        platform = 'app-lets';\r\n    }\r\n    var toggleHooks = {\r\n        h5: {\r\n            beforeCreate: function () {\r\n                if (this.$options.router) {\r\n                    router.$route = this.$options.router; // 挂载vue-router到路由对象下\r\n                    var vueRouteMap = createRouteMap_1.createRouteMap(router, this.$options.router.options.routes).finallyPathMap;\r\n                    router.routesMap.vueRouteMap = vueRouteMap;\r\n                    buildRouter_1.buildVueRoutes(router, vueRouteMap);\r\n                    buildRouter_1.buildVueRouter(router, this.$options.router, vueRouteMap);\r\n                    proxyHook_1.proxyEachHook(router, this.$options.router);\r\n                }\r\n            }\r\n        },\r\n        'app-plus': {\r\n            beforeCreate: function () {\r\n                console.log('beforeCreate---app');\r\n                // transitionTo(router);\r\n            },\r\n            onLoad: function () {\r\n                console.log('onLoad---app');\r\n            }\r\n        },\r\n        'app-lets': {\r\n            onLaunch: function () {\r\n                console.log('beforeCreate----app-lets');\r\n            }\r\n        }\r\n    };\r\n    return toggleHooks[platform];\r\n}\r\nexports.getMixins = getMixins;\r\nfunction initMixins(Vue, router) {\r\n    var routesMap = createRouteMap_1.createRouteMap(router, router.options.routes);\r\n    router.routesMap = routesMap; // 挂载自身路由表到路由对象下\r\n    Vue.mixin(__assign({}, getMixins(router)));\r\n}\r\nexports.initMixins = initMixins;\r\n\n\n//# sourceURL=webpack://Router/./src/helpers/mixins.ts?");

/***/ }),

/***/ "./src/helpers/utils.ts":
/*!******************************!*\
  !*** ./src/helpers/utils.ts ***!
  \******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar __spreadArrays = (this && this.__spreadArrays) || function () {\r\n    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;\r\n    for (var r = Array(s), k = 0, i = 0; i < il; i++)\r\n        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)\r\n            r[k] = a[j];\r\n    return r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.urlToJson = exports.getUniCachePage = exports.getDataType = exports.routesForMapRoute = exports.assertNewOptions = exports.getRoutePath = exports.mergeConfig = exports.voidFun = void 0;\r\nvar config_1 = __webpack_require__(/*! ../helpers/config */ \"./src/helpers/config.ts\");\r\nvar types_1 = __webpack_require__(/*! ../types */ \"./src/types/index.ts\");\r\nvar Regexp = __webpack_require__(/*! path-to-regexp */ \"./node_modules/path-to-regexp/index.js\");\r\nfunction voidFun() { }\r\nexports.voidFun = voidFun;\r\nfunction mergeConfig(baseConfig, userConfig) {\r\n    var config = Object.create(null);\r\n    var baseConfigKeys = Object.keys(baseConfig);\r\n    for (var i = 0; i < baseConfigKeys.length; i += 1) {\r\n        var key = baseConfigKeys[i];\r\n        if (userConfig[key] != null) {\r\n            if (userConfig[key].constructor === Object) {\r\n                config[key] = __assign(__assign({}, baseConfig[key]), userConfig[key]);\r\n            }\r\n            else if (key === 'routes') {\r\n                config[key] = __spreadArrays(baseConfig[key], userConfig[key]);\r\n            }\r\n            else {\r\n                config[key] = userConfig[key];\r\n            }\r\n        }\r\n        else {\r\n            config[key] = baseConfig[key];\r\n        }\r\n    }\r\n    return config;\r\n}\r\nexports.mergeConfig = mergeConfig;\r\nfunction getRoutePath(route) {\r\n    var finallyPath = route.aliasPath || route.alias || route.path;\r\n    return {\r\n        finallyPath: finallyPath,\r\n        aliasPath: route.aliasPath || route.path,\r\n        path: route.path,\r\n        alias: route.alias\r\n    };\r\n}\r\nexports.getRoutePath = getRoutePath;\r\nfunction assertNewOptions(options) {\r\n    var platform = options.platform, routes = options.routes;\r\n    if (platform == null) {\r\n        throw new Error(\"\\u4F60\\u5728\\u5B9E\\u4F8B\\u5316\\u8DEF\\u7531\\u65F6\\u5FC5\\u987B\\u4F20\\u9012 'platform'\");\r\n    }\r\n    if (routes == null || routes.length === 0) {\r\n        throw new Error(\"\\u4F60\\u5728\\u5B9E\\u4F8B\\u5316\\u8DEF\\u7531\\u65F6\\u5FC5\\u987B\\u4F20\\u9012 routes \\u4E3A\\u7A7A\\uFF0C\\u8FD9\\u662F\\u65E0\\u610F\\u4E49\\u7684\\u3002\");\r\n    }\r\n    var mergeOptions = mergeConfig(config_1.baseConfig, options);\r\n    return mergeOptions;\r\n}\r\nexports.assertNewOptions = assertNewOptions;\r\nfunction routesForMapRoute(routesMap, path, mapKey) {\r\n    var mapList = routesMap[mapKey];\r\n    for (var _i = 0, _a = Object.entries(mapList); _i < _a.length; _i++) {\r\n        var _b = _a[_i], key = _b[0], value = _b[1];\r\n        var route = value;\r\n        var rule = key;\r\n        if (getDataType(mapList) === '[object Array]') {\r\n            rule = route;\r\n        }\r\n        var pathRule = Regexp(rule);\r\n        var result = pathRule.exec(path);\r\n        if (result != null) {\r\n            if (getDataType(route) === '[object String]') {\r\n                return routesMap.finallyPathMap[route];\r\n            }\r\n            return route;\r\n        }\r\n    }\r\n    throw new Error(path + \" \\u8DEF\\u5F84\\u65E0\\u6CD5\\u5728\\u8DEF\\u7531\\u8868\\u4E2D\\u627E\\u5230\\uFF01\\u68C0\\u67E5\\u8DF3\\u8F6C\\u8DEF\\u5F84\\u53CA\\u8DEF\\u7531\\u8868\");\r\n}\r\nexports.routesForMapRoute = routesForMapRoute;\r\nfunction getDataType(data) {\r\n    return Object.prototype.toString.call(data);\r\n}\r\nexports.getDataType = getDataType;\r\nfunction getUniCachePage(pageIndex) {\r\n    var pages = types_1.getCurrentPages();\r\n    if (pageIndex == null) {\r\n        return pages;\r\n    }\r\n    return pages.reverse()[pageIndex];\r\n}\r\nexports.getUniCachePage = getUniCachePage;\r\nfunction urlToJson(url) {\r\n    var query = {};\r\n    var _a = url.split('?'), path = _a[0], params = _a[1];\r\n    if (params != null) {\r\n        var parr = params.split('&');\r\n        for (var _i = 0, parr_1 = parr; _i < parr_1.length; _i++) {\r\n            var i = parr_1[_i];\r\n            var arr = i.split('=');\r\n            query[arr[0]] = arr[1];\r\n        }\r\n    }\r\n    return {\r\n        path: path,\r\n        query: query\r\n    };\r\n}\r\nexports.urlToJson = urlToJson;\r\n\n\n//# sourceURL=webpack://Router/./src/helpers/utils.ts?");

/***/ }),

/***/ "./src/helpers/warn.ts":
/*!*****************************!*\
  !*** ./src/helpers/warn.ts ***!
  \*****************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export err [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isLog [provided] [no usage info] [missing usage info prevents renaming] */
/*! export log [provided] [no usage info] [missing usage info prevents renaming] */
/*! export warn [provided] [no usage info] [missing usage info prevents renaming] */
/*! export warnLock [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.warnLock = exports.log = exports.warn = exports.err = exports.isLog = void 0;\r\nfunction isLog(type, dev, errText, enforce) {\r\n    if (enforce === void 0) { enforce = false; }\r\n    if (!enforce) {\r\n        var isObject = dev.toString() === '[object Object]';\r\n        if (dev === false) {\r\n            return false;\r\n        }\r\n        else if (isObject) {\r\n            if (dev[type] === false) {\r\n                return false;\r\n            }\r\n        }\r\n    }\r\n    console[type](errText);\r\n    return true;\r\n}\r\nexports.isLog = isLog;\r\nfunction err(errText, router, enforce) {\r\n    var dev = router.options.debugger;\r\n    isLog('error', dev, errText, enforce);\r\n}\r\nexports.err = err;\r\nfunction warn(errText, router, enforce) {\r\n    var dev = router.options.debugger;\r\n    isLog('warn', dev, errText, enforce);\r\n}\r\nexports.warn = warn;\r\nfunction log(errText, router, enforce) {\r\n    var dev = router.options.debugger;\r\n    isLog('log', dev, errText, enforce);\r\n}\r\nexports.log = log;\r\nfunction warnLock(errText) {\r\n    console.warn(errText);\r\n}\r\nexports.warnLock = warnLock;\r\n\n\n//# sourceURL=webpack://Router/./src/helpers/warn.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! flagged exports */
/*! export RouterMount [provided] [maybe used in main (runtime-defined)] [usage prevents renaming] */
/*! export __esModule [provided] [maybe used in main (runtime-defined)] [usage prevents renaming] */
/*! export createRouter [provided] [maybe used in main (runtime-defined)] [usage prevents renaming] */
/*! other exports [not provided] [maybe used in main (runtime-defined)] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createRouter = exports.RouterMount = void 0;\r\nvar config_1 = __webpack_require__(/*! ./helpers/config */ \"./src/helpers/config.ts\");\r\nvar utils_1 = __webpack_require__(/*! ./helpers/utils */ \"./src/helpers/utils.ts\");\r\nvar lifeCycle_1 = __webpack_require__(/*! ./helpers/lifeCycle */ \"./src/helpers/lifeCycle.ts\");\r\nvar mixins_1 = __webpack_require__(/*! ./helpers/mixins */ \"./src/helpers/mixins.ts\");\r\nvar methods_1 = __webpack_require__(/*! ./public/methods */ \"./src/public/methods.ts\");\r\nvar proxyHook_1 = __webpack_require__(/*! ./H5/proxyHook */ \"./src/H5/proxyHook.ts\");\r\nfunction createRouter(params) {\r\n    var options = utils_1.assertNewOptions(params);\r\n    var router = {\r\n        options: options,\r\n        mount: [],\r\n        $route: null,\r\n        routesMap: {},\r\n        lifeCycle: lifeCycle_1.registerRouterHooks(config_1.lifeCycle, options),\r\n        push: function (to, from) {\r\n            methods_1.navjump(to, router, 'push', from);\r\n        },\r\n        replace: function (to, from) {\r\n            methods_1.navjump(to, router, 'replace', from);\r\n        },\r\n        replaceAll: function (to, from) {\r\n            methods_1.navjump(to, router, 'replaceAll', from);\r\n        },\r\n        pushTab: function (to, from) {\r\n            methods_1.navjump(to, router, 'pushTab', from);\r\n        },\r\n        beforeEach: function (userGuard) {\r\n            lifeCycle_1.registerEachHooks(router, 'beforeHooks', userGuard);\r\n        },\r\n        afterEach: function (userGuard) {\r\n            lifeCycle_1.registerEachHooks(router, 'afterHooks', userGuard);\r\n        },\r\n        install: function (Vue) {\r\n            mixins_1.initMixins(Vue, this);\r\n            Object.defineProperty(Vue.prototype, '$Router', {\r\n                get: function () {\r\n                    return router;\r\n                }\r\n            });\r\n            Object.defineProperty(Vue.prototype, '$Route', {\r\n                get: function () {\r\n                    return 22;\r\n                }\r\n            });\r\n        }\r\n    };\r\n    return router;\r\n}\r\nexports.createRouter = createRouter;\r\nfunction RouterMount(Vim, router, el) {\r\n    if (el === void 0) { el = '#app'; }\r\n    if (utils_1.getDataType(router.mount) === '[object Array]') {\r\n        router.mount.push({\r\n            app: Vim,\r\n            el: el\r\n        });\r\n    }\r\n    else {\r\n        throw new Error(\"\\u6302\\u8F7D\\u8DEF\\u7531\\u5931\\u8D25\\uFF0Crouter.app \\u5E94\\u8BE5\\u4E3A\\u6570\\u7EC4\\u7C7B\\u578B\\u3002\\u5F53\\u524D\\u7C7B\\u578B\\uFF1A\" + typeof router.mount);\r\n    }\r\n    switch (router.options.platform) {\r\n        case 'h5':\r\n            proxyHook_1.proxyH5Mount(Vim, router);\r\n            break;\r\n        default:\r\n            console.warn('其他端还没实现');\r\n            break;\r\n    }\r\n}\r\nexports.RouterMount = RouterMount;\r\n\n\n//# sourceURL=webpack://Router/./src/index.ts?");

/***/ }),

/***/ "./src/options/base.ts":
/*!*****************************!*\
  !*** ./src/options/base.ts ***!
  \*****************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export hookToggle [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.hookToggle = void 0;\r\nvar hookToggle;\r\n(function (hookToggle) {\r\n    hookToggle[\"beforeHooks\"] = \"beforeEach\";\r\n    hookToggle[\"afterHooks\"] = \"afterEach\";\r\n})(hookToggle = exports.hookToggle || (exports.hookToggle = {}));\r\n\n\n//# sourceURL=webpack://Router/./src/options/base.ts?");

/***/ }),

/***/ "./src/public/hooks.ts":
/*!*****************************!*\
  !*** ./src/public/hooks.ts ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __rest = (this && this.__rest) || function (s, e) {\r\n    var t = {};\r\n    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)\r\n        t[p] = s[p];\r\n    if (s != null && typeof Object.getOwnPropertySymbols === \"function\")\r\n        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {\r\n            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))\r\n                t[p[i]] = s[p[i]];\r\n        }\r\n    return t;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.loopCallHook = exports.transitionTo = exports.onTriggerEachHook = exports.callHook = exports.HOOKLIST = exports.ERRORHOOK = void 0;\r\nvar utils_1 = __webpack_require__(/*! ../helpers/utils */ \"./src/helpers/utils.ts\");\r\nexports.ERRORHOOK = [\r\n    function (error, router) { return router.lifeCycle.routerErrorHooks[0](error, router); }\r\n];\r\nexports.HOOKLIST = [\r\n    function (router, to, from, toRoute) { return callHook(router.lifeCycle.routerBeforeHooks[0], to, from, router); },\r\n    function (router, to, from, toRoute) {\r\n        var page = window.getCurrentPages()[0];\r\n        var beforeRouteLeave;\r\n        if (page != null) {\r\n            var leaveHooks = page.$options.beforeRouteLeave;\r\n            if (utils_1.getDataType(leaveHooks) === '[object Array]') {\r\n                beforeRouteLeave = leaveHooks[0];\r\n                beforeRouteLeave = beforeRouteLeave.bind(page);\r\n            }\r\n        }\r\n        return callHook(beforeRouteLeave, to, from, router);\r\n    },\r\n    function (router, to, from, toRoute) { return callHook(router.lifeCycle.beforeHooks[0], to, from, router); },\r\n    function (router, to, from, toRoute) { return callHook(toRoute.beforeEnter, to, from, router); },\r\n    function (router, to, from, toRoute) { return callHook(router.lifeCycle.afterHooks[0], to, from, router, false); },\r\n    function (router, to, from, toRoute) { return callHook(router.lifeCycle.routerAfterHooks[0], to, from, router, false); }\r\n];\r\nfunction callHook(hook, to, from, router, hookAwait) {\r\n    if (hookAwait === void 0) { hookAwait = true; }\r\n    return new Promise(function (resolve) {\r\n        if (hook != null && hook instanceof Function) {\r\n            if (hookAwait === true) {\r\n                hook(to, from, resolve, router, false);\r\n            }\r\n            else {\r\n                hook(to, from, function () { }, router, false);\r\n                resolve();\r\n            }\r\n        }\r\n        else {\r\n            resolve();\r\n        }\r\n    });\r\n}\r\nexports.callHook = callHook;\r\nfunction onTriggerEachHook(to, from, router, hookType, next) {\r\n    var callHookList = [];\r\n    if (hookType === 'beforeEach') {\r\n        callHookList = exports.HOOKLIST.slice(0, 3);\r\n    }\r\n    else {\r\n        callHookList = exports.HOOKLIST.slice(4);\r\n    }\r\n    transitionTo(router, to, from, 'push', callHookList, function () {\r\n        if (typeof next === 'function') {\r\n            next();\r\n        }\r\n    });\r\n}\r\nexports.onTriggerEachHook = onTriggerEachHook;\r\nfunction transitionTo(router, to, from, navType, callHookList, hookCB) {\r\n    loopCallHook(callHookList, 0, hookCB, router, to, from, navType);\r\n}\r\nexports.transitionTo = transitionTo;\r\nfunction loopCallHook(hooks, index, next, router, to, from, navType) {\r\n    var toRoute = utils_1.routesForMapRoute(router.routesMap, to.path, 'finallyPathMap');\r\n    if (hooks.length - 1 < index) {\r\n        return next();\r\n    }\r\n    var hook = hooks[index];\r\n    var errHook = exports.ERRORHOOK[0];\r\n    hook(router, to, from, toRoute).then(function (nextTo) {\r\n        console.log('nextTo:' + nextTo);\r\n        if (nextTo === false) {\r\n            errHook({ type: 0, msg: '管道函数传递 false 导航被终止!', to: to, from: from, nextTo: nextTo }, router);\r\n        }\r\n        else if (typeof nextTo === 'string' || typeof nextTo === 'object') {\r\n            if (typeof nextTo === 'object' && nextTo.NAVTYPE != null) {\r\n                var type = nextTo.NAVTYPE, moreTo = __rest(nextTo, [\"NAVTYPE\"]);\r\n                router[type](moreTo, from);\r\n            }\r\n            else {\r\n                router[navType](nextTo, from);\r\n            }\r\n        }\r\n        else if (nextTo == null) {\r\n            index++;\r\n            loopCallHook(hooks, index, next, router, to, from, navType);\r\n        }\r\n        else {\r\n            errHook({ type: 1, msg: '管道函数传递未知类型，无法被识别。导航被终止！', to: to, from: from, nextTo: nextTo }, router);\r\n        }\r\n    });\r\n}\r\nexports.loopCallHook = loopCallHook;\r\n\n\n//# sourceURL=webpack://Router/./src/public/hooks.ts?");

/***/ }),

/***/ "./src/public/methods.ts":
/*!*******************************!*\
  !*** ./src/public/methods.ts ***!
  \*******************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export navjump [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.navjump = void 0;\r\nvar page_1 = __webpack_require__(/*! ./page */ \"./src/public/page.ts\");\r\nvar hooks_1 = __webpack_require__(/*! ./hooks */ \"./src/public/hooks.ts\");\r\nvar utils_1 = __webpack_require__(/*! ../helpers/utils */ \"./src/helpers/utils.ts\");\r\nfunction navjump(to, router, navType, from) {\r\n    var _a = page_1.queryPageToMap(to, router), toRule = _a.rule, route = _a.route, query = _a.query;\r\n    if (router.options.platform === 'h5') {\r\n        if (navType !== 'push') {\r\n            navType = 'replace';\r\n        }\r\n        router.$route[navType](toRule, toRule.success || utils_1.voidFun, toRule.fail || utils_1.voidFun);\r\n    }\r\n    else {\r\n        hooks_1.transitionTo(router, toRule, from, navType, hooks_1.HOOKLIST, function () {\r\n            console.log('跳转完成');\r\n        });\r\n    }\r\n}\r\nexports.navjump = navjump;\r\n\n\n//# sourceURL=webpack://Router/./src/public/methods.ts?");

/***/ }),

/***/ "./src/public/page.ts":
/*!****************************!*\
  !*** ./src/public/page.ts ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:16-20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.queryPageToMap = void 0;\r\nvar utils_1 = __webpack_require__(/*! ../helpers/utils */ \"./src/helpers/utils.ts\");\r\nvar hooks_1 = __webpack_require__(/*! ./hooks */ \"./src/public/hooks.ts\");\r\nfunction queryPageToMap(toRule, router) {\r\n    var query = {};\r\n    var route = '';\r\n    var successCb = toRule.success;\r\n    var failCb = toRule.fail;\r\n    if (utils_1.getDataType(toRule) === '[object Object]') {\r\n        var objNavRule = toRule;\r\n        if (objNavRule.path != null) {\r\n            var _a = utils_1.urlToJson(objNavRule.path), path = _a.path, newQuery = _a.query;\r\n            route = utils_1.routesForMapRoute(router.routesMap, path, 'finallyPathList');\r\n            query = __assign(__assign({}, newQuery), (toRule.query || {}));\r\n        }\r\n        else if (objNavRule.name != null) {\r\n            route = router.routesMap.nameMap[objNavRule.name];\r\n            if (route == null) {\r\n                hooks_1.ERRORHOOK[0]({ type: 2, msg: \"\\u547D\\u540D\\u8DEF\\u7531\\u4E3A\\uFF1A\" + objNavRule.name + \" \\u7684\\u8DEF\\u7531\\uFF0C\\u65E0\\u6CD5\\u5728\\u8DEF\\u7531\\u8868\\u4E2D\\u627E\\u5230\\uFF01\", toRule: toRule }, router);\r\n            }\r\n            else {\r\n                query = toRule.params || {};\r\n            }\r\n        }\r\n        else {\r\n            hooks_1.ERRORHOOK[0]({ type: 2, msg: toRule + \" \\u89E3\\u6790\\u5931\\u8D25\\uFF0C\\u8BF7\\u68C0\\u6D4B\\u5F53\\u524D\\u8DEF\\u7531\\u8868\\u4E0B\\u662F\\u5426\\u6709\\u5305\\u542B\\u3002\", toRule: toRule }, router);\r\n        }\r\n    }\r\n    else {\r\n        var _b = utils_1.urlToJson(toRule), path = _b.path, newQuery = _b.query;\r\n        route = utils_1.routesForMapRoute(router.routesMap, path, 'finallyPathList');\r\n        query = newQuery;\r\n    }\r\n    if (router.options.platform === 'h5') {\r\n        var completeCb_1 = toRule.complete;\r\n        var cacheSuccess_1 = toRule.success;\r\n        var cacheFail_1 = toRule.fail;\r\n        if (utils_1.getDataType(completeCb_1) === '[object Function]') {\r\n            var publicCb_1 = function (args, callHook) {\r\n                if (utils_1.getDataType(callHook) === '[object Function]') {\r\n                    callHook.apply(this, args);\r\n                }\r\n                completeCb_1.apply(this, args);\r\n            };\r\n            successCb = function () {\r\n                var args = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    args[_i] = arguments[_i];\r\n                }\r\n                publicCb_1.call(this, args, cacheSuccess_1);\r\n            };\r\n            failCb = function () {\r\n                var args = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    args[_i] = arguments[_i];\r\n                }\r\n                publicCb_1.call(this, args, cacheFail_1);\r\n            };\r\n        }\r\n    }\r\n    else {\r\n        console.log('这是非h端 需要做的 TODO');\r\n    }\r\n    var rule = toRule;\r\n    if (utils_1.getDataType(rule.success) === '[object Function]') {\r\n        rule.success = successCb;\r\n    }\r\n    if (utils_1.getDataType(rule.fail) === '[object Function]') {\r\n        rule.fail = failCb;\r\n    }\r\n    return {\r\n        rule: rule,\r\n        route: route,\r\n        query: query\r\n    };\r\n}\r\nexports.queryPageToMap = queryPageToMap;\r\n\n\n//# sourceURL=webpack://Router/./src/public/page.ts?");

/***/ }),

/***/ "./src/types/index.ts":
/*!****************************!*\
  !*** ./src/types/index.ts ***!
  \****************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\n\n\n//# sourceURL=webpack://Router/./src/types/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.ts");
/******/ })()
;
});