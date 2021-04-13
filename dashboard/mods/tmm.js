/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class TmmRow extends AbstractElem {
  get_child_type() { return TmmBucket }
  elem_details(key){
    if (key === 'container') return {
      type: 'tr',
    }
    return super.elem_details(key)
  }
}
class TmmBucket extends TmmRow {
  elem_details(key){
    if (key === 'container') return {
      type: 'td',
    }
    if (key === 'stringify') return {
      type: 'li',
      innerText: this.raw,
    }
    return super.elem_details(key)
  }
}
class TimeManagementMatrix extends AbstractElem {
  container_classname(){ return 'timemanagementmatrix' }
  get_child_type(){ return TmmRow }
  constructor(inp,key){
    let important = inp.important || {}
    let unimportant = inp.unimportant || {}
    let res = [
      [
        important.urgent || [],
        important['non-urgent'] || [],
      ],
      [
        unimportant.urgent || [],
        unimportant['non-urgent'] || [],
      ]
    ]
    super(res,key)
  }
  elem_details(key){
    if (key === 'container') return {
      type: 'table',
      attributes: { 'class': this.container_classname() },
    }
    return super.elem_details(key)
  }
}
class TimeManagementMatrixBox extends AbstractElem {
  container_classname() { return 'tmmbox' }
  get_child_type(){ return TimeManagementMatrix }
  generate_from_dict(){
    let child = this.generate_child(this.raw)
    return [ child ]
  }
  elem_details(key){
    if (key === 'container' && this.key)
      return {
        type: 'article',
        attributes: {'class': this.key + ' ' + this.container_classname(key)},
        innerHTML: '<h3>' + this.key + '</h3>'
      }
    return super.elem_details(key)
  }
}
class TimeManagementMatrices extends AbstractElem {
  container_classname(){ return 'timemanagementmatrices' }
  get_child_type(){ return TimeManagementMatrixBox }
}



function tmmToOneFormat(inp) {
  var result = {}
  function addToResult(indx,val){
    if (!(indx in result)) result[indx] = []
    if (typeof val === 'object') result[indx] = result[indx].concat(val)
    else result[indx].push(val)
  }

  for (var ai in inp){//arguments){
    var arr = inp[ai]//arguments[ai]

    if ('important' in arr){ // The nested format
      var imp = arr['important']
      if ('urgent' in imp) addToResult(1,imp['urgent'])
      if ('non-urgent' in imp) addToResult(2, imp['non-urgent'])
      if ('unimportant' in arr){
        var uimp = arr['unimportant']
        if ('urgent' in uimp) addToResult(3,uimp['urgent'])
        if ('non-urgent' in uimp) addToResult(4, uimp['non-urgent'])
      }
    }
    else for(var i in arr) { // the format where every item has a priority set
      var obj = arr[i]
      var prio = obj['prio'] || 4
      if ('title' in obj) addToResult(prio,obj['title'])
    }
  }
  return result
}


function rendertmms(elemid, tmms) {
  var cont = document.getElementById(elemid) //container
  cont.innerHTML = '' //reset
  for (var key in tmms){
    var val = tmms[key]
    var h = document.createElement('h3')
    h.innerText = key
    var data = rendertmm(val)
    cont.appendChild(h)
    cont.appendChild(data)
  }
}

function rendertmm(input) {
  if (typeof input === 'string') {
    var a = document.createElement('a')
    a.setAttribute('href',input)
    a.innerText = input
    return a
  }
  var items = tmmToOneFormat(input)
  var table = document.createElement('table')
  table.setAttribute('class','tmm')
  
  var th = document.createElement('tr')
  th.innerHTML = '<th/><th>urgent</th><th>not urgent</th>'
  table.appendChild(th)

  function arrAsElem(arr) {
    var ul = document.createElement('ul')
    for (var i in arr){
      var li = document.createElement('li')
      li.innerText = arr[i]
      ul.appendChild(li)
    }
    var td = document.createElement('td')
    td.appendChild(ul)
    return td
  }

  var row1 = document.createElement('tr')
  table.appendChild(row1)
  var row1t = document.createElement('th')
  row1t.innerText = 'important'
  row1.appendChild(row1t)
  var prio1elem = arrAsElem(items['1'])
  row1.appendChild(prio1elem)
  var prio2elem = arrAsElem(items['2'])
  row1.appendChild(prio2elem)
  
  var row2 = document.createElement('tr')
  table.appendChild(row2)
  var row2t = document.createElement('th')
  row2t.innerHTML = 'not&nbsp;important'
  row2.appendChild(row2t)
  var prio3elem = arrAsElem(items['3'])
  row2.appendChild(prio3elem)
  var prio4elem = arrAsElem(items['4'])
  row2.appendChild(prio4elem)
  
  return table
}

export { TimeManagementMatrices }
