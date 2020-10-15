(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cheerio'), require('moment'), require('validate-cnj'), require('numeral')) :
  typeof define === 'function' && define.amd ? define(['exports', 'cheerio', 'moment', 'validate-cnj', 'numeral'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.JuristekParser = {}, global.cheerio, global.moment, global.ValidateCNJ, global.numeral));
}(this, (function (exports, cheerio, moment, CalculateCNJ, numeral) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var cheerio__default = /*#__PURE__*/_interopDefaultLegacy(cheerio);
  var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
  var CalculateCNJ__default = /*#__PURE__*/_interopDefaultLegacy(CalculateCNJ);
  var numeral__default = /*#__PURE__*/_interopDefaultLegacy(numeral);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) { Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } }

  function _extendableBuiltin(cls) {
    function ExtendableBuiltin() {
      cls.apply(this, arguments);
    }

    ExtendableBuiltin.prototype = Object.create(cls.prototype, {
      constructor: {
        value: cls,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(ExtendableBuiltin, cls);
    } else {
      ExtendableBuiltin.__proto__ = cls;
    }

    return ExtendableBuiltin;
  }

  var ExtendableError = function (_extendableBuiltin2) {
    _inherits(ExtendableError, _extendableBuiltin2);

    function ExtendableError() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      _classCallCheck(this, ExtendableError);

      // extending Error is weird and does not propagate `message`
      var _this = _possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

      Object.defineProperty(_this, 'message', {
        configurable: true,
        enumerable: false,
        value: message,
        writable: true
      });

      Object.defineProperty(_this, 'name', {
        configurable: true,
        enumerable: false,
        value: _this.constructor.name,
        writable: true
      });

      if (Error.hasOwnProperty('captureStackTrace')) {
        Error.captureStackTrace(_this, _this.constructor);
        return _possibleConstructorReturn(_this);
      }

      Object.defineProperty(_this, 'stack', {
        configurable: true,
        enumerable: false,
        value: new Error(message).stack,
        writable: true
      });
      return _this;
    }

    return ExtendableError;
  }(_extendableBuiltin(Error));

  var JuristekException = /*@__PURE__*/(function (ExtendableError) {
    function JuristekException () {
      ExtendableError.apply(this, arguments);
    }

    if ( ExtendableError ) JuristekException.__proto__ = ExtendableError;
    JuristekException.prototype = Object.create( ExtendableError && ExtendableError.prototype );
    JuristekException.prototype.constructor = JuristekException;

    JuristekException.prototype.toString = function toString () {
      return this.message;
    };

    return JuristekException;
  }(ExtendableError));

  var JuristekInstanceException = /*@__PURE__*/(function (JuristekException) {
  	function JuristekInstanceException () {
  		JuristekException.apply(this, arguments);
  	}if ( JuristekException ) JuristekInstanceException.__proto__ = JuristekException;
  	JuristekInstanceException.prototype = Object.create( JuristekException && JuristekException.prototype );
  	JuristekInstanceException.prototype.constructor = JuristekInstanceException;

  	

  	return JuristekInstanceException;
  }(JuristekException));

  var JuristekParserException = /*@__PURE__*/(function (JuristekException) {
    function JuristekParserException () {
      JuristekException.apply(this, arguments);
    }if ( JuristekException ) JuristekParserException.__proto__ = JuristekException;
    JuristekParserException.prototype = Object.create( JuristekException && JuristekException.prototype );
    JuristekParserException.prototype.constructor = JuristekParserException;

    

    return JuristekParserException;
  }(JuristekException));

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var arguments$1 = arguments;

  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments$1[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  var name = "juristek-parser";
  var version = "5.0.13";
  var repository = {
  	type: "git",
  	url: "https://github.com/bipbop/juristek-parser.git"
  };

  var Parser = function Parser(cherrioObject) {
    this.$ = cherrioObject;
  };

  Parser.prototype.assertDocument = function assertDocument () {
    var exception = this.$('BPQL > header > exception');
    if (!exception.length) { return; }
    throw objectAssign(new Error(exception.text()), {
      source: exception.attr('source') || null,
      push: exception.attr('push') !== 'false',
      code: parseInt(exception.attr('code'), 10) || 0,
      log: exception.attr('log') || null,
    });
  };

  Parser.openString = function openString (str) {
    return new this(cheerio__default['default'].load(str, {
      normalizeWhitespace: true,
      xmlMode: true,
      decodeEntities: false
    }));
  };

  Parser.prototype.load = function load () {
    this.assertDocument();
    return this.parse();
  };

  Parser.prototype.parse = function parse () {
    var dump = this.dump();
    if (Array.isArray(dump) || typeof dump !== 'object') { dump = { response: dump }; }
    return objectAssign(dump, {
      _parserLoaded: new Date(),
      _parser: { version: version, name: name, repository: repository },
    });
  };

  Parser.prototype.dump = function dump () {
    return this.$;
  };

  var Info = /*@__PURE__*/(function (Parser) {
    function Info () {
      Parser.apply(this, arguments);
    }

    if ( Parser ) Info.__proto__ = Parser;
    Info.prototype = Object.create( Parser && Parser.prototype );
    Info.prototype.constructor = Info;

    Info.compatible = function compatible (info, procNumber, fieldName) {
      if ( fieldName === void 0 ) fieldName = 'numero_processo';

      return info.filter(function (ref) {
        var fields = ref.fields;

        return fields
        .filter(function (ref) {
          var name = ref.name;

          return (name === fieldName);
        }).filter(function (ref) {
          var otherMasks = ref.otherMasks;
          var mask = ref.mask;

          var masks = [mask].concat(otherMasks);
          return masks.map(function (x) { return new RegExp(("^" + (x
            .replace(/(\.)/g, '\\$1')
            .replace(/N+/g, '\\d+')
            .replace(/[A-Z]/g, '\\d')) + "$")).test(procNumber); }).find(function (x) { return (x === true); });
        }).length;
      });
    };

    Info.prototype.dump = function dump () {
      var ref = this;
      var $ = ref.$;
      return $('database').map(function (i, databaseNode) { return $('table', databaseNode).map(function (it, tableNode) { return ({
        table: tableNode.attribs,
        database: databaseNode.attribs,
        fields: $('field', tableNode).map(function (fi, fieldNode) { return objectAssign(fieldNode.attribs, {
          otherMasks: $('alternative_mask', fieldNode).map(function (oi, optionNode) { return $(optionNode).text(); }).get(),
          options: $('option', fieldNode).map(function (oi, optionNode) { return objectAssign(optionNode.attribs, {
            text: $(optionNode).text(),
          }); }).get(),
        }); }).get(),
      }); }).get(); }).get();
    };

    return Info;
  }(Parser));

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          var arguments$1 = arguments;

          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments$1[i];
              for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p)) { t[p] = s[p]; } }
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  /**
   * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
   */
  /**
   * Lower case as a function.
   */
  function lowerCase(str) {
      return str.toLowerCase();
  }

  // Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
  var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
  // Remove all non-word characters.
  var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
  /**
   * Normalize the string into something other libraries can manipulate easier.
   */
  function noCase(input, options) {
      if (options === void 0) { options = {}; }
      var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
      var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
      var start = 0;
      var end = result.length;
      // Trim the delimiter from around the output string.
      while (result.charAt(start) === "\0")
          { start++; }
      while (result.charAt(end - 1) === "\0")
          { end--; }
      // Transform each token independently.
      return result
          .slice(start, end)
          .split("\0")
          .map(transform)
          .join(delimiter);
  }
  /**
   * Replace `re` in the input string with the replacement value.
   */
  function replace(input, re, value) {
      if (re instanceof RegExp)
          { return input.replace(re, value); }
      return re.reduce(function (input, re) { return input.replace(re, value); }, input);
  }

  function pascalCaseTransform(input, index) {
      var firstChar = input.charAt(0);
      var lowerChars = input.substr(1).toLowerCase();
      if (index > 0 && firstChar >= "0" && firstChar <= "9") {
          return "_" + firstChar + lowerChars;
      }
      return "" + firstChar.toUpperCase() + lowerChars;
  }
  function pascalCase(input, options) {
      if (options === void 0) { options = {}; }
      return noCase(input, __assign({ delimiter: "", transform: pascalCaseTransform }, options));
  }

  function camelCaseTransform(input, index) {
      if (index === 0)
          { return input.toLowerCase(); }
      return pascalCaseTransform(input, index);
  }
  function camelCase(input, options) {
      if (options === void 0) { options = {}; }
      return pascalCase(input, __assign({ transform: camelCaseTransform }, options));
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  var _arrayMap = arrayMap;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_1(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var _assocIndexOf = assocIndexOf;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return _assocIndexOf(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas;

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  var _listCacheSet = listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = _listCacheClear;
  ListCache.prototype['delete'] = _listCacheDelete;
  ListCache.prototype.get = _listCacheGet;
  ListCache.prototype.has = _listCacheHas;
  ListCache.prototype.set = _listCacheSet;

  var _ListCache = ListCache;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new _ListCache;
    this.size = 0;
  }

  var _stackClear = stackClear;

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  var _stackDelete = stackDelete;

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  var _stackGet = stackGet;

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  var _stackHas = stackHas;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol = _root.Symbol;

  var _Symbol = Symbol;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty$1.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject_1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = _root['__core-js_shared__'];

  var _coreJsData = coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  var _isMasked = isMasked;

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject_1(value) || _isMasked(value)) {
      return false;
    }
    var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
  }

  var _baseIsNative = baseIsNative;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  /* Built-in method references that are verified to be native. */
  var Map = _getNative(_root, 'Map');

  var _Map = Map;

  /* Built-in method references that are verified to be native. */
  var nativeCreate = _getNative(Object, 'create');

  var _nativeCreate = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear;

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (_nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
  }

  var _hashHas = hashHas;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = _hashClear;
  Hash.prototype['delete'] = _hashDelete;
  Hash.prototype.get = _hashGet;
  Hash.prototype.has = _hashHas;
  Hash.prototype.set = _hashSet;

  var _Hash = Hash;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new _Hash,
      'map': new (_Map || _ListCache),
      'string': new _Hash
    };
  }

  var _mapCacheClear = mapCacheClear;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  var _isKeyable = isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return _isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  var _getMapData = getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return _getMapData(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return _getMapData(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas;

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = _getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = _mapCacheClear;
  MapCache.prototype['delete'] = _mapCacheDelete;
  MapCache.prototype.get = _mapCacheGet;
  MapCache.prototype.has = _mapCacheHas;
  MapCache.prototype.set = _mapCacheSet;

  var _MapCache = MapCache;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof _ListCache) {
      var pairs = data.__data__;
      if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new _MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  var _stackSet = stackSet;

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new _ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = _stackClear;
  Stack.prototype['delete'] = _stackDelete;
  Stack.prototype.get = _stackGet;
  Stack.prototype.has = _stackHas;
  Stack.prototype.set = _stackSet;

  var _Stack = Stack;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED$2);
    return this;
  }

  var _setCacheAdd = setCacheAdd;

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  var _setCacheHas = setCacheHas;

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new _MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  }

  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
  SetCache.prototype.has = _setCacheHas;

  var _SetCache = SetCache;

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  var _arraySome = arraySome;

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  var _cacheHas = cacheHas;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    // Check that cyclic values are equal.
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1,
        result = true,
        seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

    stack.set(array, other);
    stack.set(other, array);

    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, arrValue, index, other, array, stack)
          : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (seen) {
        if (!_arraySome(other, function(othValue, othIndex) {
              if (!_cacheHas(seen, othIndex) &&
                  (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
          result = false;
          break;
        }
      } else if (!(
            arrValue === othValue ||
              equalFunc(arrValue, othValue, bitmask, customizer, stack)
          )) {
        result = false;
        break;
      }
    }
    stack['delete'](array);
    stack['delete'](other);
    return result;
  }

  var _equalArrays = equalArrays;

  /** Built-in value references. */
  var Uint8Array = _root.Uint8Array;

  var _Uint8Array = Uint8Array;

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  var _mapToArray = mapToArray;

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  var _setToArray = setToArray;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$1 = 1,
      COMPARE_UNORDERED_FLAG$1 = 2;

  /** `Object#toString` result references. */
  var boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]';

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if ((object.byteLength != other.byteLength) ||
            (object.byteOffset != other.byteOffset)) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag:
        if ((object.byteLength != other.byteLength) ||
            !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
          return false;
        }
        return true;

      case boolTag:
      case dateTag:
      case numberTag:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq_1(+object, +other);

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == (other + '');

      case mapTag:
        var convert = _mapToArray;

      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
        convert || (convert = _setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$1;

        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other);
        var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack['delete'](object);
        return result;

      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }

  var _equalByTag = equalByTag;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  var _arrayPush = arrayPush;

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  var isArray_1 = isArray;

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
  }

  var _baseGetAllKeys = baseGetAllKeys;

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  var _arrayFilter = arrayFilter;

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  var stubArray_1 = stubArray;

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return _arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };

  var _getSymbols = getSymbols;

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  var _baseTimes = baseTimes;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
    return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') &&
      !propertyIsEnumerable$1.call(value, 'callee');
  };

  var isArguments_1 = isArguments;

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  var stubFalse_1 = stubFalse;

  var isBuffer_1 = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports =  exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse_1;

  module.exports = isBuffer;
  });

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  var _isIndex = isIndex;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  var isLength_1 = isLength;

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag$1 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      errorTag$1 = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag$1 = '[object Map]',
      numberTag$1 = '[object Number]',
      objectTag = '[object Object]',
      regexpTag$1 = '[object RegExp]',
      setTag$1 = '[object Set]',
      stringTag$1 = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$1 = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
  typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
  typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
  typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike_1(value) &&
      isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
  }

  var _baseIsTypedArray = baseIsTypedArray;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary;

  var _nodeUtil = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports =  exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && _freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  module.exports = nodeUtil;
  });

  /* Node.js helper references. */
  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

  var isTypedArray_1 = isTypedArray;

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_1(value),
        isArg = !isArr && isArguments_1(value),
        isBuff = !isArr && !isArg && isBuffer_1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? _baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$6.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             _isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  var _arrayLikeKeys = arrayLikeKeys;

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

    return value === proto;
  }

  var _isPrototype = isPrototype;

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  var _overArg = overArg;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = _overArg(Object.keys, Object);

  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!_isPrototype(object)) {
      return _nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeys = baseKeys;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength_1(value.length) && !isFunction_1(value);
  }

  var isArrayLike_1 = isArrayLike;

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
  }

  var keys_1 = keys;

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return _baseGetAllKeys(object, keys_1, _getSymbols);
  }

  var _getAllKeys = getAllKeys;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$2 = 1;

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
        objProps = _getAllKeys(object),
        objLength = objProps.length,
        othProps = _getAllKeys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
        return false;
      }
    }
    // Check that cyclic values are equal.
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);

    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, objValue, key, other, object, stack)
          : customizer(objValue, othValue, key, object, other, stack);
      }
      // Recursively compare objects (susceptible to call stack limits).
      if (!(compared === undefined
            ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
            : compared
          )) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack['delete'](object);
    stack['delete'](other);
    return result;
  }

  var _equalObjects = equalObjects;

  /* Built-in method references that are verified to be native. */
  var DataView = _getNative(_root, 'DataView');

  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */
  var Promise = _getNative(_root, 'Promise');

  var _Promise = Promise;

  /* Built-in method references that are verified to be native. */
  var Set = _getNative(_root, 'Set');

  var _Set = Set;

  /* Built-in method references that are verified to be native. */
  var WeakMap = _getNative(_root, 'WeakMap');

  var _WeakMap = WeakMap;

  /** `Object#toString` result references. */
  var mapTag$2 = '[object Map]',
      objectTag$1 = '[object Object]',
      promiseTag = '[object Promise]',
      setTag$2 = '[object Set]',
      weakMapTag$1 = '[object WeakMap]';

  var dataViewTag$2 = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = _toSource(_DataView),
      mapCtorString = _toSource(_Map),
      promiseCtorString = _toSource(_Promise),
      setCtorString = _toSource(_Set),
      weakMapCtorString = _toSource(_WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = _baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
      (_Map && getTag(new _Map) != mapTag$2) ||
      (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
      (_Set && getTag(new _Set) != setTag$2) ||
      (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
    getTag = function(value) {
      var result = _baseGetTag(value),
          Ctor = result == objectTag$1 ? value.constructor : undefined,
          ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag$2;
          case mapCtorString: return mapTag$2;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag$2;
          case weakMapCtorString: return weakMapTag$1;
        }
      }
      return result;
    };
  }

  var _getTag = getTag;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$3 = 1;

  /** `Object#toString` result references. */
  var argsTag$2 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      objectTag$2 = '[object Object]';

  /** Used for built-in method references. */
  var objectProto$b = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray_1(object),
        othIsArr = isArray_1(other),
        objTag = objIsArr ? arrayTag$1 : _getTag(object),
        othTag = othIsArr ? arrayTag$1 : _getTag(other);

    objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
    othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

    var objIsObj = objTag == objectTag$2,
        othIsObj = othTag == objectTag$2,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer_1(object)) {
      if (!isBuffer_1(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new _Stack);
      return (objIsArr || isTypedArray_1(object))
        ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
        : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
      var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty$9.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

        stack || (stack = new _Stack);
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new _Stack);
    return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  var _baseIsEqualDeep = baseIsEqualDeep;

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
      return value !== value && other !== other;
    }
    return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  var _baseIsEqual = baseIsEqual;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$4 = 1,
      COMPARE_UNORDERED_FLAG$2 = 2;

  /**
   * The base implementation of `_.isMatch` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Array} matchData The property names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length,
        length = index,
        noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if ((noCustomizer && data[2])
            ? data[1] !== object[data[0]]
            : !(data[0] in object)
          ) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
          objValue = object[key],
          srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new _Stack;
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === undefined
              ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
              : result
            )) {
          return false;
        }
      }
    }
    return true;
  }

  var _baseIsMatch = baseIsMatch;

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject_1(value);
  }

  var _isStrictComparable = isStrictComparable;

  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = keys_1(object),
        length = result.length;

    while (length--) {
      var key = result[length],
          value = object[key];

      result[length] = [key, value, _isStrictComparable(value)];
    }
    return result;
  }

  var _getMatchData = getMatchData;

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue &&
        (srcValue !== undefined || (key in Object(object)));
    };
  }

  var _matchesStrictComparable = matchesStrictComparable;

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var matchData = _getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || _baseIsMatch(object, source, matchData);
    };
  }

  var _baseMatches = baseMatches;

  /** `Object#toString` result references. */
  var symbolTag$1 = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
  }

  var isSymbol_1 = isSymbol;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray_1(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol_1(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  var _isKey = isKey;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || _MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = _MapCache;

  var memoize_1 = memoize;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize_1(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  var _memoizeCapped = memoizeCapped;

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = _memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  var _stringToPath = stringToPath;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
      symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray_1(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return _arrayMap(value, baseToString) + '';
    }
    if (isSymbol_1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  var _baseToString = baseToString;

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : _baseToString(value);
  }

  var toString_1 = toString;

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if (isArray_1(value)) {
      return value;
    }
    return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
  }

  var _castPath = castPath;

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol_1(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
  }

  var _toKey = toKey;

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = _castPath(path, object);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[_toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }

  var _baseGet = baseGet;

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : _baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  var get_1 = get;

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  var _baseHasIn = baseHasIn;

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = _castPath(path, object);

    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = _toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength_1(length) && _isIndex(key, length) &&
      (isArray_1(object) || isArguments_1(object));
  }

  var _hasPath = hasPath;

  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.hasIn(object, 'a');
   * // => true
   *
   * _.hasIn(object, 'a.b');
   * // => true
   *
   * _.hasIn(object, ['a', 'b']);
   * // => true
   *
   * _.hasIn(object, 'b');
   * // => false
   */
  function hasIn(object, path) {
    return object != null && _hasPath(object, path, _baseHasIn);
  }

  var hasIn_1 = hasIn;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$5 = 1,
      COMPARE_UNORDERED_FLAG$3 = 2;

  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if (_isKey(path) && _isStrictComparable(srcValue)) {
      return _matchesStrictComparable(_toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get_1(object, path);
      return (objValue === undefined && objValue === srcValue)
        ? hasIn_1(object, path)
        : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
    };
  }

  var _baseMatchesProperty = baseMatchesProperty;

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  var identity_1 = identity;

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  var _baseProperty = baseProperty;

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function(object) {
      return _baseGet(object, path);
    };
  }

  var _basePropertyDeep = basePropertyDeep;

  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */
  function property(path) {
    return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
  }

  var property_1 = property;

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return identity_1;
    }
    if (typeof value == 'object') {
      return isArray_1(value)
        ? _baseMatchesProperty(value[0], value[1])
        : _baseMatches(value);
    }
    return property_1(value);
  }

  var _baseIteratee = baseIteratee;

  var defineProperty = (function() {
    try {
      var func = _getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  var _defineProperty = defineProperty;

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && _defineProperty) {
      _defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  var _baseAssignValue = baseAssignValue;

  /** Used for built-in method references. */
  var objectProto$c = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$a = objectProto$c.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$a.call(object, key) && eq_1(objValue, value)) ||
        (value === undefined && !(key in object))) {
      _baseAssignValue(object, key, value);
    }
  }

  var _assignValue = assignValue;

  /**
   * The base implementation of `_.set`.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {Array|string} path The path of the property to set.
   * @param {*} value The value to set.
   * @param {Function} [customizer] The function to customize path creation.
   * @returns {Object} Returns `object`.
   */
  function baseSet(object, path, value, customizer) {
    if (!isObject_1(object)) {
      return object;
    }
    path = _castPath(path, object);

    var index = -1,
        length = path.length,
        lastIndex = length - 1,
        nested = object;

    while (nested != null && ++index < length) {
      var key = _toKey(path[index]),
          newValue = value;

      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return object;
      }

      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = isObject_1(objValue)
            ? objValue
            : (_isIndex(path[index + 1]) ? [] : {});
        }
      }
      _assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }

  var _baseSet = baseSet;

  /**
   * The base implementation of  `_.pickBy` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} paths The property paths to pick.
   * @param {Function} predicate The function invoked per property.
   * @returns {Object} Returns the new object.
   */
  function basePickBy(object, paths, predicate) {
    var index = -1,
        length = paths.length,
        result = {};

    while (++index < length) {
      var path = paths[index],
          value = _baseGet(object, path);

      if (predicate(value, path)) {
        _baseSet(result, _castPath(path, object), value);
      }
    }
    return result;
  }

  var _basePickBy = basePickBy;

  /** Built-in value references. */
  var getPrototype = _overArg(Object.getPrototypeOf, Object);

  var _getPrototype = getPrototype;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own and inherited enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
    var result = [];
    while (object) {
      _arrayPush(result, _getSymbols(object));
      object = _getPrototype(object);
    }
    return result;
  };

  var _getSymbolsIn = getSymbolsIn;

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  var _nativeKeysIn = nativeKeysIn;

  /** Used for built-in method references. */
  var objectProto$d = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$b = objectProto$d.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject_1(object)) {
      return _nativeKeysIn(object);
    }
    var isProto = _isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$b.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeysIn = baseKeysIn;

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
  }

  var keysIn_1 = keysIn;

  /**
   * Creates an array of own and inherited enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeysIn(object) {
    return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
  }

  var _getAllKeysIn = getAllKeysIn;

  /**
   * Creates an object composed of the `object` properties `predicate` returns
   * truthy for. The predicate is invoked with two arguments: (value, key).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The source object.
   * @param {Function} [predicate=_.identity] The function invoked per property.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.pickBy(object, _.isNumber);
   * // => { 'a': 1, 'c': 3 }
   */
  function pickBy(object, predicate) {
    if (object == null) {
      return {};
    }
    var props = _arrayMap(_getAllKeysIn(object), function(prop) {
      return [prop];
    });
    predicate = _baseIteratee(predicate);
    return _basePickBy(object, props, function(value, path) {
      return predicate(value, path[0]);
    });
  }

  var pickBy_1 = pickBy;

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  var _arrayEach = arrayEach;

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  var _createBaseFor = createBaseFor;

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = _createBaseFor();

  var _baseFor = baseFor;

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && _baseFor(object, iteratee, keys_1);
  }

  var _baseForOwn = baseForOwn;

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike_1(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  var _createBaseEach = createBaseEach;

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEach = _createBaseEach(_baseForOwn);

  var _baseEach = baseEach;

  /**
   * Casts `value` to `identity` if it's not a function.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Function} Returns cast function.
   */
  function castFunction(value) {
    return typeof value == 'function' ? value : identity_1;
  }

  var _castFunction = castFunction;

  /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _.forEach([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */
  function forEach(collection, iteratee) {
    var func = isArray_1(collection) ? _arrayEach : _baseEach;
    return func(collection, _castFunction(iteratee));
  }

  var forEach_1 = forEach;

  var each = forEach_1;

  /**
   * Creates an object with the same keys as `object` and values generated
   * by running each own enumerable string keyed property of `object` thru
   * `iteratee`. The iteratee is invoked with three arguments:
   * (value, key, object).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Object} Returns the new mapped object.
   * @see _.mapKeys
   * @example
   *
   * var users = {
   *   'fred':    { 'user': 'fred',    'age': 40 },
   *   'pebbles': { 'user': 'pebbles', 'age': 1 }
   * };
   *
   * _.mapValues(users, function(o) { return o.age; });
   * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
   *
   * // The `_.property` iteratee shorthand.
   * _.mapValues(users, 'age');
   * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
   */
  function mapValues(object, iteratee) {
    var result = {};
    iteratee = _baseIteratee(iteratee);

    _baseForOwn(object, function(value, key, object) {
      _baseAssignValue(result, key, iteratee(value, key, object));
    });
    return result;
  }

  var mapValues_1 = mapValues;

  /** Built-in value references. */
  var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */
  function isFlattenable(value) {
    return isArray_1(value) || isArguments_1(value) ||
      !!(spreadableSymbol && value && value[spreadableSymbol]);
  }

  var _isFlattenable = isFlattenable;

  /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;

    predicate || (predicate = _isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          _arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  var _baseFlatten = baseFlatten;

  /** Used as references for various `Number` constants. */
  var INFINITY$2 = 1 / 0;

  /**
   * Recursively flattens `array`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flattenDeep([1, [2, [3, [4]], 5]]);
   * // => [1, 2, 3, 4, 5]
   */
  function flattenDeep(array) {
    var length = array == null ? 0 : array.length;
    return length ? _baseFlatten(array, INFINITY$2) : [];
  }

  var flattenDeep_1 = flattenDeep;

  /**
   * The base implementation of `_.map` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var index = -1,
        result = isArrayLike_1(collection) ? Array(collection.length) : [];

    _baseEach(collection, function(value, key, collection) {
      result[++index] = iteratee(value, key, collection);
    });
    return result;
  }

  var _baseMap = baseMap;

  /**
   * Creates an array of values by running each element in `collection` thru
   * `iteratee`. The iteratee is invoked with three arguments:
   * (value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
   * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
   * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
   * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * _.map([4, 8], square);
   * // => [16, 64]
   *
   * _.map({ 'a': 4, 'b': 8 }, square);
   * // => [16, 64] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // The `_.property` iteratee shorthand.
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */
  function map(collection, iteratee) {
    var func = isArray_1(collection) ? _arrayMap : _baseMap;
    return func(collection, _baseIteratee(iteratee));
  }

  var map_1 = map;

  var fixUtf8 = function (str) {
    return str
    // U+20AC  0x80  € â‚¬   %E2 %82 %AC
    .replace(/â‚¬/g, '€')
    // U+201A  0x82  ‚ â€š   %E2 %80 %9A
    .replace(/â€š/g, '‚')
    // U+0192  0x83  ƒ Æ’  %C6 %92
    .replace(/Æ’/g, 'ƒ')
    // U+201E  0x84  „ â€ž   %E2 %80 %9E
    .replace(/â€ž/g, '„')
    // U+2026  0x85  … â€¦   %E2 %80 %A6
    .replace(/â€¦/g, '…')
    // U+2020  0x86  † â€  %E2 %80 %A0
    .replace(/â€\u00A0/g, '†')
    // U+2021  0x87  ‡ â€¡   %E2 %80 %A1
    .replace(/â€¡/g, '‡')
    // U+02C6  0x88  ˆ Ë†  %CB %86
    .replace(/Ë†/g, 'ˆ')
    // U+2030  0x89  ‰ â€°   %E2 %80 %B0
    .replace(/â€°/g, '‰')
    // U+0160  0x8A  Š Å   %C5 %A0
    .replace(/Å\u00A0/g, 'Š')
    // U+2039  0x8B  ‹ â€¹   %E2 %80 %B9
    .replace(/â€¹/g, '‹')
    // U+0152  0x8C  Œ Å’  %C5 %92
    .replace(/Å’/g, 'Œ')
    // U+017D  0x8E  Ž Å½  %C5 %BD
    .replace(/Å½/g, 'Ž')
    // U+2018  0x91  ‘ â€˜   %E2 %80 %98
    .replace(/â€˜/g, '‘')
    // U+2019  0x92  ’ â€™   %E2 %80 %99
    .replace(/â€™/g, '’')
    // U+201C  0x93  “ â€œ   %E2 %80 %9C
    .replace(/â€œ/g, '“')
    // U+201D  0x94  ” â€  %E2 %80 %9D
    .replace(/â€\u009D/g, '”')
    // U+2022  0x95  • â€¢   %E2 %80 %A2
    .replace(/â€¢/g, '•')
    // U+2013  0x96  – â€“   %E2 %80 %93
    .replace(/â€“/g, '–')
    // U+2014  0x97  — â€”   %E2 %80 %94
    .replace(/â€”/g, '—')
    // U+02DC  0x98  ˜ Ëœ  %CB %9C
    .replace(/Ëœ/g, '˜')
    // U+2122  0x99  ™ â„¢   %E2 %84 %A2
    .replace(/â„¢/g, '™')
    // U+0161  0x9A  š Å¡  %C5 %A1
    .replace(/Å¡/g, 'š')
    // U+203A  0x9B  › â€º   %E2 %80 %BA
    .replace(/â€º/g, '›')
    // U+0153  0x9C  œ Å“  %C5 %93
    .replace(/Å“/g, 'œ')
    // U+017E  0x9E  ž Å¾  %C5 %BE
    .replace(/Å¾/g, 'ž')
    // U+0178  0x9F  Ÿ Å¸  %C5 %B8
    .replace(/Å¸/g, 'Ÿ')
    // U+00A0  0xA0    Â   %C2 %A0
    .replace(/Â /g, ' ')
    // U+00A1  0xA1  ¡ Â¡  %C2 %A1
    .replace(/Â¡/g, '¡')
    // U+00A2  0xA2  ¢ Â¢  %C2 %A2
    .replace(/Â¢/g, '¢')
    // U+00A3  0xA3  £ Â£  %C2 %A3
    .replace(/Â£/g, '£')
    // U+00A4  0xA4  ¤ Â¤  %C2 %A4
    .replace(/Â¤/g, '¤')
    // U+00A5  0xA5  ¥ Â¥  %C2 %A5
    .replace(/Â¥/g, '¥')
    // U+00A6  0xA6  ¦ Â¦  %C2 %A6
    .replace(/Â¦/g, '¦')
    // U+00A7  0xA7  § Â§  %C2 %A7
    .replace(/Â§/g, '§')
    // U+00A8  0xA8  ¨ Â¨  %C2 %A8
    .replace(/Â¨/g, '¨')
    // U+00A9  0xA9  © Â©  %C2 %A9
    .replace(/Â©/g, '©')
    // U+00AA  0xAA  ª Âª  %C2 %AA
    .replace(/Âª/g, 'ª')
    // U+00AB  0xAB  « Â«  %C2 %AB
    .replace(/Â«/g, '«')
    // U+00AC  0xAC  ¬ Â¬  %C2 %AC
    .replace(/Â¬/g, '¬')
    // U+00AD  0xAD  ­ Â­  %C2 %AD
    .replace(/Â­/g, '­')
    // U+00AE  0xAE  ® Â®  %C2 %AE
    .replace(/Â®/g, '®')
    // U+00AF  0xAF  ¯ Â¯  %C2 %AF
    .replace(/Â¯/g, '¯')
    // U+00B0  0xB0  ° Â°  %C2 %B0
    .replace(/Â°/g, '°')
    // U+00B1  0xB1  ± Â±  %C2 %B1
    .replace(/Â±/g, '±')
    // U+00B2  0xB2  ² Â²  %C2 %B2
    .replace(/Â²/g, '²')
    // U+00B3  0xB3  ³ Â³  %C2 %B3
    .replace(/Â³/g, '³')
    // U+00B4  0xB4  ´ Â´  %C2 %B4
    .replace(/Â´/g, '´')
    // U+00B5  0xB5  µ Âµ  %C2 %B5
    .replace(/Âµ/g, 'µ')
    // U+00B6  0xB6  ¶ Â¶  %C2 %B6
    .replace(/Â¶/g, '¶')
    // U+00B7  0xB7  · Â·  %C2 %B7
    .replace(/Â·/g, '·')
    // U+00B8  0xB8  ¸ Â¸  %C2 %B8
    .replace(/Â¸/g, '¸')
    // U+00B9  0xB9  ¹ Â¹  %C2 %B9
    .replace(/Â¹/g, '¹')
    // U+00BA  0xBA  º Âº  %C2 %BA
    .replace(/Âº/g, 'º')
    // U+00BB  0xBB  » Â»  %C2 %BB
    .replace(/Â»/g, '»')
    // U+00BC  0xBC  ¼ Â¼  %C2 %BC
    .replace(/Â¼/g, '¼')
    // U+00BD  0xBD  ½ Â½  %C2 %BD
    .replace(/Â½/g, '½')
    // U+00BE  0xBE  ¾ Â¾  %C2 %BE
    .replace(/Â¾/g, '¾')
    // U+00BF  0xBF  ¿ Â¿  %C2 %BF
    .replace(/Â¿/g, '¿')
    // U+00C0  0xC0  À Ã€  %C3 %80
    .replace(/Ã€/g, 'À')
    // U+00C2  0xC2  Â Ã‚  %C3 %82
    .replace(/Ã‚/g, 'Â')
    // U+00C3  0xC3  Ã Ãƒ  %C3 %83
    .replace(/Ãƒ/g, 'Ã')
    // U+00C4  0xC4  Ä Ã„  %C3 %84
    .replace(/Ã„/g, 'Ä')
    // U+00C5  0xC5  Å Ã…  %C3 %85
    .replace(/Ã…/g, 'Å')
    // U+00C6  0xC6  Æ Ã†  %C3 %86
    .replace(/Ã†/g, 'Æ')
    // U+00C7  0xC7  Ç Ã‡  %C3 %87
    .replace(/Ã‡/g, 'Ç')
    // U+00C8  0xC8  È Ãˆ  %C3 %88
    .replace(/Ãˆ/g, 'È')
    // U+00C9  0xC9  É Ã‰  %C3 %89
    .replace(/Ã‰/g, 'É')
    // U+00CA  0xCA  Ê ÃŠ  %C3 %8A
    .replace(/ÃŠ/g, 'Ê')
    // U+00CB  0xCB  Ë Ã‹  %C3 %8B
    .replace(/Ã‹/g, 'Ë')
    // U+00CC  0xCC  Ì ÃŒ  %C3 %8C
    .replace(/ÃŒ/g, 'Ì')
    // U+00CD  0xCD  Í Ã   %C3 %8D
    .replace(/Ã\u008D/g, 'Í')
    // U+00CE  0xCE  Î ÃŽ  %C3 %8E
    .replace(/ÃŽ/g, 'Î')
    // U+00CF  0xCF  Ï Ã   %C3 %8F
    .replace(/Ã\u008F/g, 'Ï')
    // U+00D0  0xD0  Ð Ã   %C3 %90
    .replace(/Ã\u0090/g, 'Ð')
    // U+00D1  0xD1  Ñ Ã‘  %C3 %91
    .replace(/Ã‘/g, 'Ñ')
    // U+00D2  0xD2  Ò Ã’  %C3 %92
    .replace(/Ã’/g, 'Ò')
    // U+00D3  0xD3  Ó Ã“  %C3 %93
    .replace(/Ã“/g, 'Ó')
    // U+00D4  0xD4  Ô Ã”  %C3 %94
    .replace(/Ã”/g, 'Ô')
    // U+00D5  0xD5  Õ Ã•  %C3 %95
    .replace(/Ã•/g, 'Õ')
    // U+00D6  0xD6  Ö Ã–  %C3 %96
    .replace(/Ã–/g, 'Ö')
    // U+00D7  0xD7  × Ã—  %C3 %97
    .replace(/Ã—/g, '×')
    // U+00D8  0xD8  Ø Ã˜  %C3 %98
    .replace(/Ã˜/g, 'Ø')
    // U+00D9  0xD9  Ù Ã™  %C3 %99
    .replace(/Ã™/g, 'Ù')
    // U+00DA  0xDA  Ú Ãš  %C3 %9A
    .replace(/Ãš/g, 'Ú')
    // U+00DB  0xDB  Û Ã›  %C3 %9B
    .replace(/Ã›/g, 'Û')
    // U+00DC  0xDC  Ü Ãœ  %C3 %9C
    .replace(/Ãœ/g, 'Ü')
    // U+00DD  0xDD  Ý Ã   %C3 %9D
    .replace(/Ã\u009D/g, 'Ý')
    // U+00DE  0xDE  Þ Ãž  %C3 %9E
    .replace(/Ãž/g, 'Þ')
    // U+00DF  0xDF  ß ÃŸ  %C3 %9F
    .replace(/ÃŸ/g, 'ß')
    // U+00E0  0xE0  à Ã   %C3 %A0
    .replace(/Ã\u00A0/g, 'à')
    // U+00E1  0xE1  á Ã¡  %C3 %A1
    .replace(/Ã¡/g, 'á')
    // U+00E2  0xE2  â Ã¢  %C3 %A2
    .replace(/Ã¢/g, 'â')
    // U+00E3  0xE3  ã Ã£  %C3 %A3
    .replace(/Ã£/g, 'ã')
    // U+00E4  0xE4  ä Ã¤  %C3 %A4
    .replace(/Ã¤/g, 'ä')
    // U+00E5  0xE5  å Ã¥  %C3 %A5
    .replace(/Ã¥/g, 'å')
    // U+00E6  0xE6  æ Ã¦  %C3 %A6
    .replace(/Ã¦/g, 'æ')
    // U+00E7  0xE7  ç Ã§  %C3 %A7
    .replace(/Ã§/g, 'ç')
    // U+00E8  0xE8  è Ã¨  %C3 %A8
    .replace(/Ã¨/g, 'è')
    // U+00E9  0xE9  é Ã©  %C3 %A9
    .replace(/Ã©/g, 'é')
    // U+00EA  0xEA  ê Ãª  %C3 %AA
    .replace(/Ãª/g, 'ê')
    // U+00EB  0xEB  ë Ã«  %C3 %AB
    .replace(/Ã«/g, 'ë')
    // U+00EC  0xEC  ì Ã¬  %C3 %AC
    .replace(/Ã¬/g, 'ì')
    // U+00ED  0xED  í Ã­  %C3 %AD
    .replace(/Ã\u00AD/g, 'í')
    // U+00EE  0xEE  î Ã®  %C3 %AE
    .replace(/Ã®/g, 'î')
    // U+00EF  0xEF  ï Ã¯  %C3 %AF
    .replace(/Ã¯/g, 'ï')
    // U+00F0  0xF0  ð Ã°  %C3 %B0
    .replace(/Ã°/g, 'ð')
    // U+00F1  0xF1  ñ Ã±  %C3 %B1
    .replace(/Ã±/g, 'ñ')
    // U+00F2  0xF2  ò Ã²  %C3 %B2
    .replace(/Ã²/g, 'ò')
    // U+00F3  0xF3  ó Ã³  %C3 %B3
    .replace(/Ã³/g, 'ó')
    // U+00F4  0xF4  ô Ã´  %C3 %B4
    .replace(/Ã´/g, 'ô')
    // U+00F5  0xF5  õ Ãµ  %C3 %B5
    .replace(/Ãµ/g, 'õ')
    // U+00F6  0xF6  ö Ã¶  %C3 %B6
    .replace(/Ã¶/g, 'ö')
    // U+00F7  0xF7  ÷ Ã·  %C3 %B7
    .replace(/Ã·/g, '÷')
    // U+00F8  0xF8  ø Ã¸  %C3 %B8
    .replace(/Ã¸/g, 'ø')
    // U+00F9  0xF9  ù Ã¹  %C3 %B9
    .replace(/Ã¹/g, 'ù')
    // U+00FA  0xFA  ú Ãº  %C3 %BA
    .replace(/Ãº/g, 'ú')
    // U+00FB  0xFB  û Ã»  %C3 %BB
    .replace(/Ã»/g, 'û')
    // U+00FC  0xFC  ü Ã¼  %C3 %BC
    .replace(/Ã¼/g, 'ü')
    // U+00FD  0xFD  ý Ã½  %C3 %BD
    .replace(/Ã½/g, 'ý')
    // U+00FE  0xFE  þ Ã¾  %C3 %BE
    .replace(/Ã¾/g, 'þ')
    // U+00FF  0xFF  ÿ Ã¿  %C3 %BF
    .replace(/Ã¿/g, 'ÿ')
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    .normalize()
  };

  var formatMap = {
    d: 'DD',
    D: 'ddd',
    j: 'D',
    l: 'dddd',
    N: 'E',
    S: function S() {
      return ("[" + (this.format('Do').replace(/\d*/g, '')) + "]");
    },
    w: 'd',
    z: function z() {
      return this.format('DDD') - 1;
    },
    W: 'W',
    F: 'MMMM',
    m: 'MM',
    M: 'MMM',
    n: 'M',
    t: function t() {
      return this.daysInMonth();
    },
    L: function L() {
      return this.isLeapYear() ? 1 : 0;
    },
    o: 'GGGG',
    Y: 'YYYY',
    y: 'YY',
    a: 'a',
    A: 'A',
    B: function B(moment) {
      var thisUTC = moment.clone().utc();
      var swatch = ((thisUTC.hours() + 1) % 24) + (thisUTC.minutes() / 60)
        + (thisUTC.seconds() / 3600);
      return Math.floor((swatch * 1000) / 24);
    },
    g: 'h',
    G: 'H',
    h: 'hh',
    H: 'HH',
    i: 'mm',
    s: 'ss',
    u: '[u]', // not sure if moment has this
    e: '[e]', // moment does not have this
    I: function I(moment) {
      return moment.isDST() ? 1 : 0;
    },
    O: 'ZZ',
    P: 'Z',
    T: '[T]', // deprecated in moment
    Z: function Z(moment) {
      return parseInt(moment.format('ZZ'), 10) * 36;
    },
    c: 'YYYY-MM-DD[T]HH:mm:ssZ',
    r: 'ddd, DD MMM YYYY HH:mm:ss ZZ',
    U: 'X',
  };

  var formatEx = /[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g;

  function phpMoment(format, moment) {
    return format.replace(formatEx, function (phpStr) { return (typeof formatMap[phpStr] === 'function' ? formatMap[phpStr](moment) : formatMap[phpStr]); });
  }

  var numeroRegex = /numero/i;
  var dataRegex = /data(?!base)/i;

  numeral__default['default'].register('locale', 'pt-br', {
    delimiters: {
      thousands: '.',
      decimal: ',',
    },
    abbreviations: {
      thousand: 'mil',
      million: 'milhões',
      billion: 'b',
      trillion: 't',
    },
    ordinal: function ordinal() {
      return 'º';
    },
    currency: {
      symbol: 'R$',
    },
  });

  numeral__default['default'].locale('pt-br');

  function camelObject(from) {
    var obj = {};
    each(from, function (v, k) {
      obj[camelCase(k)] = v;
    });
    return obj;
  }

  function formatNumeroProcesso(proc) {
    if (!proc.numeroProcesso) { return proc; }

    var ret = proc;

    try {
      var cnj = CalculateCNJ__default['default'].load(ret.numeroProcesso);
      ret.numeroProcesso = cnj.generate(true); /* cnj mask */
      ret.cnj = cnj.pieces;
    } catch (e) {
      /* pass */
    }

    return ret;
  }


  var Processo = /*@__PURE__*/(function (Parser) {
    function Processo(elementProcesso, $) {
      Parser.call(this, $);
      this.elementProcesso = elementProcesso;
    }

    if ( Parser ) Processo.__proto__ = Parser;
    Processo.prototype = Object.create( Parser && Parser.prototype );
    Processo.prototype.constructor = Processo;

    var prototypeAccessors = { dadosCaptura: { configurable: true },adicional: { configurable: true },ajuizamento: { configurable: true },area: { configurable: true },assunto: { configurable: true },atas: { configurable: true },cartorio: { configurable: true },codigoReu: { configurable: true },comarcaInicial: { configurable: true },decisao: { configurable: true },foro: { configurable: true },inscricao: { configurable: true },localizacao: { configurable: true },localizacaoImovel: { configurable: true },nome: { configurable: true },numeroDivida: { configurable: true },numeroVara: { configurable: true },observacao: { configurable: true },orgao: { configurable: true },origemProcesso: { configurable: true },rito: { configurable: true },solucao: { configurable: true },acao: { configurable: true },andamentoInicial: { configurable: true },autuacao: { configurable: true },classe: { configurable: true },comarca: { configurable: true },dataValorCausa: { configurable: true },descricao: { configurable: true },distribuicao: { configurable: true },fase: { configurable: true },incidente: { configurable: true },instancia: { configurable: true },natureza: { configurable: true },numeroAntigo: { configurable: true },numeroProcesso: { configurable: true },numeroProtocolo: { configurable: true },eletronico: { configurable: true },situacao: { configurable: true },status: { configurable: true },valorCausa: { configurable: true },vara: { configurable: true },justiceSecret: { configurable: true },transitoJulgado: { configurable: true },urlProcesso: { configurable: true },adicionalAttributes: { configurable: true },ajuizamentoAttributes: { configurable: true },areaAttributes: { configurable: true },assuntoAttributes: { configurable: true },atasAttributes: { configurable: true },cartorioAttributes: { configurable: true },codigoReuAttributes: { configurable: true },comarcaInicialAttributes: { configurable: true },decisaoAttributes: { configurable: true },foroAttributes: { configurable: true },inscricaoAttributes: { configurable: true },localizacaoAttributes: { configurable: true },localizacaoImovelAttributes: { configurable: true },nomeAttributes: { configurable: true },numeroDividaAttributes: { configurable: true },numeroVaraAttributes: { configurable: true },observacaoAttributes: { configurable: true },orgaoAttributes: { configurable: true },origemProcessoAttributes: { configurable: true },ritoAttributes: { configurable: true },solucaoAttributes: { configurable: true },acaoAttributes: { configurable: true },andamentoInicialAttributes: { configurable: true },autuacaoAttributes: { configurable: true },classeAttributes: { configurable: true },comarcaAttributes: { configurable: true },dataValorCausaAttributes: { configurable: true },descricaoAttributes: { configurable: true },distribuicaoAttributes: { configurable: true },faseAttributes: { configurable: true },incidenteAttributes: { configurable: true },instanciaAttributes: { configurable: true },naturezaAttributes: { configurable: true },numeroAntigoAttributes: { configurable: true },numeroProcessoAttributes: { configurable: true },numeroProtocoloAttributes: { configurable: true },eletronicoAttributes: { configurable: true },situacaoAttributes: { configurable: true },statusAttributes: { configurable: true },valorCausaAttributes: { configurable: true },varaAttributes: { configurable: true },justiceSecretAttributes: { configurable: true },transitoJulgadoAttributes: { configurable: true },urlProcessoAttributes: { configurable: true },advogados: { configurable: true },partes: { configurable: true },documentos: { configurable: true },andamentos: { configurable: true },tags: { configurable: true } };

    Processo.formatItem = function formatItem (v, k, dump) {
      var this$1 = this;

      if (Array.isArray(v)) { return v.map(function (n) { return this$1.formatItem(n, k, dump); }); }
      if (typeof v === 'object') { return Processo.format(v); }
      if (k === 'numeroProcesso') { return v; }
      if (k === 'numeroAntigo') { return v; }
      if (['valorCausa', 'instancia'].indexOf(k) !== -1 || numeroRegex.test(k)) { return numeral__default['default'](v).value(); }
      if (k === 'eletronico') { return v === '1'; }
      if (dataRegex.test(k) || ['inscricao', 'transitoJulgado', 'ajuizamento', 'autuacao', 'distribuicao', 'andamentoInicial', 'dataValorCausa'].indexOf(k) !== -1) {
        var n = moment__default['default'](v, phpMoment(dump.format || (dump[(k + "Attributes")] ? dump[(k + "Attributes")].format : null) || 'd/m/Y'));
        return n.isValid() ? n.toDate() : v;
      }

      return v;
    };

    Processo.format = function format (dump) {
      var ret = mapValues_1(dump, function (v, k) { return Processo.formatItem(v, k, dump); });
      ret = formatNumeroProcesso(ret);
      return ret;
    };

    Processo.prototype.getter = function getter (name, attributes, df) {
      if ( attributes === void 0 ) attributes = {};
      if ( df === void 0 ) df = null;

      var ref = this;
      var $ = ref.$;
      var element = $(this.elementProcesso).children(name);
      if (!element.length) { return df; }
      var textValue = element.text();
      objectAssign(attributes, element.get().attribs);
      return fixUtf8(textValue);
    };

    Processo.prototype.attributes = function attributes (name, df) {
      if ( df === void 0 ) df = null;

      var ref = this;
      var $ = ref.$;
      var element = $(this.elementProcesso).children(name);
      if (!element.length) { return df; }
      var ref$1 = element.get();
      var attribs = ref$1.attribs;
      return attribs ? mapValues_1(camelObject(attribs), function (v) { return fixUtf8(v); }) : df;
    };

    prototypeAccessors.dadosCaptura.get = function () { return this.elementProcesso.attribs; };

    prototypeAccessors.adicional.get = function () { return this.getter('adicional'); };

    prototypeAccessors.ajuizamento.get = function () { return this.getter('ajuizamento'); };

    prototypeAccessors.area.get = function () { return this.getter('area'); };

    prototypeAccessors.assunto.get = function () { return this.getter('assunto'); };

    prototypeAccessors.atas.get = function () { return this.getter('atas'); };

    prototypeAccessors.cartorio.get = function () { return this.getter('cartorio'); };

    prototypeAccessors.codigoReu.get = function () { return this.getter('codigo_reu'); };

    prototypeAccessors.comarcaInicial.get = function () { return this.getter('comarca_inicial'); };

    prototypeAccessors.decisao.get = function () { return this.getter('decisao'); };

    prototypeAccessors.foro.get = function () { return this.getter('foro'); };

    prototypeAccessors.inscricao.get = function () { return this.getter('inscricao'); };

    prototypeAccessors.localizacao.get = function () { return this.getter('localizacao'); };

    prototypeAccessors.localizacaoImovel.get = function () { return this.getter('localizacao_imovel'); };

    prototypeAccessors.nome.get = function () { return this.getter('nome'); };

    prototypeAccessors.numeroDivida.get = function () { return this.getter('numero_divida'); };

    prototypeAccessors.numeroVara.get = function () { return this.getter('numero_vara'); };

    prototypeAccessors.observacao.get = function () { return this.getter('observacao'); };

    prototypeAccessors.orgao.get = function () { return this.getter('orgao'); };

    prototypeAccessors.origemProcesso.get = function () { return this.getter('origem_processo'); };

    prototypeAccessors.rito.get = function () { return this.getter('rito'); };

    prototypeAccessors.solucao.get = function () { return this.getter('solucao'); };

    prototypeAccessors.acao.get = function () { return this.getter('acao'); };

    prototypeAccessors.andamentoInicial.get = function () { return this.getter('andamento_inicial'); };

    prototypeAccessors.autuacao.get = function () { return this.getter('autuacao'); };

    prototypeAccessors.classe.get = function () { return this.getter('classe'); };

    prototypeAccessors.comarca.get = function () { return this.getter('comarca'); };

    prototypeAccessors.dataValorCausa.get = function () { return this.getter('data_valor_causa'); };

    prototypeAccessors.descricao.get = function () { return this.getter('descricao'); };

    prototypeAccessors.distribuicao.get = function () { return this.getter('distribuicao'); };

    prototypeAccessors.fase.get = function () { return this.getter('fase'); };

    prototypeAccessors.incidente.get = function () { return this.getter('incidente'); };

    prototypeAccessors.instancia.get = function () { return this.getter('instancia'); };

    prototypeAccessors.natureza.get = function () { return this.getter('natureza'); };

    prototypeAccessors.numeroAntigo.get = function () { return this.getter('numero_antigo'); };

    prototypeAccessors.numeroProcesso.get = function () { return this.getter('numero_processo'); };

    prototypeAccessors.numeroProtocolo.get = function () { return this.getter('numero_protocolo'); };

    prototypeAccessors.eletronico.get = function () { return this.getter('eletronico'); };

    prototypeAccessors.situacao.get = function () { return this.getter('situacao'); };

    prototypeAccessors.status.get = function () { return this.getter('status'); };

    prototypeAccessors.valorCausa.get = function () { return this.getter('valor_causa'); };

    prototypeAccessors.vara.get = function () { return this.getter('vara'); };

    prototypeAccessors.justiceSecret.get = function () { return this.getter('justiceSecret'); };

    prototypeAccessors.transitoJulgado.get = function () { return this.getter('transitoJulgado'); };

    prototypeAccessors.urlProcesso.get = function () { return this.getter('url_processo'); };

    prototypeAccessors.adicionalAttributes.get = function () { return this.attributes('adicional'); };

    prototypeAccessors.ajuizamentoAttributes.get = function () { return this.attributes('ajuizamento'); };

    prototypeAccessors.areaAttributes.get = function () { return this.attributes('area'); };

    prototypeAccessors.assuntoAttributes.get = function () { return this.attributes('assunto'); };

    prototypeAccessors.atasAttributes.get = function () { return this.attributes('atas'); };

    prototypeAccessors.cartorioAttributes.get = function () { return this.attributes('cartorio'); };

    prototypeAccessors.codigoReuAttributes.get = function () { return this.attributes('codigo_reu'); };

    prototypeAccessors.comarcaInicialAttributes.get = function () { return this.attributes('comarca_inicial'); };

    prototypeAccessors.decisaoAttributes.get = function () { return this.attributes('decisao'); };

    prototypeAccessors.foroAttributes.get = function () { return this.attributes('foro'); };

    prototypeAccessors.inscricaoAttributes.get = function () { return this.attributes('inscricao'); };

    prototypeAccessors.localizacaoAttributes.get = function () { return this.attributes('localizacao'); };

    prototypeAccessors.localizacaoImovelAttributes.get = function () { return this.attributes('localizacao_imovel'); };

    prototypeAccessors.nomeAttributes.get = function () { return this.attributes('nome'); };

    prototypeAccessors.numeroDividaAttributes.get = function () { return this.attributes('numero_divida'); };

    prototypeAccessors.numeroVaraAttributes.get = function () { return this.attributes('numero_vara'); };

    prototypeAccessors.observacaoAttributes.get = function () { return this.attributes('observacao'); };

    prototypeAccessors.orgaoAttributes.get = function () { return this.attributes('orgao'); };

    prototypeAccessors.origemProcessoAttributes.get = function () { return this.attributes('origem_processo'); };

    prototypeAccessors.ritoAttributes.get = function () { return this.attributes('rito'); };

    prototypeAccessors.solucaoAttributes.get = function () { return this.attributes('solucao'); };

    prototypeAccessors.acaoAttributes.get = function () { return this.attributes('acao'); };

    prototypeAccessors.andamentoInicialAttributes.get = function () { return this.attributes('andamento_inicial'); };

    prototypeAccessors.autuacaoAttributes.get = function () { return this.attributes('autuacao'); };

    prototypeAccessors.classeAttributes.get = function () { return this.attributes('classe'); };

    prototypeAccessors.comarcaAttributes.get = function () { return this.attributes('comarca'); };

    prototypeAccessors.dataValorCausaAttributes.get = function () { return this.attributes('data_valor_causa'); };

    prototypeAccessors.descricaoAttributes.get = function () { return this.attributes('descricao'); };

    prototypeAccessors.distribuicaoAttributes.get = function () { return this.attributes('distribuicao'); };

    prototypeAccessors.faseAttributes.get = function () { return this.attributes('fase'); };

    prototypeAccessors.incidenteAttributes.get = function () { return this.attributes('incidente'); };

    prototypeAccessors.instanciaAttributes.get = function () { return this.attributes('instancia'); };

    prototypeAccessors.naturezaAttributes.get = function () { return this.attributes('natureza'); };

    prototypeAccessors.numeroAntigoAttributes.get = function () { return this.attributes('numero_antigo'); };

    prototypeAccessors.numeroProcessoAttributes.get = function () { return this.attributes('numero_processo'); };

    prototypeAccessors.numeroProtocoloAttributes.get = function () { return this.attributes('numero_protocolo'); };

    prototypeAccessors.eletronicoAttributes.get = function () { return this.attributes('eletronico'); };

    prototypeAccessors.situacaoAttributes.get = function () { return this.attributes('situacao'); };

    prototypeAccessors.statusAttributes.get = function () { return this.attributes('status'); };

    prototypeAccessors.valorCausaAttributes.get = function () { return this.attributes('valor_causa'); };

    prototypeAccessors.varaAttributes.get = function () { return this.attributes('vara'); };

    prototypeAccessors.justiceSecretAttributes.get = function () { return this.attributes('justiceSecret'); };

    prototypeAccessors.transitoJulgadoAttributes.get = function () { return this.attributes('transitoJulgado'); };

    prototypeAccessors.urlProcessoAttributes.get = function () { return this.attributes('url_processo'); };

    prototypeAccessors.advogados.get = function () {
      var ref = this;
      var $ = ref.$;
      return $('advogados advogado', this.elementProcesso).map(function (i, advogado) { return objectAssign({}, camelObject(advogado.attribs), {
        nome: $(advogado).text().trim(),
      }); }).get();
    };

    prototypeAccessors.partes.get = function () {
      var ref = this;
      var $ = ref.$;
      return $('partes parte', this.elementProcesso).map(function (i, parte) { return objectAssign(
        {},
        mapValues_1(camelObject(parte.attribs), function (v) { return fixUtf8(v); }), {
          nome: fixUtf8($(parte).text().trim()),
        }
      ); }).get();
    };

    prototypeAccessors.documentos.get = function () {
      var ref = this;
      var $ = ref.$;
      return $('documentos documento', this.elementProcesso).map(function (i, andamento) { return objectAssign.apply(void 0, flattenDeep_1($(andamento).children().map(function (ik, k) {
        var obj;

        return [( obj = {}, obj[camelCase(k.name)] = fixUtf8($(k).text()), obj ), k.attribs || {}];
        }).get())); }).get();
    };


    prototypeAccessors.andamentos.get = function () {
      var ref = this;
      var $ = ref.$;
      return $('andamentos andamento', this.elementProcesso).map(function (i, andamento) { return objectAssign.apply(void 0, flattenDeep_1($(andamento).children().map(function (ik, k) {
        var obj;

        return [( obj = {}, obj[camelCase(k.name)] = fixUtf8($(k).text()), obj ), k.attribs || {}];
        }).get())); }).get()
        .reduce(function (obj, item) {
          var obj$1;

          return objectAssign(obj, ( obj$1 = {}, obj$1[item.hash] = item, obj$1 ));
      }, {});
    };

    prototypeAccessors.tags.get = function () {
      var ref = this;
      var $ = ref.$;
      var tags = $('tags tag', this.elementProcesso).map(function (i, tag) {
        var obj;

        return (( obj = {}, obj[$(tag).text().trim()] = camelObject(tag.attribs), obj ));
      }).get();
      if (!tags.length) { return {}; }
      return objectAssign.apply(void 0, tags);
    };

    Processo.prototype.dump = function dump () {
      var this$1 = this;

      var items = map_1(
        Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this)),
        function (v, key) {
          var obj;

          if (typeof v.get !== 'function') { return null; }
          var value = v.get.apply(this$1);
          if (!value) { return null; }
          return ( obj = {}, obj[camelCase(key)] = value, obj );
        }
      ).filter(function (x) { return !!x; });
      if (!items.length) { return {}; }
      return Processo.format(objectAssign.apply(void 0, [ {} ].concat( items )));
    };

    Object.defineProperties( Processo.prototype, prototypeAccessors );

    return Processo;
  }(Parser));

  var OAB = /*@__PURE__*/(function (Parser) {
    function OAB () {
      Parser.apply(this, arguments);
    }

    if ( Parser ) OAB.__proto__ = Parser;
    OAB.prototype = Object.create( Parser && Parser.prototype );
    OAB.prototype.constructor = OAB;

    OAB.prototype.readNode = function readNode (key, node) {
      var obj;

      var ref = this;
      var $ = ref.$;

      return pickBy_1(objectAssign({}, node.attribs, ( obj = {}, obj[key] = $(node).text().trim(), obj )), function (v) { return !!v; });
    };

    OAB.prototype.childrenDump = function childrenDump (node, children) {
      var this$1 = this;
      if ( children === void 0 ) children = false;

      var ref = this;
      var $ = ref.$;

      var element = $(node);
      var nodeChildren = element.children();

      if (children) {
        return this.readNode(camelCase(node.name), node);
      }

      return objectAssign.apply(void 0, nodeChildren.map(function (ip, e) {
        var obj;

        var key = camelCase(e.name);

        var elementChildren = $(e).children();
        if (elementChildren.length) {
          return ( obj = {}, obj[("" + key)] = elementChildren.map(function (i, n) { return this$1.childrenDump(n, true); }).get(), obj );
        }

        return this$1.readNode(key, e);
      }).get());
    };

    OAB.formatQuery = function formatQuery (proc) {
      var ret = proc;
      ret.query = "SELECT FROM '" + (proc.tribunalNome) + "'.'" + (proc.tribunalConsulta) + "'";
      if (proc.parametros && proc.parametros.length) {
        ret.query += " WHERE " + (proc.parametros.map(function (ref) {
          var name = ref.name;
          var parametro = ref.parametro;

          return ("'" + name + "' = '" + parametro + "'");
        }).join(' AND '));
      }
      return ret;
    };

    OAB.prototype.dump = function dump () {
      var this$1 = this;

      var ref = this;
      var $ = ref.$;
      return $('body advogado processos processo').map(function (i, processoNode) { return OAB
        .formatQuery(formatNumeroProcesso(this$1.childrenDump(processoNode))); }).get();
    };

    return OAB;
  }(Parser));

  var Processos = /*@__PURE__*/(function (Parser) {
    function Processos () {
      Parser.apply(this, arguments);
    }

    if ( Parser ) Processos.__proto__ = Parser;
    Processos.prototype = Object.create( Parser && Parser.prototype );
    Processos.prototype.constructor = Processos;

    Processos.prototype.dump = function dump () {
      var $ = Parser.prototype.dump.call(this);
      return $('body > processo').map(function (_, p) { return new Processo(p, $).parse(); }).get();
    };

    return Processos;
  }(Parser));

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  var _baseFindKey = baseFindKey;

  /**
   * This method is like `_.find` except that it returns the key of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Object
   * @param {Object} object The object to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @returns {string|undefined} Returns the key of the matched element,
   *  else `undefined`.
   * @example
   *
   * var users = {
   *   'barney':  { 'age': 36, 'active': true },
   *   'fred':    { 'age': 40, 'active': false },
   *   'pebbles': { 'age': 1,  'active': true }
   * };
   *
   * _.findKey(users, function(o) { return o.age < 40; });
   * // => 'barney' (iteration order is not guaranteed)
   *
   * // The `_.matches` iteratee shorthand.
   * _.findKey(users, { 'age': 1, 'active': true });
   * // => 'pebbles'
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.findKey(users, ['active', false]);
   * // => 'fred'
   *
   * // The `_.property` iteratee shorthand.
   * _.findKey(users, 'active');
   * // => 'barney'
   */
  function findKey(object, predicate) {
    return _baseFindKey(object, _baseIteratee(predicate), _baseForOwn);
  }

  var findKey_1 = findKey;

  var errorCodes = {
    E_INTERNAL_USER_BLOCKED: 0, // Usuário Bloqueado
    E_TABLE_NOT_FOUND: 1, // Tipo de consulta inexistente
    E_DATABASE_NOT_FOUND: 1, // Tribunal não suportado
    E_NOT_FOUND: 2, // Consulta não encontrada
    E_INVALID_ARGUMENT: 3, // Parâmetro de consulta inválido
    E_SYNTAX_ERROR: 3, // Erro de sintaxe
    E_MISSING_ARGUMENT: 4, // Parâmetro de consulta obrigatório inexistente
    E_MULTIPLE_RESULTS_FOUND: 5, // Consulta com múltiplos resultados
    E_BLOCKED_IP: 6, // IP do robô bloqueado
    E_UNEXPECTED_HTTP_CODE: 7, // Erro inesperado durante consulta ao site
    E_TIMEOUT: 7, // Ocorreu timeout durante a consulta
    E_LOAD_PAGE_FAILED: 7, // Erro de carregamento de página
    E_PROXY_CONFIGURATION_ERROR: 7, // Erro de configuração de proxy
    E_REMOTE_SITE_UNDER_MAINTENANCE: 8, // Site sob manutenção
    E_AUTHENTICATION_FAILURE: 9, // Erro ao logar no site
    E_INTERNAL_SERVER_ERROR: 11,
    E_INTERNAL_ERROR: 11, // Erro interno
    E_QUERY_LIMIT: 12, // Limite de consulta atingido
    E_PASSWORD_REQUIRED: 20, // Requer parâmetros de senha para acessar
    E_JUSTICE_SECRET: 21, // Segredo de Justiça
    E_EXPECTED_DATA_NOT_FOUND: 24, // Erro durante a obtenção dos dados
    E_CAPTCHA_BREAK_FAILED: 25, // Não foi possível quebrar o captcha

    E_INTERNAL_PUSH_LABEL: 26, // Já existe um PUSH com essa LABEL
    E_UNDER_MAINTENANCE: 27, // Nossas manutenções
    E_SITE_MESSAGE: 28, // Mensagem enviada pelo portal
    E_BLOCKED_BY_CONFIG: 29, // Bloqueado por uma configuração
    E_LEGAL_REVIEW: 30, // Revisão de Advogado
    E_RESOURCE_UNAVAILABLE: 31, // Recurso não disponível
    E_INTERNAL_EMAIL_UNCHECKED: 32, // Email interno não verificado
    E_INTERNAL_NOT_READY: 33,

    E_OUTDATED: 1522,
    E_ARCHIVED_PROCESS: 1522,
    E_WITHOUT_PROCEEDINGS: 1523,
    E_UNKNOWN: 1524,
    E_EMAIL_UNCHECKED: 1525,
    E_BLOCKED_USER: 1526,
  };

  function codename(k) {
    return findKey_1(errorCodes, function (n) { return n === k; }) || 'E_UNKNOWN';
  }

  exports.ExceptionCodes = errorCodes;
  exports.Info = Info;
  exports.JuristekException = JuristekException;
  exports.JuristekInstanceException = JuristekInstanceException;
  exports.JuristekParserException = JuristekParserException;
  exports.OAB = OAB;
  exports.Processos = Processos;
  exports.exceptionCodename = codename;
  exports.formatNumeroProcesso = formatNumeroProcesso;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
