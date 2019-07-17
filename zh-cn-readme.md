# puta
基于 [axios](https://github.com/axios/axios) 封装的请求库.

[中文](./zh-cn-readme.md)

## 安装

```
$ npm install puta
```

## 使用

得到实例

```js
import Request form 'puta';

let req = new Request({
  baseURL: xxx,
  timeout: 12000
});

// 或
let req = Request({
  baseURL: xxx,
  timeout: 12000
});


```

进行请求:

```js
req.get('/user', {ID: '12345'})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  
req.post('/user', {ID: '12345'})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });


```

注册模块化的请求路径:

```js
import puta form 'puta';

let req = puta();

// 注册一个 menu 的路径模块
req.moduleRegister({
  a: '/app',
  b: '/init.js',
}, 'menu')

// 注册一个  home 的路径模
// 路径除了是字符串, 还可以是对象 
req.moduleRegister({
  c: '/app',
  d: {
    path: '/init.js',
    adapin: (data)=>{

      // 在 data 传递给请求之前, 可以处理下 data
      // 必须返回数据

      return data
    },
    adapout: (response)=>{
      
      // 在响应后, 可以处理下响应数据
      // 必须返回 数据

      return response
    },
  },
}, 'home')


// 然后你可以像下面这样请求

// mApis 保存着模块的命名空间
// 例如上面我们注册的 home 和 menu
req.mApis.home.a(...rest) // get 请求
req.mApis.home.a.post(...rest) //post

// 等价于 req.post('/app', ...rest)

// apis 可以直接访问路径名, 无需加上模块名, 但需要警惕命名污染
req.apis.a.post() //post
req.apis.d.get() //此处 get可以省略

```


## API

### `new Puta([options], [paths])`  or  `puta([options], [paths])`

**options**  
options 就是 axios 的 config, 之后的请求都共享这份基础配置, 除非在请求时另外指定.

**paths**  type: object

paths 是和 moduleRegister 的参数一样, 在初始化时直接注册一个叫做 'common' 的路径模块


### Instance property

**.mApis**

type: `Proxy`

api 路径的命名空间

**.apis**

type: `Proxy`

可以不通过命名空间直接访问路径名, 但要警惕命名污染, 如果有两个以上的路径模块拥有同一个路径名, 可能会产生非预期的结果.

### Instance methods

**Request method**

`.get(url [, params [, config]])`   
`.delete(url [, params [, config]])`  
`.head(url [, params [, config]])`  
`.options(url [, params [, config]])`  
`.post(url [,data, [,stringified] [,config]])`  
`.put(url [,data, [,stringified] [,config]])`  
`.patch(url [,data, [,stringified] [,config]])`

*config*: axios 的 config  

*stringified*: boolean, 类似 `querystring.stringify()` 一样序化请求体 .


**.all(Array\<Promise\>)**

同 axios.all()

**.setDefaults(callback)**

callback 函数接收一个参数:  axios实例的 defaults 属性, 可以在此修改一下默认 config, 这会覆盖 实例化 puta 时传入的 config


**.reqUse(...args)**

 同 of axios.interceptors.request.use


**.resUse(...args)**

同 of axios.interceptors.response.use



**.moduleRegister(apis, name)** :sweet_potato::sweet_potato::sweet_potato:

apis: `路径模块`, type: object  
name: `模块的命名空间`, type: string

*apis:*  
type: `object`

```js
{
  // path 的值可以是字符串或对象
  path1: '',  
  path2: {
    path: '', //required
    adapin: data=>data, // optional
    adapout: response=>response, //optional
  }
}
```

adapin 函数可以在 data 传递给请求之前进行一些处理, 必须返回一个处理后的 data

adapout 函数可以在响应数据返回之后立即进行一些处理, 必须返回一个处理后响应数据.

**.createSource()** :sweet_potato::sweet_potato::sweet_potato:

返回一个新的 `source` 对象实例.

`source` 拥有 puta 实例的所有属性和方法. 

同时还拥有两个额外的方法: 

**-- _source.f(path, ...rest)_** 

path 参数是一个字符串, 遵循以下规则:  

- module.name.method
- module.name
- name.method
- name

example:

```js
source.f('menu.xxx.get', ...rest):
// equals
puta.mApis.menu.xxx.get(...rest)

---

source.f('menu.xxx', ...rest):
// equals
puta.mApis.menu.xxx.get(...rest)

---

source.f('xxx.post', ...rest):
// equals
puta.apis.xxx.post(...rest)

---

source.f('xxx', ...rest):
// equals
puta.apis.xxx.get(...rest)

```
 
使用 `f` 方法进行的请求 和 使用 `puta` 实例进行请求的不同在于:  

`f`会在请求后缓存结果, 而 'puta' 实例的请求不会
<br>

**-- _source.take(path)_**

取出 `f` 请求缓存的结果:

example:

```js
source.f('menu.xxx.post')

// 假设上面的请求已经返回之后, 我们进行取出操作

source.take('menu.xxx')

```

> 注意: 使用 take(path) 取出缓存结果时, path 不区分请求时的 method, path 字符中也无需拼接 method, 就像上面的例子一样.