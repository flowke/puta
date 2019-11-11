
export default function(object){
  var arr = [];
  
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var val = object[key];

      if (val === null){
        val = '';
      }else if (val === undefined){
        continue;
      }else if(typeof val === 'number'){
        val = val.toString()
      }else if (typeof val === 'boolean'){
        val = val.toString();
      }else if (type(val) === '[object Object]'){
        val = JSON.stringify(val)
      }else if (type(val) === '[object Array]') {
        val = JSON.stringify(val)
      }else if (typeof val !== 'string') {
        continue;
      }
      
      arr.push(`${key}=${val}`)
    }
  }
  return arr.join('&');
}

function type(val){
  return Object.prototype.toString.call(val)
}