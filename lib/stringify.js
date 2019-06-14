
export default function(object){
  var arr = [];
  
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var val = object[key];
      arr.push(`${key}=${val.toString()}`)
    }
  }
  return arr.join('&');
}