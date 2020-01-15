
let axios = jest.genMockFromModule('axios');

axios.create = jest.fn(()=>axios)

module.exports = axios;