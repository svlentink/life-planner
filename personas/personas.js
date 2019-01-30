/* @license GPLv3 */
(function (glob) { // IIFE pattern
  'use strict';

  function createElem(clss,obj){
    var div = document.createElement("div")
    div.setAttribute('class',clss)
    div = glob.addDataAttributes(div,obj)
    
    var title = document.createElement('span')
    title.innerText = obj['title'] || 'No_title_found'
    title.setAttribute('class', 'title')
    
    var desc = document.createElement('span')
    desc.innerText = obj['desc'] || 'No_description_found'
    desc.setAttribute('class', 'desc')
    
    var img = document.createElement('img')
    img.setAttribute('src', obj['img'] || 'https://placeimg.com/400/400/any')
  
    div.appendChild(title)
    div.appendChild(desc)
    div.appendChild(img)
    
    return div
  }
  
  glob.renderpersonas = function(elemid, personas) {
    var cont = document.getElementById(elemid) //container
    cont.innerHTML = '' //reset
    var lcont = document.createElement('div')
    function createGoalsElem(goals){
      var div = document.createElement('div')
      div.setAttribute('class','goals')
      
      for (var i in goals){
        var obj = goals[i]
        var elem = createElem('goal',obj)
        div.appendChild(elem)
      }
      return div
    }
    for (var i in personas){
      var obj = personas[i]
      var info = createElem('persona-info',obj)
      var goals = createGoalsElem( obj['goals'] || {} )
      var elem = document.createElement('article')
      elem.setAttribute('class','persona')
      elem.appendChild(info)
      elem.appendChild(goals)
      cont.appendChild(elem)
    }
  }

}(typeof window !== 'undefined' ? window : global))
