/* @license GPLv3 */
import { saveIcal2File } from './dashboard/mods/ical-generator.js'

function renderroutines(elemid, routines, activities) {
  var cont = document.getElementById(elemid) //container
  cont.innerHTML = '' //reset

  function actionElem(act){
    var acont = document.createElement('li')
    acont.setAttribute('class', 'action')
    //acont = glob.addDataAttributes(acont,act)
    
    var time = document.createElement('span')
    time.setAttribute('class', 'time')
    time.innerText = act['time'] || act['duration'] || 0
    timetotal += parseInt(time.innerText || 0)
    acont.appendChild(time)
    
    var title = document.createElement('span')
    title.setAttribute('class', 'title')
    title.innerText = actid || 'No_title_found'
    acont.appendChild(title)
    
    var desc = document.createElement('span')
    desc.setAttribute('class', 'desc')
    desc.innerText = act['desc'] || 'No_description_found'
    acont.appendChild(desc)
    return acont
  }
  var usedactivities = []
  for (var key in routines){
    var obj = routines[key]
    obj.title = key
    var rcont = document.createElement('article')
    rcont.setAttribute('class', 'routine')
    //glob.addDataAttributes(rcont,obj)
    
    var tr = document.createElement('span')
    tr.setAttribute('class','trigger')
    tr.innerText = obj['trigger'] || 'No_trigger_found'
    rcont.appendChild(tr)
    
    var id = document.createElement('span')
    id.setAttribute('class', 'id')
    id.innerText = key
    rcont.appendChild(id)
    
    var desc = document.createElement('span')
    desc.setAttribute('class', 'desc')
    desc.innerText = obj['desc'] || 'No_description_found'
    //rcont.appendChild(desc)
    
    var actionscont = document.createElement('ul')
    actionscont.setAttribute('class', 'actions')
    var timetotal = 0
    
    for (var i in obj['actions'] || []){
      var actid = obj['actions'][i]
      usedactivities.push(actid)
      var act = (actid in activities)? activities[actid] : { title : actid }
      var acont = actionElem(act)
      actionscont.appendChild(acont)
    }
    rcont.appendChild(actionscont)
    
    var totaltime = document.createElement('span')
    totaltime.setAttribute('class', 'totaltime')
    totaltime.innerText = timetotal
    rcont.appendChild(totaltime)
    
    cont.appendChild(rcont)
  }
  var unusedacts = []
  for (var i in activities)
    if (! usedactivities.includes(i))
      unusedacts.push(i)
  var unused = document.createElement('div')
  unused.setAttribute('id','unplannedactivities')
  unused.innerText = 'Unplanned activities: ' + unusedacts.toString().replace(/,/g,' ')
  cont.appendChild(unused)
}

function eventsAsIcal(){
  saveIcal2File(getEvents())
}
document.querySelector('#icalbtn').addEventListener('click',eventsAsIcal)

function getEvents() {
  let data = window.data
  if (! (data && data.routines) ) return console.log('no routines found')
  if (! data.activities) return console.log('no activities found')
  var events = createEvents(data.routines, data.activities)
  return events
}

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

function createEvents(routines, activities, amountofweeks = 3){
  var events = []
  
  var days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']
  function getFirstOccurrence(extraMinutes){
    for (var d = (new Date()).getDay(); d <= 14; d++){
      var day = days[d%7]
      if (start.days.indexOf(day) !== -1)
        return new Date(
          (new Date()).getFullYear(),
          (new Date()).getMonth(),
          (new Date()).getDate() + ((new Date()).getDay() - d -7),
          parseInt(start.time.split(':')[0]),
          parseInt(start.time.split(':')[1]) + (extraMinutes || 0)
        )
    }
  }
  
  function Ical2FullcalendarDays(arr){
    //https://fullcalendar.io/docs/v4/recurring-events
    var result = []
    for(var i=0; i< days.length;i++)
      if (arr.includes(days[i]))
        result.push(i)
    return result
  }

  for(var key in routines){
    var routine = routines[key]
    if (routine.start){
      var title = key
      //if (routine.trigger) title += ' <= ' + routine.trigger

      var desc = []
      var acts = []
      if (routine.desc) desc.push(routine.desc)
      var totaltime = 0
      if (routine.actions) for (var j in routine.actions) {
        var action = routine.actions[j]
        if (activities[action]){
          var act = activities[action]
          acts.push(act)
          var time = (act.time || act.duration || 0)
          totaltime += time
          var row = time + ' '
          row += action
          if (act.desc) row += ', ' + act.desc
          desc.push(row)
        } else {
          desc.push('0  ' + action)
        }
      }
      
      for (var s in routine.start){
        var start = routine.start[s]
        if (typeof start.days === 'string'){
          if (start.days.toLowerCase() === 'weekdays')
            start.days = ['mo', 'tu', 'we', 'th', 'fr']
          else // daily
            start.days = days
        }
        
        var event = {
          start: getFirstOccurrence(),
          end: getFirstOccurrence(totaltime),
          summary: title,
          title: title,
          description: desc.join('\n'),
          category: 'routine',
          //location: 'planet earth',
          //organizer: 'Some One <mail@some.one>',
          //url: 'http://lent.ink/projects/life-planner',
          repeating: {
            freq: 'DAILY',
            byDay: start.days,
            /*count: start.days.length * amountofweeks*/
          },
          daysOfWeek: Ical2FullcalendarDays(start.days),
          startRecur: getFirstOccurrence(),
          startTime: getFirstOccurrence().toTimeString().substr(0,5),
          endTime: getFirstOccurrence(totaltime).toTimeString().substr(0,5),
          routine_actions: routine.actions || [],
          activities: acts
        }
        events.push(event)
      }
    }
  }
  return events
}

export { renderroutines, getEvents, setSelectedEvent }
