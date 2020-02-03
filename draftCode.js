  function createSource() {

    let self = this;
    let methods = ['get', 'post']

    function Source() {
      this.cache = {}
    }

    Source.prototype = Object.create(this);
    Source.prototype.take = function (path) {
      return this.cache[path] !== undefined ? this.cache[path] : null
    }

    Source.prototype.f = function (path, ...rest) {
      let pathArr = path.trim().split('.');
      let len = pathArr.length;

      let method = 'get';
      let module = null;
      let name = null;


      if (len === 1) {
        name = pathArr[0];
      }

      if (len === 3) {
        [module, name, method] = pathArr;
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

      if (method && (name !== null) && (module === null)) {
        return self.apis[name][method](...rest)
          .then(res => {
            this.cache[name] = res
            return res
          })
      } else if (method && (module !== null) && (name !== null)) {
        return self.mApis[module][name][method](...rest)
          .then(res => {
            this.cache[module + '.' + name] = res
            return res
          })

      } else {
        throw new Error('path is not valid')
      }



    }

    Source.prototype.f.take = Source.prototype.teke


    return new Source();

  }

    get n() {

      function fn(op) {
        return this.createNewAxios(op)
      }

      let bindFn = fn.bind(this);

      Object.assign(bindFn, this, {
        axios: axios.create(this.dfAxiosConfig)
      })

      return bindFn
    }