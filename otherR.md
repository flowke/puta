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
