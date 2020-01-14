import Puta from 'lib';
const desiredPuta = require('./desiredPuta');
import axios from 'axios';
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
    puta.axios.create = jest.fn()
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
    let puta = createPuta({ cf: 'default', p: 4, fourthly: true});

    puta.axios = jest.fn()

    puta.axios.mockResolvedValue({val: 'res'})

    puta.moduleRegister(apiM.ma, 'ma', { cf: 'ma', 'p': 3, third: true })
    puta.moduleRegister(apiM.mb, 'mb', { cf: 'mb', 'p': 3, third: true })

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

  // 模块都注册成功
  it('模块注册成功, 可以访问所有注册的api', ()=>{
    let puta = initPuta()

    eachApi((name, m, d)=>{
      puta.apis[name].get(d)
      puta.mApis[m][name].get(d)
    })
    expect(puta.axios).toHaveBeenCalledTimes(8)
  })

  it.each([
    ['get'],
    ['delete'],
    ['head'],
    ['options'],
    ['post'],
    ['put'],
    ['patch'],
  ])('api使用动词请求: %s', (method)=>{
    let puta = initPuta()
    
    eachApi((name, m, d) => {
      puta.apis[name][method](d)
      puta.mApis[m][name][method](d)
      if(method==='get'){
        puta.apis[name](d)
        puta.mApis[m][name](d)
      }
    })

    let times = (method === 'get' ? 4  : 2 )*4

    expect(puta.axios).toHaveBeenCalledTimes(times)
  })

  it('config 层级覆盖', ()=>{
    let puta = initPuta()

    puta.apis.a.get(null, { first: true, cf:'a', p: 1 })
    puta.apis.a(null, { first: true, cf:'a', p: 1 })
    // puta.apis.c.post({}, { first: true, p: 1 })

    expect(puta.axios.mock.calls[0][0]).toStrictEqual({
      method: 'get',
      url: '/a',
      params: null,
      ...{ first: true, cf: 'a', 'p': 1, third: true, fourthly: true }
    })
    expect(puta.axios.mock.calls[1][0]).toStrictEqual({
      method: 'get',
      url: '/a',
      params: null,
      ...{ first: true, cf: 'a', 'p': 1, third: true, fourthly: true }
    })

  })

})