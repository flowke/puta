import axios from 'axios';
import stringify from './stringify';

class Request {
  constructor(initRequest, paths) {
    this.axios = axios.create(initRequest)
    this.mApis = {}
    this.defaultsOp = initRequest;
    if (paths) {
      this.moduleRegister(paths, 'common');
    }
  }

  dataMethod(method){
    return (url, data, isStringfield = true, op = {}) => {
      if (typeof isStringfield === 'boolean' && isStringfield) {
        data = stringify(data)
      } else if (Object.prototype.toString.call(isStringfield) === '[object Object]') {
        op = isStringfield;
        data = stringify(data);
      }

      return this.request({
        url,
        method: method,
        data,
        ...op
      })
    }
  }

  post = (...rest) => {
    return this.dataMethod('post')(...rest)
  }
  put = (...rest) => {
    return this.dataMethod('put')(...rest)
  }
  patch = (...rest) => {
    return this.dataMethod('patch')(...rest)
  }

  delete = (url, data, op={}) => {
    return this.request({
      url,
      params: data,
      method: 'delete',
      ...op
    })
  }
  head = (url, data, op={}) => {
    return this.request({
      url,
      params: data,
      method: 'head',
      ...op
    })
  }
  options = (url, data, op={}) => {
    return this.request({
      url,
      params: data,
      method: 'options',
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
    this.mApis[name] = this.registerApi(apis);
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

    let self = this;
    return new Proxy({}, {
      get(t, path){
        for (const key in self.mApis) {
          const elt = self.mApis[key];
          if(elt[path]) return elt[path]
        }
      }
    })
  }

  mix(op) {
    return this.createNewAxios(Object.assign({}, this.defaultsOp, op))
  }

  createNewAxios(op) {
    let Req = function(){};
    Req.prototype = Object.create(this);
    Req.prototype.axios = axios.create(op);
    return new Req;
  }

  createSource(){

    let self = this;
    let methods = ['get', 'post']

    function Source(){
      this.cache = {}
    }

    Source.prototype = Object.create(this);
    Source.prototype.take = function(path){
      return this.cache[path] !== undefined ? this.cache[path] : null
    }

    Source.prototype.f = function(path, ...rest){
      let pathArr = path.trim().split('.');
      let len = pathArr.length;

      let method = 'get';
      let module = null;
      let name = null;


      if(len===1){
        name = pathArr[0];
      }

      if(len===3){
        [module,name, method] = pathArr;
      }

      if(len===2){

        if (methods.indexOf(pathArr[1])!==-1){
          method = pathArr[1];
          name = pathArr[0];
        }else{
          module = pathArr[0];
          name = pathArr[1];
        }
      }

      if (method && (name !== null) && (module === null)){
        return self.apis[name][method](...rest)
        .then(res=>{
          this.cache[name] = res
          return res
        })
      }else if (method && (module !== null) && (name!==null)){
        return self.mApis[module][name][method](...rest)
          .then(res => {
            this.cache[module + '.' + name] = res
            return res
          })

      }else{
        throw new Error('path is not valid')
      }
      


    }

    Source.prototype.f.take = Source.prototype.teke


    return new Source();

  }

}

export default function (op, paths){
  return new Request(op, paths)
}