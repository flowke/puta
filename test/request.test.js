import Puta from 'lib';
const desiredPuta = require('./desiredPuta');
import stringify from 'lib/stringify';

const apiM = require('./serviceModule');

let initConfig = {
  url: '/a/b',
  data: {a:1,b:2},
  op: {a:1}
}

function createPuta(d){
  let puta = Puta(d);

  puta.axios = jest.fn()

  return puta

}

// 两种实例化方式
describe('实例化方式',()=>{
  it('通过new 实例化',()=>{
    let puta = new Puta()
    expect(puta).toMatchObject(desiredPuta)
  })
  it('通过函数调用 实例化',()=>{
    let puta = Puta()
    expect(puta).toMatchObject(desiredPuta)
  })
  it('接收默认参数',()=>{
    let puta = Puta({ stringfieldData: false, a:1})
    expect(puta.axios.create).toHaveBeenCalledWith({ a: 1})
  })

})

// 实现请求
describe('动词请求', () => {

  it.each([
    ['get', '/a/b', { a: 1, b: 2 }, { a: 1 }],
    ['delete', '/a/b', { a: 1, b: 2 }, { a: 1 }],
    ['head', '/a/b', { a: 1, b: 2 }, { a: 1 }],
    ['options', '/a/b', { a: 1, b: 2 }, { a: 1 }],
  ])('method: %s', (m,url, data, op)=>{
    let puta = createPuta();

    puta[m](url, data,op);

    expect(puta.axios).toHaveBeenCalledTimes(1);
    expect(puta.axios).toHaveBeenCalledWith({
      url,
      method: m,
      params: data,
      ...op
    });
  })

  it.each([
    ['patch', '/a/b', { a: 1, b: 2 }, { a: 1 }],
    ['put', '/a/b', { a: 1, b: 2 }, { a: 1 }],
  ])('method: %s', (m,url, data, op)=>{
    let puta = createPuta();

    puta[m](url, data,op);

    expect(puta.axios).toHaveBeenCalledTimes(1);
    expect(puta.axios).toHaveBeenCalledWith({
      url,
      method: m,
      data: data,
      ...op
    });
  })
  
  it.each([
    ['true stringfield',undefined, true], ,
    ['false stringfield', undefined, false],
    ['true stringfield by set default', { stringfieldData:true}, undefined],
    ['false stringfield by set default', { stringfieldData: false }, undefined],
    ['false stringfield by default', undefined, undefined],
    ['false stringfield by cfg first', { stringfieldData: true }, false],
    ['false stringfield by cfg first', { stringfieldData: false }, true],
    ])('method: post, %s', (msg, cfg, val)=>{
      let puta = createPuta(cfg);
      let arr = [initConfig.url, initConfig.data,
        val, initConfig.op
      ].filter(v=>v!==undefined)

      puta.post(...arr);

      let stringfield = val!==undefined? val : (cfg ? cfg.stringfieldData : false)

      expect(puta.axios).toHaveBeenCalledTimes(1);
      expect(puta.axios).toHaveBeenCalledWith({
        url: initConfig.url,
        method: 'post',
        data: stringfield ? stringify(initConfig.data) : initConfig.data,
        ...initConfig.op
      });
  })

})

it('setDefaults', ()=>{
  let puta = Puta();
  puta.setDefaults((df)=>{
    df.baseURL = 'https://api.example.com';
    df.headers.common['Authorization'] = 'AUTH_TOKEN';
    df.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  })

  expect(puta.axios.defaults.baseURL).toBe('https://api.example.com')
  expect(puta.axios.defaults.headers.common['Authorization']).toBe('AUTH_TOKEN')
  expect(puta.axios.defaults.headers.post['Content-Type']).toBe('application/x-www-form-urlencoded')

})

// interceptors
describe('interceptors', ()=>{
  it.each([
    ['reqUse', 'request'],
    ['resUse', 'response'],
  ])('%s', (name, m)=>{
    let puta = Puta();
    puta.axios.interceptors[m].use = jest.fn()
    let fna = f => f
    let fnb = f => f
    puta[name](fna, fnb)
    puta[name](fna, fnb)

    expect(puta.axios.interceptors[m].use).toHaveBeenCalledTimes(2);
    expect(puta.axios.interceptors[m].use).toHaveBeenNthCalledWith(1, fna, fnb);
    expect(puta.axios.interceptors[m].use).toHaveBeenNthCalledWith(2, fna, fnb);
  })
})

