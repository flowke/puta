import Puta from 'lib';
const desiredPuta = require('./desiredPuta');
import axios from 'axios';
import stringify from 'lib/stringify';

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

// it('reqUse', ()=>{
  
// })

it('resUse', ()=>{
  let puta = Puta();
  let fna = f=>f
  let fnb = f=>f
  puta.resUse(fna, fnb)
})