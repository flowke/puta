const axios = require('axios');
const qs = require('qs');

module.exports = class Request {
  constructor(initRequest, paths) {
    this.axios = axios.create(initRequest)
    this.mAPis = {}
    this.qs = qs;
    this.defaultsOp = initRequest;
    if (paths) {
      this.moduleRegister(paths, 'common');
    }
  }

  post = (url, data, isStringfield = true, op = {}) => {
    if (typeof isStringfield === 'boolean' && isStringfield) {
      data = qs.stringify(data)
    } else if (Object.prototype.toString.call(isStringfield) === '[object Object]') {
      op = isStringfield;
      data = qs.stringify(data);
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

  moduleRegister=(apis, name)=>{
    this.mAPis[name] = this.registerApi(apis);
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
            let usePath, adapin, adapout;
            if(typeof pathVal === 'string'){
              usePath = pathVal
            }
            if (Object.prototype.toString.call(pathVal) === '[object Object]'){
              usePath = pathVal.path;
              adapin = pathVal.adapin;
              adapout = pathVal.adapout;
            }
            return function (data,...rest) {
              if (adapin) data = adapin(data);
              let p = self[method](usePath, data, ...rest);
              if (adapout) p.then(adapout);
              return p;
            }
          }
          return t[method]
        }
      })

    return new Proxy({}, {
      get(t, path) {
        if (t[path]) return t[path]
        if (pathNames.includes(path)) {
          t[path] = createMethod(path)
          return t[path]
        }
      }
    })

  }

  get n() {

    function fn(op) {
      return this.createNewAxios(op)
    }

    let bindFn = fn.bind(this);

    Object.assign(bindFn, this, {
      axios: axios.create(op)
    })

    return bindFn
  }

  get apis(){
    return new Proxy({}, {
      get(t, path){
        for (const key in this.mAPis) {
          const elt = object[key];
          if(elt[path]) return elt[path]
        }
      }
    })
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