// 模块注册
describe('模块注册', ()=>{
  let initPuta = ()=>{
    let puta = createPuta({ 
      cf: 'default', 
      default: true,
      use: (d) => Object.assign({ outDefault: true},d)
    });

    puta.axios = jest.fn()
    puta.axios.mockResolvedValue({ val: 'res', call: jest.fn() })

    puta.moduleRegister(apiM.ma, 'ma', { 
      cf: 'module', module: true,
      use: (d) => {
        d.call('module')
        return Object.assign({ outModule: true }, d)
      }

    })
    puta.moduleRegister(apiM.mb, 'mb', { 
      cf: 'module', module: true ,
      use: (d) => {
        d.call('module')
        return Object.assign({ outModule: true }, d)
      }
    })

    return puta
  }

  function eachApi(fn){
    ;[
      ['a', 'ma', { d: 'd' }],
      ['b', 'ma', { d: 'd' }],
      ['c', 'mb', { d: 'd' }],
      ['d', 'mb', { d: 'd' }],
    ].forEach(([name, m, d]) => {
      fn(name, m, d)
    })
  }

  // 使用所有 动词方法, 对所有注册的 api 进行依次调用
  describe.each([
    ['get', 'params'],
    ['delete', 'params'], 
    ['head', 'params'],
    ['options', 'params'],
    ['post', 'data'],
    ['put', 'data'],
    ['patch', 'data'],
  ])('动词请求: %s', (method, dataKey)=>{

    it('所有api可以用:', ()=>{
      let puta = initPuta()

      eachApi((name, m, d) => {
        puta.apis[name][method](d)
        puta.mApis[m][name][method](d)
        if (method === 'get') {
          puta.apis[name](d)
          puta.mApis[m][name](d)
        }
      })
      let times = (method === 'get' ? 4 : 2) * 4
      expect(puta.axios).toHaveBeenCalledTimes(times)
    })

    // request 级别最优先
    it('config 层级覆盖: request prior', () => {
      let puta = initPuta()

      puta.apis.a[method](null, { cf: 'request', request: true, id: 2 })
      puta.apis.c[method](null, { cf: 'request', request: true, id: 2 })

      let expectData = {
        method: method,
        [dataKey]: null,
        ...{ cf: 'request', request: true, id: 2, module: true }
      }
      
      expect(puta.axios.mock.calls[0][0]).toStrictEqual({
        url: apiM.ma.a,
        ...expectData,
      })
      expect(puta.axios.mock.calls[1][0]).toStrictEqual({
        url: apiM.mb.c.path,
        ...expectData,
        [dataKey]: { p: 2, 'second': true },
        path: true,
      })

      if (method === 'get') {
        puta.apis.a(null, { cf: 'request', request: true, id: 1 })
        puta.apis.c(null, { cf: 'request', request: true, id: 1 })
        expect(puta.axios.mock.calls[2][0]).toStrictEqual({
          url: apiM.ma.a,
          ...expectData,
          id: 1
        })
        expect(puta.axios.mock.calls[3][0]).toStrictEqual({
          url: apiM.mb.c.path,
          ...expectData,
          [dataKey]: { p: 2, 'second': true },
          path: true,
          id: 1
        })
      }
      

    })
    it('config 层级覆盖: path prior', () => {
      let puta = initPuta()

      puta.apis.a[method](null)
      puta.apis.c[method](null)

      let expectData = {
        method: method,
        [dataKey]: null,
        ...{ cf: 'module', module: true }
      }
      
      expect(puta.axios.mock.calls[0][0]).toStrictEqual({
        url: apiM.ma.a,
        ...expectData,
      })
      expect(puta.axios.mock.calls[1][0]).toStrictEqual({
        url: apiM.mb.c.path,
        ...expectData,
        [dataKey]: { p: 2, 'second': true },
        path: true,
        cf: 'path'
      })

      if (method === 'get') {
        puta.apis.a(null)
        puta.apis.c(null)
        expect(puta.axios.mock.calls[2][0]).toStrictEqual({
          url: apiM.ma.a,
          ...expectData,
        })
        expect(puta.axios.mock.calls[3][0]).toStrictEqual({
          url: apiM.mb.c.path,
          ...expectData,
          [dataKey]: { p: 2, 'second': true },
          path: true,
          cf: 'path'
        })
      }
      

    })


    it('请求参数与转换处理', ()=>{
      let puta = initPuta();
      let reqData = { 'tiny': 'h' }
      puta.apis.a[method](reqData)
      puta.apis.c[method](reqData)

      expect(puta.axios.mock.calls[0][0][dataKey]).toStrictEqual({
        ...reqData
      })
      expect(puta.axios.mock.calls[1][0][dataKey]).toStrictEqual({
        ...reqData,
        p: 2, 'second': true
      })

    })

    it('use for response',()=>{
      let puta = initPuta();
      puta.axios.mockResolvedValue({ val: 'res', call: jest.fn() })

      let req1 = puta.apis.a[method]()
      .then(res=>{
        expect(res).toStrictEqual({
          val: 'res',
          outModule: true,
          call: res.call
        })
        expect(res.call).nthCalledWith(1, 'module')
      })
      puta.axios.mockResolvedValue({ val: 'res', call: jest.fn() })
      let req2 = puta.apis.c[method]()
      .then(res=>{

        expect(res).toStrictEqual({
          val: 'res',
          outModule: true,
          outC: true,
          call: res.call
        })
        expect(res.call).nthCalledWith(1, 'module')
        expect(res.call).nthCalledWith(2, 'pathcfg')

      })
      return Promise.all([req1, req2])

    })

    it.todo('cancel use')
    it.todo('cancel request')
    
  })

  it.todo('cancel use for not module')
  it.todo('cancel request for not module')
  it.todo('for cancel error object')
  it.todo('修改 config 覆盖层级的测试代码')

})