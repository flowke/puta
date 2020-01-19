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

注册模块化的请求路径, 

非必须, 详情查看下面文档  api `.moduleRegister()` 和 [为什么使用模块注册](#chickenchicken-%e4%b8%ba%e4%bb%80%e4%b9%88%e4%bd%bf%e7%94%a8%e6%a8%a1%e5%9d%97%e6%b3%a8%e5%86%8c) 的章节:

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

在不同阶段都可以传入 config 配置用于规划请求相关的行为, 详情查看: [config 的层级覆盖](#chickenchickenconfig-%e7%9a%84%e5%b1%82%e7%ba%a7%e8%a6%86%e7%9b%96)

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

Type: `boolean`

是否对 post 请求的 request data 进行字符串序列化成 `application/x-www-form-urlencoded` 数据格式.

细节参见: [:chicken::chicken:关于 post和 stringfieldData 配置项的关系](#chickenchicken%e5%85%b3%e4%ba%8e-post%e5%92%8c-stringfielddata-%e9%85%8d%e7%bd%ae%e9%a1%b9%e7%9a%84%e5%85%b3%e7%b3%bb)

##### use

Type: `function`

类似传给`axios.interceptors.response.use(fn)`的第一个参数 fn, 此处的 use 函数会后于 `axios.interceptors.response.use` 执行.

##### cancelUse

取消 config 中 use 函数的执行. 

更多信息查看: [为什么要在 config 中同时出现 use和 cancelUse](#chickenchicken-%e4%b8%ba%e4%bb%80%e4%b9%88%e8%a6%81%e5%9c%a8-config-%e4%b8%ad%e5%90%8c%e6%97%b6%e5%87%ba%e7%8e%b0-use%e5%92%8c-canceluse)


##### cancel

取消请求. 

更多请查看: [如何取消请求](#chickenchicken%e5%a6%82%e4%bd%95%e5%8f%96%e6%b6%88%e8%af%b7%e6%b1%82)


### 实例属性

**.mApis**

type: `Proxy`
调用 `.moduleRegister()` 后, 通过所注册的 api 路径的命名空间访问路径名;

如: 

```js
// 假如注册了两个模块, x 和 y
puta.moduleRegister({
  p1: '/ffds',
  p2: '/xxx',
},x)
puta.moduleRegister({
  p3: '/for_p3',
  p4: '/for_p4',
},y)

// 则可以通过如下方式访问相关路径来进行请求:
// 访问 p1,p2
puta.mApis.x.p1.post()
puta.mApis.x.p2.post()
// 访问 p3,p4
puta.mApis.y.p3.post()
puta.mApis.y.p3.post()



```

**.apis**

type: `Proxy`
调用 `.moduleRegister()` 后, 可以不通过命名空间直接访问路径名
如:

```js
// 假如注册了两个模块, x 和 y
puta.moduleRegister({
  p1: '/ffds',
  p2: '/xxx',
  p5: '/for_x'
},x)
puta.moduleRegister({
  p3: '/for_p3',
  p4: '/for_p4',
  p5: '/for_y'
},y)

// 则可以通过如下方式访问相关路径来进行请求:
// 访问 p1,p2
puta.apis.p1.post()
puta.apis.p2.post()
// 访问 p3,p4
puta.apis.p3.post()
puta.apis.p3.post()

// 但要注意, p5在两个模块都有, 此时需要通过模块来访问路径
puta.mApis.x.p5.post()
puta.mApis.y.p5.post()


```
> 注意: 如果有两个以上的路径命名空间(模块)拥有同一个路径名, 但要警惕命名污染,  可能会产生非预期的结果.

### 实例方法

**动词请求相关方法**

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

更多细节查看: [为什么使用模块注册](#chickenchicken-%e4%b8%ba%e4%bb%80%e4%b9%88%e4%bd%bf%e7%94%a8%e6%a8%a1%e5%9d%97%e6%b3%a8%e5%86%8c).

参数说明: 

* apis: `路径模块`, type: object  
* name: `模块的命名空间`, type: string
* config: 这个模块的所有请求都会结合这个 config, puta的 config

关于 *apis:* 参数 :
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

* reqData 函数可以在 `data` 或 `params` 传递给请求之前进行一些处理, 必须返回一个处理后的 data

* use 函数可以在响应数据返回之后立即进行一些处理, 必须返回一个处理后响应数据.  

* config: puta 的 config , 只对  此请求路径有效

**注册后模块后, 可以使用如下方式进行请求:**

`puta.apis.[method](...res)` 或 `puta.mApis.[moduleName].[method]()`

* method 就是 `get, post, head...` 等动词请求方法.
* moduleName 就是 moduleRegister 的第二个参数
* ...rest : 就是参数列表, 其参数列表就是动词方法除去第一个参数:url 后剩余的参数别表, 比如 
  * get: `puta.apis.[method].get(params, config)`
  * post: `puta.apis.[method].post(data,[stringfield], config)`

查看以下实例(为简化, 部分使用了伪代码), 注意阅读注释部分:

```js
// 实例
let puta = Puta({
  baseURL: 'http://aaa.com'
});

let apis = puta.apis;

// 注册一个模块
// 处于演示需要, path的值我们故意使用两种形式, 字符串或对象
puta.moduleRegister({
  useInfo: '/user',
  goodsList: {
    path: '/goods',
    // reqData 是可选字
    reqData:data=>{
      data.addP = 'add'
      return data
    },
    // use 是可选字段
    use: res=>{
      res.x = 5;
      return x;
    }
    // config 是可选字段
    config: {
      baseURL: 'http://bbb.com'
    }
  },
}, home)



// 如果我们此时请求的路径是 goods:
// 请求的最终 url 本来是: 'http://aaa.com/goods', 但因为 config的配置,
// 变成了: 'http://bbb.com/goods'
apis.goodsList.get({
  mob: 'yesternight'
},{baseURL: 'http://mob.com', timeout: 1600})
  .then(res=>{
    // res 会先流过 use, 变成
    // {
    //   x:5,
    //   ...otherData
    // }
    console.log(res, '看看 res是什么')

  })

// {mob: 'yesternight'} 会流过 reqData, 变成
// {mob: 'yesternight', addP: 'add'}

// 事实上, 以上行为和以下行为是等价的: 

// request data 的处理环节
let data = (data=>{
  data.addP = 'add'
  return data
})({
  mob: 'yesternight'
})

// config 的覆盖情况
let config = Object.assign(
  {},
  {baseURL: 'http://aaa.com'},
  {baseURL: 'http://bbb.com'},
  {baseURL: 'http://mob.com', timeout: 1600}
)

puta.get('/goods', data, config)
.then(res=>{ // res 先被 use 处理
  res.x = 5;
  return x;
})
.then(res=>{
  console.log(res, '看看 res是什么')
})

```

## :chicken::chicken:config 的层级覆盖
如果直接使用动词请求, config 会出现在 2 个层级:
1. 新建实例时: Puta( [config] )
2. 请求时, puta.get(params, [config] )

如果注册api 模块, 并通过模块路径访问请求:  那么 config 会出现在3 或 4 个层级:

1. 新建实例时: Puta( [config] )
2. 注册模块时: .moduleRegister(apis, name, [config] )
3. api路径配置为对象时: `apis  = {a: {config: [config] }}`
4. 请求时: apis.a.get(params, [config] )

如果把 1,2,3,4 比喻为配置出现在的层级, 有两个或以上的地方出现 config 的时候, 相同的属性会出现覆盖,

**高层级覆盖低层级的属性, 比如: 4 层级的会覆盖,3 层级的, 3 层级的会覆盖 2 层级的, 依次类推**

## :chicken::chicken:如何取消请求

你可以完全使用 axios 的取消请求的方式来进行取消请求的功能.

点击这里进行比较: [axios cancel](https://github.com/axios/axios#cancellation)

但是 puta 也提供了另一种方式, 相比 axios 的方式更简洁.

可以像下面这样 使用`puta.cancel()` 创建一个取消函数, 查看如下代码: 

```js
let puta = Puta();

let cancel = puta.cancel();

puta.get('/user/12345', {
  cancel
}).catch(function (err) {
  if (err.isCancel) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancel
})

// 取消请求 ( message 参数是可选的)
cancel('用户取消了请求');

```

也可以不使用 `puta.cancel()`, 而是给一个空对象: 

```js
let puta = Puta();

let cancel = {}

puta.get('/user/12345', {
  cancel
});

// 取消请求
cancel.cancel('请求被取消')

```

两种方式的异同, 相对来说第二种方式更加简洁, 但是需要提前取消请求只能使用第一中:

```js
let puta = Puta();

let cancel1 = puta.cancel();

// 在 cancel1 函数传递给 config 之前就可以提前取消
cancel1('我被提前取消了');

puta.get('/user/12345', {
  cancel: cancel1
})


// =====================


let cancel2 = {};

puta.get('/user/12345', {
  cancel: cancel2
})

cancel.cancel('我只能被传递给 config 之后才能取消')

```

## :chicken::chicken:关于 post和 stringfieldData 配置项的关系

在 axios 中, 提供了如何得到 [application/x-www-form-urlencoded 数据格式的 方案](https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format).

这可能会引入一个额外的 `qs` 库来序列化字符串, 这类序列化的库实现了完整的序列化标准, 功能强大, 对于复杂的数据收发标准会很有用.

但是对于一些简单的数据收发标准(项目的大多数情况都是简单的), puta 提供了更轻量化的方案.

此方案只在 post 请求生效, 我们先看看 post 请求的函数格式:

`puta.post(url [, data [,stringfield] [, config]] )`

第三参数是可选的, 可以是 bool 值, 也可以省略或是个对象.
* 如果是布尔值, 则代表含义是 stringfield 的值
* 如果是个对象, 则代表的函数是 config 对象

stringfield 设置为 true 就会对 data 进行序列化处理:

```js
let puta = Puta()

puta.post('/abc', {name: 'bob'}, true)
// 或者在 config 中进行配置
puta.post('/abc', {name: 'bob'}, {
  stringfieldData: true
})
// 以上两种方式是等价的

```

以上两种方式是等价的, 这意味着可以利用 config 的层次覆盖来得到 是否进行进行 stringfield, 查看如下代码:

```js
// 在第一层级的 config 中设置
let puta = Puta({
  stringfieldData: true
})
// 此时数据会被格式化
puta.post('/abc', {name: 'bob'})

// 如果注册了api模块, 并且没设置 stringfieldDdata, 
// 此时由于层级覆盖的关系, 数据也会被格式化
// 下面这行是伪代码
puta.apis.a.post({name: 'bob'})

// 在更高层级设置 false 可以阻止格式
puta.post('/abc', {name: 'bob'}, false)
puta.apis.a.post({name: 'bob'}, false)

==========================

// 在 2 或 3 层级进行数据格式化
// 以在第二层为例
puta.moduleRegistery({cs: '/abc'}, 'x', {
  stringfieldData: true
})

// 此时数据也会被格式化
puta.apis.cs.post({name: 'bob'})

// 在更高层级设置 false 可以阻止格式
puta.apis.cs.post({name: 'bob'}, false)

```

## res use 的执行顺序

## req use 的执行顺序

## 关于缓存

## :chicken::chicken: 为什么使用模块注册 

## :chicken::chicken: 为什么要在 config 中同时出现 use和 cancelUse



- [ ] moduleRegister 第二个参数默认值为 default
- [ ] puta 有初始实例化
- [ ] 实例化隔开的缓存