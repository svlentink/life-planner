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
    format: 'ics',
  }
  renderFullCalendar(elem, e, callback, p)
}

function renderFullCalendar(elem, events, callback=x=>{console.log(x.summary, x.description)}, plugins=[ timeGridPlugin, rrulePlugin ]){
  // the set interval is an ugly hack to deal with the fact
  // that the calendar only renders when it is actively displayed
  //window.setInterval(() => { calendar.render()}, 1000)
  const intersectionObserver = new IntersectionObserver((entries) => {
    const observeable = entries[0]
    // If intersectionRatio is 0, the target is out of view
    // and we do not need to do anything.
    if (observeable.intersectionRatio <= 0) return
    if (elem.offsetHeight > 0) return intersectionObserver.disconnect();//already expanded
    console.debug("rendering calendar",elem.offsetHeight,elem)
    calendar.render()
  })

  let params = {
    plugins: plugins,
    initialView: 'timeGridWeek',
    events: events,
    eventClick: (info) => {
      info.jsEvent.preventDefault()
      callback(info.event._def.extendedProps)
    },
    eventSourceFailure(error){
      console.debug("failed loading", events)
      const cors_proxy = 'https://lent.ink/cors-proxy/'
      let url = events.url
      if (url.includes(cors_proxy)) return
      const new_url = cors_proxy + url.split('//')[1]
      console.debug("retry using CORS proxy (that is throttled after 1MB filesize)", url)
      renderIcalURLCalendar(elem, new_url, callback)
    },
    eventSourceSuccess(rawEvents, response){
      intersectionObserver.observe(elem)
    }
  }
  let calendar = new Calendar(elem, params)
}

export { renderCalendar }

