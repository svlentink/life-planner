/* @license GPLv3 */
import { saveIcal2File } from './dashboard/mods/ical-generator.js'


function eventsAsIcal(){
  saveIcal2File(getEvents())
}
document.querySelector('#icalbtn').addEventListener('click',eventsAsIcal)


function setSelectedEvent(id,start) { // FIXME
/*
When an calendar item is selected,
we can set feedback data, to reflect on it.
*/
  let data = window.data
  for (const r of document.querySelectorAll('.routine'))
    r.style.display = 'none'
  document.querySelector('.routine[data-title="'+id+'"]').style.display = 'block'
  var obj = { ...data.routines[id] }
  obj['start'] = start
  for (var i of getEvents())
    if (i.title && i.title === id)
      obj['activities'] = i.activities
  if (obj.activities && obj.actions)
    delete obj['actions']
  showReviewItem(obj)
  return obj
}

function getResetReviewItem(){
  var cont = document.querySelector('#reviewroutineitem')
  cont.style.display = 'none'
  var result = JSON.parse(cont.getAttribute('title') || '{}')
  result.reviewed = new Date()
  var s = document.querySelector('#routineitemspent')
  var d = document.querySelector('#routineitemdeviate')
  var e = document.querySelector('#routineitemeffectiveness')
  var c = document.querySelector('#routineitemcomment')
  result.spent = s.value
  result.deviate = d.value
  result.effectiveness = e.value
  result.comment = c.value
  s.value = ''
  d.value = 0
  e.value = 3
  e.nextElementSibling.innerText = 3
  c.value = ''
  console.log(result)
  return result
}

function showReviewItem(obj){
  if (localStorage.getItem('DEVMODE') != 1)
    return console.log('you can use localStorage.setItem("DEVMODE",1)')
  else
    console.log("DEVMODE enabled via localStorage")
  getResetReviewItem()
  var cont = document.querySelector('#reviewroutineitem')
  if (obj.start - Date.now() > 0) // item in future
    cont.style.display = 'none'
  else
    cont.style.display = 'block'
  cont.setAttribute('title',JSON.stringify(obj))
  document.querySelector('#routineitemstart').innerText = obj.start.toString()
}

function saveReviewItem(){
  var item = getResetReviewItem()
  var arr = JSON.parse(localStorage.getItem('reviewedevents') || '[]')
  arr.push(item)
  localStorage.setItem('reviewedevents',JSON.stringify(arr))
}
document.querySelector('#storereview').onclick = saveReviewItem

export { setSelectedEvent }
