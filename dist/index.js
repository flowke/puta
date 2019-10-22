"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es7.array.includes");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.function.name");

var _axios = _interopRequireDefault(require("axios"));

var _stringify = _interopRequireDefault(require("./stringify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Request =
/*#__PURE__*/
function () {
  function Request(initRequest, paths) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Request);

    _defineProperty(this, "post", function () {
      return _this.dataMethod('post').apply(void 0, arguments);
    });

    _defineProperty(this, "put", function () {
      return _this.dataMethod('put').apply(void 0, arguments);
    });

    _defineProperty(this, "patch", function () {
      return _this.dataMethod('patch').apply(void 0, arguments);
    });

    _defineProperty(this, "delete", function (url, data) {
      var op = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.request(_objectSpread({
        url: url,
        params: data,
        method: 'delete'
      }, op));
    });

    _defineProperty(this, "head", function (url, data) {
      var op = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.request(_objectSpread({
        url: url,
        params: data,
        method: 'head'
      }, op));
    });

    _defineProperty(this, "options", function (url, data) {
      var op = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.request(_objectSpread({
        url: url,
        params: data,
        method: 'options'
      }, op));
    });

    _defineProperty(this, "get", function (url, data) {
      var op = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.request(_objectSpread({
        url: url,
        params: data
      }, op));
    });

    _defineProperty(this, "request", function () {
      var op = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _this.axios(op);
    });

    _defineProperty(this, "setDefaults", function () {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (f) {
        return f;
      };
      cb(_this.axios.defaults);
    });

    _defineProperty(this, "reqUse", function () {
      var _this$axios$intercept;

      (_this$axios$intercept = _this.axios.interceptors.request).use.apply(_this$axios$intercept, arguments);
    });

    _defineProperty(this, "resUse", function () {
      var _this$axios$intercept2;

      (_this$axios$intercept2 = _this.axios.interceptors.response).use.apply(_this$axios$intercept2, arguments);
    });

    _defineProperty(this, "moduleRegister", function (apis, name, option) {
      return _this.mApis[name] = _this.registerApi(apis, option);
    });

    this.axios = _axios.default.create(initRequest);
    this.options = Object.assign({
      stringfieldData: false
    }, options);
    this.mApis = {};
    this.defaultsOp = initRequest;

    if (paths) {
      this.moduleRegister(paths, 'common');
    }
  } // 需要传送 data body 的 method


  _createClass(Request, [{
    key: "dataMethod",
    value: function dataMethod(method) {
      var _this2 = this;

      return function (url, data, isStringfield) {
        var op = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        isStringfield = isStringfield === undefined ? _this2.options.stringfieldData : isStringfield;

        if (typeof isStringfield === 'boolean' && isStringfield) {
          data = (0, _stringify.default)(data);
        } else if (Object.prototype.toString.call(isStringfield) === '[object Object]') {
          op = isStringfield;
          if (_this2.options.stringfieldData) data = (0, _stringify.default)(data);
        }

        return _this2.request(_objectSpread({
          url: url,
          method: method,
          data: data
        }, op));
      };
    }
  }, {
    key: "all",
    value: function all(arr) {
      return _axios.default.all(arr);
    }
  }, {
    key: "registerApi",
    // {pathName: value}
    // e.g.: pathName: fetchData...
    // e.q.: 
    //    stringpath
    //    {path, adapin, adapout, option} 
    value: function registerApi(paths) {
      var moduleOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var pathNames = Object.keys(paths);
      var self = this;
      var methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'option'];

      var createMethod = function createMethod(path) {
        return new Proxy(function () {
          for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
          }

          return self.get.apply(self, [paths[path]].concat(rest));
        }, {
          get: function get(t, method) {
            if (methods.includes(method)) {
              var pathVal = paths[path];
              var usePath, adapin, adapout;

              if (typeof pathVal === 'string') {
                usePath = pathVal;
              }

              if (Object.prototype.toString.call(pathVal) === '[object Object]') {
                usePath = pathVal.path;
                adapin = pathVal.adapin;
                adapout = pathVal.adapout;
              }

              return function (data) {
                if (adapin) data = adapin(data);
                var p = null;

                if (['post', 'put', 'patch'].includes(method)) {
                  p = self[method](usePath, data, arguments.length <= 1 ? undefined : arguments[1], _objectSpread({}, moduleOption, pathVal.option || {}, (arguments.length <= 2 ? undefined : arguments[2]) || {}));
                } else {
                  p = self[method](usePath, data, _objectSpread({}, moduleOption, pathVal.option || {}, (arguments.length <= 1 ? undefined : arguments[1]) || {}));
                }

                if (adapout) p.then(adapout);
                return p;
              };
            }

            return t[method];
          }
        });
      };

      return new Proxy({}, {
        get: function get(t, path) {
          if (t[path]) return t[path];

          if (pathNames.includes(path)) {
            t[path] = createMethod(path);
            return t[path];
          }
        }
      });
    }
  }, {
    key: "mix",
    value: function mix(op) {
      return this.createNewAxios(Object.assign({}, this.defaultsOp, op));
    }
  }, {
    key: "createNewAxios",
    value: function createNewAxios(op) {
      var Req = function Req() {};

      Req.prototype = Object.create(this);
      Req.prototype.axios = _axios.default.create(op);
      return;
    }
  }, {
    key: "createSource",
    value: function createSource() {
      var self = this;
      var methods = ['get', 'post'];

      function Source() {
        this.cache = {};
      }

      Source.prototype = Object.create(this);

      Source.prototype.take = function (path) {
        return this.cache[path] !== undefined ? this.cache[path] : null;
      };

      Source.prototype.f = function (path) {
        var _this3 = this;

        var pathArr = path.trim().split('.');
        var len = pathArr.length;
        var method = 'get';
        var module = null;
        var name = null;

        if (len === 1) {
          name = pathArr[0];
        }

        if (len === 3) {
          var _pathArr = _slicedToArray(pathArr, 3);

          module = _pathArr[0];
          name = _pathArr[1];
          method = _pathArr[2];
        }

        if (len === 2) {
          if (methods.indexOf(pathArr[1]) !== -1) {
            method = pathArr[1];
            name = pathArr[0];
          } else {
            module = pathArr[0];
            name = pathArr[1];
          }
        }

        for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          rest[_key2 - 1] = arguments[_key2];
        }

        if (method && name !== null && module === null) {
          var _self$apis$name;

          return (_self$apis$name = self.apis[name])[method].apply(_self$apis$name, rest).then(function (res) {
            _this3.cache[name] = res;
            return res;
          });
        } else if (method && module !== null && name !== null) {
          var _self$mApis$module$na;

          return (_self$mApis$module$na = self.mApis[module][name])[method].apply(_self$mApis$module$na, rest).then(function (res) {
            _this3.cache[module + '.' + name] = res;
            return res;
          });
        } else {
          throw new Error('path is not valid');
        }
      };

      Source.prototype.f.take = Source.prototype.teke;
      return new Source();
    }
  }, {
    key: "n",
    get: function get() {
      function fn(op) {
        return this.createNewAxios(op);
      }

      var bindFn = fn.bind(this);
      Object.assign(bindFn, this, {
        axios: _axios.default.create(op)
      });
      return bindFn;
    }
  }, {
    key: "apis",
    get: function get() {
      var self = this;
      return new Proxy({}, {
        get: function get(t, path) {
          for (var key in self.mApis) {
            var elt = self.mApis[key];
            if (elt[path]) return elt[path];
          }
        }
      });
    }
  }]);

  return Request;
}();

function _default(op, paths) {
  return new Request(op, paths);
}