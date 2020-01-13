import stringify from 'lib/stringify';


it('no parse value', ()=>{
  expect(stringify({
    b: Symbol(),
    c: undefined,
    d: function(){}
  })).toBe('')
})