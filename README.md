# puta
A request lib, encapsulation of axios.

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