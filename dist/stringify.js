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
      arr.push("".concat(key, "=").concat(val.toString()));
    }
  }

  return arr.join('&');
}