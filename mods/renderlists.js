/* @license GPLv3 */

function getElem(clss,txt,url){
  var div = document.createElement("div")
  div.setAttribute('class',clss)
  div.innerText = txt
  div.setAttribute('style','background-image: url("' + url + '");')
  return div
}

/*
function rendervalues(elemid, values) {
  var cont = document.getElementById(elemid)
  cont.innerHTML = '' //reset
  for (var key in values){
    var childid = 'value'
    var imgurl = values[key].img || ''
    var div = getElem(childid, key, imgurl)
    cont.appendChild(div)
  }
}
*/

function renderlists(elemid, data, classname = 'list') {
  var cont = document.getElementById(elemid)
  cont.innerHTML = '' //reset
  for (var key in data){
    var title = document.createElement('span')
    title.setAttribute('class', 'title title-' + key)
    title.innerText = key
    var desc = document.createElement('span')
    desc.setAttribute('class', 'desc desc-' + key)
    desc.innerText = data[key].desc || 'No_description_found'

    var fl = document.createElement('article')
    fl.setAttribute('class', classname)
    fl.appendChild(title)
    fl.appendChild(desc)

    var ul = document.createElement('ul')
    for (var likey in data[key].data){
      var obj = data[key].data[likey]
      
      var li = document.createElement('li')
      
      var t = document.createElement('span')
      t.setAttribute('class', 'title')
      t.innerText = likey
      
      var d = document.createElement('span')
      d.setAttribute('class', 'desc')
      d.innerText = obj.desc || 'No_description_found'
      
      li.appendChild(t)
      li.appendChild(d)
      ul.appendChild(li)
    }
    fl.appendChild(ul)
    cont.appendChild(fl)
  }
}

export { renderlists }
