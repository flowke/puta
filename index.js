const axios = require('axios');
const qs = require('qs');

module.exports = class Request {
  constructor(initRequest, paths) {
    this.axios = axios.create(initRequest)
    this.apis = null
    this.qs = qs;
    this.defaultsOp = initRequest;
    if (paths) {
      this.registerApi(paths)
    }
  }

  post = (url, data, isStringfield = true, op = {}) => {
    if (typeof isStringfield === 'boolean' && isStringfield) {
      data = qs.stringify(data)
    } else if (Object.prototype.toString.call(isStringfield) === '[object Object]') {
      op = isStringfield
    }

    return this.request({
      url,
      method: 'post',
      data,
      ...op
    })
  }

  get = (url, data, op = {}) => {
    return this.request({
      url,
      params: data,
      ...op
    })
  }

  all(arr){
    return axios.all(arr)
  }

  request = (op = {}) => {
    return this.axios(op)
  }

  setDefaults = (cb = f => f) => {
    cb(this.axios.defaults)
  }

  reqUse = (...rest) => {
    this.axios.interceptors.request.use(...rest)
  }

  resUse = (...rest) => {
    this.axios.interceptors.response.use(...rest)
  }

  registerApi(paths) {
    let pathNames = Object.keys(paths)
    let self = this

    let methods = ['get', 'post']

    let createMethod = path => new Proxy(function (...rest) {
      return self.get(paths[path], ...rest)
    }, {
        get(t, method) {
          if (methods.includes(method)) {
            let pathVal = paths[path];
            let usePath, adapter;
            if(typeof pathVal === 'string'){
              usePath = pathVal
            }
            if (Object.prototype.toString.call(pathVal) === '[object Object]'){
              usePath = pathVal.path;
              adapter = pathVal.adapter;
            }
            return function (...rest) {
              let p = self[method](usePath, ...rest);
              if (adapter) p.then(adapter)
              return p;
            }
          }
          return t[method]
        }
      })

    this.apis = new Proxy({}, {
      get(t, path) {
        if (t[path]) return t[path]
        if (pathNames.includes(path)) {
          t[path] = createMethod(path)
          return t[path]
        }
      }
    })

    return this.apis
  }

  get new() {

    function fn(op) {
      return this.createNewAxios(op)
    }

    let bindFn = fn.bind(this);

    Object.assign(bindFn, this, {
      axios: axios.create(op)
    })

    return bindFn
  }

  mix(op) {
    return this.createNewAxios(Object.assign({}, this.defaultsOp, op))
  }

  createNewAxios(op) {
    let req = {};
    req.prototype = this;
    req.axios = axios.create(op);
    return req;
  }
}
