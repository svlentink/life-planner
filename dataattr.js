
// everything that is a string will be added as data attribute
function addDataAttributes(elem,obj) {
  for (var key in obj){
    var val = obj[key]
    var attr = 'data-' + key.toLocaleLowerCase() //https://www.w3schools.com/tags/att_global_data.asp
    if (typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean') elem.setAttribute(attr, val)
  }
  elem.setAttribute('title',JSON.stringify(obj,null,2))
  return elem
}

export { addDataAttributes }