/* @license GPLv3 */
(function (glob) { // IIFE pattern
  'use strict';

  // everything that is a string will be added as data attribute
  glob.addDataAttributes = function(elem,obj) {
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
  
  function showinfo() {
    var infos = document.getElementsByClassName('info')
    for (var i in infos)
      infos[i].setAttribute('style','display:block;')
  }
  document.querySelector('#showinfobtn').addEventListener('click',showinfo)

}(typeof window !== 'undefined' ? window : global))
