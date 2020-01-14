exports.ma = {
  a: '/a',
  b: '/b'
}

exports.mb = {
  c: {
    path: '/c',
    adapin: jest.fn(d=>Object.assign(d,{p:2, 'second':true})),
    adapout: jest.fn(d => Object.assign(d, { cs: 6 })),
    config: {cf:'mb/c', mbc: true}
  },
  d: '/b'
}