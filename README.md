# puta
A request lib, base on axios.

[简体中文](./zh-cn-readme.md)

## Installing

```
$ npm install puta
```

## Example

instance Request

```js
import Request form 'puta';

let req = new Request({
  baseURL: xxx,
  timeout: 12000
});

// or
let req = Request({
  baseURL: xxx,
  timeout: 12000
});


```

Performing a request

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

register paths modules

```js
import puta form 'puta';

let req = puta();

// register a menu module
req.moduleRegister({
  a: '/app',
  b: '/init.js',
}, 'menu')

// register a home module
// path also can pass a object 
req.moduleRegister({
  c: '/app',
  d: {
    path: '/init.js',
    adapin: (data)=>{

      // here to deal with data before pass to request

      return data
    },
    adapout: (response)=>{
      
      // here to deal with response after response

      return response
    },
  },
}, 'home')


// now you can perform a request like this:

// use the 'a' path in the module menu
// access path with module namespace
req.mApis.home.a() // get
req.mApis.home.a.post() //post

// access path without module namespace
req.apis.a.post() //post
req.apis.d.get() //get

```


## API

### `new Puta([options], [paths])`  or  `puta([options], [paths])`

**options**  
options is the axios config, the follow up requests all base on this options

**paths**  type: object

if you pass a paths object, it will register a path module named 'common'.

### Instance property

**.mApis**

type: `Proxy`

namespace of api paths.

**.apis**

type: `Proxy`

directly to access api paths without namespace, that means there is a risk of naming contamination

### Instance methods

**Request method**

`.get(url [, params [, config]])`   
`.delete(url [, params [, config]])`  
`.head(url [, params [, config]])`  
`.options(url [, params [, config]])`  
`.post(url [,data, [,stringified] [,config]])`  
`.put(url [,data, [,stringified] [,config]])`  
`.patch(url [,data, [,stringified] [,config]])`

*config*: is the axios config.  

*stringified*: boolean, whether to  serializes data like `querystring.stringify()` do .


**.all(Array\<Promise\>)**

like axios.all()

**.setDefaults(callback)**

callback is a function allow you to receive one argument: axios-instance's defaults


**.reqUse(...args)**

alias of axios.interceptors.request.use


**.resUse(...args)**

alias of axios.interceptors.response.use



**.moduleRegister(apis, name)** :sweet_potato::sweet_potato::sweet_potato:

apis: `path module`, type: object  
name: `module namespace`, type: string

*apis:*  
type: `object`

```js
{
  // path value can be a string or a object
  path1: '',  
  path2: {
    path: '', //required
    adapin: data=>data, // optional
    adapout: response=>response, //optional
  }
}
```

adapin is a function, receive request data, you will get a chance to transform data, and must to return the data after worked	out.

adapout is a function, receive response data, you will get a chance to transform data, and must to return the data after worked	out.

**.createSource()** :sweet_potato::sweet_potato::sweet_potato:

return a `source` object.

the `source` has all property and method of puta instance. 

and has two additional methods: 

**-- _source.f(path, ...rest)_** 

path is a string that has a pattern of follows:  

- module.name.method
- module.name
- name.method
- name

example:

```js
source('menu.xxx.get', ...rest):
// equals
puta.mApis.menu.xxx.get(...rest)

---

source('menu.xxx', ...rest):
// equals
puta.mApis.menu.xxx.get(...rest)

---

source('xxx.post', ...rest):
// equals
puta.apis.xxx.post(...rest)

---

source('xxx', ...rest):
// equals
puta.apis.xxx.get(...rest)

```
The difference between using `f` and `puta` to do request is: 

`f` will always get a fresh result and then cache the result, and `puta` request won't cache.

<br>

**-- _source.take(path)_**

use `f`'s path pattern(without method) to take the cached result.

example:

```js
source.f('menu.xxx.post')

// in the other moment(pretending request done) you can take out the result like this:
// notes: no method
source.take('menu.xxx')

```