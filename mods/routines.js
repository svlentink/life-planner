/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'
import { saveIcal2File } from './ical-generator.js'


class Routine extends AbstractElem {
  order_of_children(){
    return [ 'trigger', 'title', 'actions', 'totaltime']
  }
  get_child_type(key){
    if (key === 'actions') return Actions
    return super.get_child_type(key)
  }
  get_val(key){
    if (key === 'totaltime'){
      if (! this.raw.actions) return 0
      let res = 0
      for (let a of this.raw.actions)
        res += Number( a.split(' ').shift() )
      return res
    }
    return super.get_val(key)
  }
  default_value(key){
    if (key === 'trigger') return 'No_trigger_found'
    return super.default_value(key)
  }
  container_classname(){ return "routine" }
  elem_details(key){
    let val = this.get_val(key)
    if (key === 'title') val = this.key
    if (['trigger','title','totaltime'].includes(key))
      return {
        type: 'span',
        attributes: this.default_attributes(key),
        innerText: val,
      }
    return super.elem_details(key)
  }
}

class Routines extends AbstractElem {
  container_classname(){ return "routines" }
  get_child_type(){ return Routine }
  get_events(/*activities,*/ amountofweeks = 3){
    let routines = this.raw
    var events = []
    
    var days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']
    function getFirstOccurrence(extraMinutes=0){
      for (var d = (new Date()).getDay(); d <= 14; d++){
        var day = days[d%7]
        if (start.days.indexOf(day) !== -1)
          return new Date(
            (new Date()).getFullYear(),
            (new Date()).getMonth(),
            (new Date()).getDate() + ((new Date()).getDay() - d -7),
            parseInt(start.time.split(':')[0]),
            parseInt(start.time.split(':')[1]) + extraMinutes
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
        //var acts = []
        if (routine.desc) desc.push(routine.desc)
        let totaltime = 0
        if (routine.actions) for (var j in routine.actions) {
          let action_line = String( routine.actions[j] || '123 example' )
          let action_arr = action_line.split(' ')
          if(action_arr.length !== 2) continue
          let action = action_arr[1]
          let act_duration = Number(action_arr[0]) || 1
          //if (activities[action]){
            //var act = activities[action]
            //acts.push(act)
            var time = act_duration //(act.time || act.duration || 0)
            totaltime += time
            var row = time + ' '
            row += action
            //if (act.desc) row += ', ' + act.desc
            desc.push(row)
          //} else {
          //  desc.push('0  ' + action)
          //}
        }

        for (var s in routine.start){
          var start = routine.start[s]
          if (typeof start.days === 'string'){
            if (start.days.toLowerCase() === 'weekdays')
              start.days = ['mo', 'tu', 'we', 'th', 'fr']
            else // daily
              start.days = days
          }

          let fields_ical_generator = {
            start: getFirstOccurrence(), //.toISOString().split('.')[0],
            end: getFirstOccurrence(totaltime), //.toISOString().split('.')[0],
            summary: title,
            description: desc.join('\n'),
            //category: 'routine',
            //location: 'planet earth',
            //organizer: 'Some One <mail@some.one>',
            //url: 'http://lent.ink/projects/life-planner',
            repeating: {
              freq: 'DAILY',
              byDay: start.days,
              /*count: start.days.length * amountofweeks*/
            },
            routine_actions: routine.actions || [],
            //activities: acts,
          }
          let fields_fullcalendar = {
            title: title,
            daysOfWeek: Ical2FullcalendarDays(start.days),
            startRecur: getFirstOccurrence(),
            startTime: getFirstOccurrence().toTimeString().substr(0,5),
            endTime: getFirstOccurrence(totaltime).toTimeString().substr(0,5),
          }
          let event = Object.assign({}, fields_fullcalendar, fields_ical_generator)
          events.push(event)
        }
      }
    }
    return events
  }
  get_export_btn(){
    let btn = document.createElement('button')
    btn.innerText = 'Export to calender (.ics)'
    btn.onclick = () => {
      let events = this.get_events()
      saveIcal2File(events)
    }
    return btn
  }
  get_elem(){
    let elem = super.get_elem()
    let btn = this.get_export_btn()
    elem.appendChild(btn)
    return elem
  }
}

class Actions extends AbstractElem {
  container_classname(){ return 'actions' }
  get_child_type(){ return Action }
  elem_details(key){
    return super.elem_details('container')
  }
}
class Action extends AbstractElem {
  order_of_children(){
    return [ 'title', 'desc']
  }
  container_classname(){ return 'action' }
  default_value(key){
    if (key === 'desc')
      console.warn('FIXME use desc of activities?!')
    return super.default_value(key)
  }
  elem_details(inp){
    let arr = this.raw.split(' ')
    return {
      type: 'div',
      attributes: this.default_attributes(),
      innerHTML: '<code>' + arr.shift() + '</code> <span>' + arr.join(' ') + '</span>',
    }
  }
}


console.debug('FIXME unplannedactivities and fuel vs burn indicator in UI')

export { Routines }