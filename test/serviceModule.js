exports.ma = {
  a: '/a',
  b: '/b'
}

exports.mb = {
  c: {
    path: '/c',
    reqData: jest.fn(d=>Object.assign({},d,{p:2, 'second':true})),
    use: jest.fn(d => {
      d.call('pathcfg')
      return Object.assign({}, d, { outC: true })
    }),
    config: {cf:'path', path: true}
  },
  d: '/b'
}