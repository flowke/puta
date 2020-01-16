
let axios = jest.genMockFromModule('axios');

axios.create = jest.fn(()=>axios)
// console.log(axios,'axios');
axios.CancelToken.source = jest.fn(()=>{
  return {
    cancel: jest.fn(),
    token: 'token'
  }
})


module.exports = axios;