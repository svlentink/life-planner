/* @license GPLv3 */

//In the following block you can switch the imports by removing '\ //WEBPACK'
 //WEBPACK/*
import * as hack from 'https://cdn.lent.ink/js/npm/fullcalendar.js'
const { Calendar, timeGridPlugin, iCalendarPlugin, rrulePlugin } = window.npm['fullcalendar']
/*
* //WEBPACK/
window.ICAL = window.ICAL || {}
import { Calendar } from '@fullcalendar/core'
import iCalendarPlugin from '@fullcalendar/icalendar'
import timeGridPlugin from '@fullcalendar/timegrid'
//*/


/**
 * The callback is triggered on clicking an item in the calendar
 */
function renderCalendar(events, target='#calendar',callback) {
    let div = target
    if (typeof target === 'string')
        div = document.querySelector(target)

/*    
    var params = {
      header: {
        left: 'prev,next today',
        //center: 'title',
        right: 'agendaWeek,agendaDay,listWeek'
      },
      defaultView: 'agendaWeek',
      firstDay: 1,
      navLinks: true, // can click day/week names to navigate views
      eventLimit: true, // allow "more" link when too many events
*/
    div.innerHTML = ''
    if (typeof events === 'string')
      renderIcalURLCalendar(div, events, callback)
    else
      renderFullCalendar(div, events, callback)
}

function renderIcalURLCalendar(elem, url, callback){
  let p = [timeGridPlugin, iCalendarPlugin, rrulePlugin]
  let e = {
    url: url,
    format: 'ics'
  }
  renderFullCalendar(elem, e, callback, p)
}

function renderFullCalendar(elem, events, callback=x=>{console.log(x.summary, x.description)}, plugins=[ timeGridPlugin, rrulePlugin ]){
  let params = {
    plugins: plugins,
    initialView: 'timeGridWeek',
    events: events,
    eventClick: (info) => {
      info.jsEvent.preventDefault()
      callback(info.event._def.extendedProps)
    },
  }
  let calendar = new Calendar(elem, params)
  calendar.render()
  // the set interval is an ugly hack to deal with the fact
  // that the calendar only renders when it is actively displayed
  window.setInterval(() => {
    //console.debug('rendered calendar',params,calendar)
    calendar.render()
  }, 1000)
}

export { renderCalendar }

