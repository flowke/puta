"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _default(object) {
  var arr = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var val = object[key];

      if (typeof val === null) {
        val = '';
      } else if (_typeof(val) === undefined) {
        continue;
      } else if (typeof val === 'number') {
        val = val.toString();
      } else if (typeof val === 'boolean') {
        val = val.toString();
      } else if (type(val) === '[object Object]') {
        val = JSON.stringify(val);
      } else if (type(val) === '[object Array]') {
        val = JSON.stringify(val);
      } else if (typeof val !== 'string') {
        continue;
      }

      arr.push("".concat(key, "=").concat(val));
    }
  }

  return arr.join('&');
}

function type(val) {
  return Object.prototype.toString.call(val);
}