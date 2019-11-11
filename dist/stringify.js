"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

function _default(object) {
  var arr = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var val = object[key];

      if (val === null) {
        val = '';
      } else if (val === undefined) {
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