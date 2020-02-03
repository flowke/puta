
// let axios = jest.genMockFromModule('axios');
const axios = require('axios');

// axios.create = jest.fn(()=>axios)

axios.CancelToken.source = jest.fn(()=>{
  return {
    cancel: jest.fn(),
    token: 'token'
  }
})


module.exports = axios;