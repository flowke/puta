"use strict";require("core-js/modules/es.symbol");require("core-js/modules/es.array.concat");require("core-js/modules/es.array.filter");require("core-js/modules/es.array.for-each");require("core-js/modules/es.array.includes");require("core-js/modules/es.date.to-string");require("core-js/modules/es.function.bind");require("core-js/modules/es.object.assign");require("core-js/modules/es.object.define-property");require("core-js/modules/es.object.get-own-property-descriptor");require("core-js/modules/es.object.keys");require("core-js/modules/es.object.to-string");require("core-js/modules/es.regexp.to-string");require("core-js/modules/es.string.includes");require("core-js/modules/web.dom-collections.for-each");var _temp;function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};var ownKeys=Object.keys(source);if(typeof Object.getOwnPropertySymbols==="function"){ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable}))}ownKeys.forEach(function(key){_defineProperty(target,key,source[key])})}return target}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){if(protoProps)_defineProperties(Constructor.prototype,protoProps);if(staticProps)_defineProperties(Constructor,staticProps);return Constructor}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}var axios=require("axios");var stringify=require("./lib/stringify");module.exports=(_temp=/*#__PURE__*/function(){function Request(initRequest,paths){var _this=this;_classCallCheck(this,Request);_defineProperty(this,"post",function(url,data){var isStringfield=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;var op=arguments.length>3&&arguments[3]!==undefined?arguments[3]:{};if(typeof isStringfield==="boolean"&&isStringfield){data=stringify(data)}else if(Object.prototype.toString.call(isStringfield)==="[object Object]"){op=isStringfield;data=stringify(data)}return _this.request(_objectSpread({url:url,method:"post",data:data},op))});_defineProperty(this,"get",function(url,data){var op=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};return _this.request(_objectSpread({url:url,params:data},op))});_defineProperty(this,"request",function(){var op=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};return _this.axios(op)});_defineProperty(this,"setDefaults",function(){var cb=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(f){return f};cb(_this.axios.defaults)});_defineProperty(this,"reqUse",function(){var _this$axios$intercept;(_this$axios$intercept=_this.axios.interceptors.request).use.apply(_this$axios$intercept,arguments)});_defineProperty(this,"resUse",function(){var _this$axios$intercept2;(_this$axios$intercept2=_this.axios.interceptors.response).use.apply(_this$axios$intercept2,arguments)});_defineProperty(this,"moduleRegister",function(apis,name){_this.mApis[name]=_this.registerApi(apis)});this.axios=axios.create(initRequest);this.mApis={};this.defaultsOp=initRequest;if(paths){this.moduleRegister(paths,"common")}}_createClass(Request,[{key:"all",value:function all(arr){return axios.all(arr)}},{key:"registerApi",value:function registerApi(paths){var pathNames=Object.keys(paths);var self=this;var methods=["get","post"];var createMethod=function createMethod(path){return new Proxy(function(){for(var _len=arguments.length,rest=new Array(_len),_key=0;_key<_len;_key++){rest[_key]=arguments[_key]}return self.get.apply(self,[paths[path]].concat(rest))},{get:function get(t,method){if(methods.includes(method)){var pathVal=paths[path];var usePath,adapin,adapout;if(typeof pathVal==="string"){usePath=pathVal}if(Object.prototype.toString.call(pathVal)==="[object Object]"){usePath=pathVal.path;adapin=pathVal.adapin;adapout=pathVal.adapout}return function(data){if(adapin)data=adapin(data);for(var _len2=arguments.length,rest=new Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){rest[_key2-1]=arguments[_key2]}var p=self[method].apply(self,[usePath,data].concat(rest));if(adapout)p.then(adapout);return p}}return t[method]}})};return new Proxy({},{get:function get(t,path){if(t[path])return t[path];if(pathNames.includes(path)){t[path]=createMethod(path);return t[path]}}})}},{key:"mix",value:function mix(op){return this.createNewAxios(Object.assign({},this.defaultsOp,op))}},{key:"createNewAxios",value:function createNewAxios(op){var req={};req.prototype=this;req.axios=axios.create(op);return req}},{key:"n",get:function get(){function fn(op){return this.createNewAxios(op)}var bindFn=fn.bind(this);Object.assign(bindFn,this,{axios:axios.create(op)});return bindFn}},{key:"apis",get:function get(){return new Proxy({},{get:function get(t,path){for(var key in this.mApis){var elt=this.mApis[key];if(elt[path])return elt[path]}}})}}]);return Request}(),_temp);