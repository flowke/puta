# puta
基于 [axios](https://github.com/axios/axios) , 但添加了许多有用的功能.

<!-- [中文](./zh-cn-readme.md) -->

## 安装

```
$ npm install puta
```

## 使用

得到实例

```js
import Puta form 'puta';

// 或
let puta = Puta({
  baseURL: xxx,
  timeout: 12000
});

let puta = new Puta({
  baseURL: xxx,
  timeout: 12000
});



```

进行请求:

```js
puta.get('/user', {ID: '12345'})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  
puta.post('/user', {ID: '12345'})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

```

注册模块化的请求路径:

```js
import Puta form 'puta';

let puta = Puta();

// 注册一个 menu 的路径模块
puta.moduleRegister({
  a: '/app',
  b: '/init.js',
}, 'menu')

// 注册一个  home 的路径模
// 路径除了是字符串, 还可以是对象 
puta.moduleRegister({
  c: '/app',
  d: {
    path: '/init.js',
    reqData: (data)=>{

      // 在 data 传递给请求之前, 可以处理下 data
      // 必须返回数据

      return data
    },
    use: (response)=>{
      
      // 在响应后, 可以处理下响应数据
      // 必须返回 数据

      return response
    },
    config: {} // puta config
  },
}, 'home')


// 然后你可以像下面这样请求

// mApis 保存着模块的命名空间
// 例如上面我们注册的 home 和 menu
puta.mApis.home.a(...rest) // get 请求
// 等价于 puta.get('/app', ...rest)

puta.mApis.home.a.post(...rest) //post
// 等价于 puta.post('/app', ...rest)

// apis 可以直接访问路径名, 无需加上模块名, 但需要警惕命名污染
puta.apis.a.post() //post
puta.apis.d.get() //此处 get可以省略

```


## API

### `new Puta([config])`  or  `puta([config])`

#### **config**  

Type: `object`

此 config 我们把它叫做 puta 的 config.

除了下面选项之外, 还可以参见: [axios request-config](https://github.com/axios/axios#request-config)


```js
{
  stringfieldData: false, //  默认 false , 是否开启对 post 请求参数进行字符串化

  use: ()=>{}, // 一个函数, 对响应进行一次 use, 类似 axios.interceptors.response.use

  cancelUse: boolean, //是否取消 use, 在某些场景会用到
  
  cancel: object|function, // 取消请求用
  
}
```

##### stringfieldData

### 实例属性

**.mApis**

type: `Proxy`
调用 `.moduleRegister()` 后, 所注册的 api 路径的命名空间

**.apis**

type: `Proxy`
调用 `.moduleRegister()` 后, 可以不通过命名空间直接访问路径名

> 注意: 如果有两个以上的路径命名空间(模块)拥有同一个路径名, 但要警惕命名污染,  可能会产生非预期的结果.

### 实例方法

**动词请求**

`.get(url [, params [, config]])`   
`.delete(url [, params [, config]])`  
`.head(url [, params [, config]])`  
`.options(url [, params [, config]])`  
`.post(url [,data, [,stringified] [,config]])`  
`.put(url [,data, [,config]])`  
`.patch(url [,data, [,config]])`

> 如果通过已经注册了 api 模块, 则使用动词方法时可以省略第一个参数: url

* *config*: puta 的 config  
* 
* *params*: 传递的请求参数
* 
* *data*: 传递的请求参数
* 
* *stringified*: boolean, 类似 `querystring.stringify()` 一样序化请求体 .
你也可以传递一个对象, 这个时候就会被当做 config 来对待. 而 stringified 的值由 `puta.options.stringfieldData` 来决定

**.all(Array\<Promise\>)**

同 axios.all()

**.setDefaults(callback)**

callback 函数接收一个参数:  axios实例的 defaults 属性, 可以在此修改一下默认 config, 这会覆盖 实例化 puta 时传入的 config


**.reqUse(...args)**

 同 of axios.interceptors.request.use


**.resUse(...args)**

同 of axios.interceptors.response.use



**.moduleRegister(apis, name, config)**(重要) :sweet_potato::sweet_potato::sweet_potato:

apis: `路径模块`, type: object  
name: `模块的命名空间`, type: string
config: 这个模块的所有请求都会结合这个 config, puta的 config

*apis:*  
type: `object`

```js
{
  // path 的值可以是字符串或对象
  path1: '',  // 值是一个字符串
  path2: { // 值是一个对象
    path: '', //required
    reqData: data=>data, // optional
    use: response=>response, //optional
    config: {}, //optional
  }
}
```

reqData 函数可以在 data 传递给请求之前进行一些处理, 必须返回一个处理后的 data

use 函数可以在响应数据返回之后立即进行一些处理, 必须返回一个处理后响应数据.  

config: puta 的 config , 只对  此请求路径有效

查看以下实例:

```js

```

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

## 如何取消请求

## 关于 post和 stringfieldData 配置项的关系

## config 的层次覆盖

## res use 的层级覆盖

## req 的层级覆盖

## 关于缓存