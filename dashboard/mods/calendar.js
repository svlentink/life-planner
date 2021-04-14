/* @license GPLv3 */
import * as hack from 'https://cdn.lent.ink/js/npm/fullcalendar.js'
const { Calendar, timeGridPlugin, iCalendarPlugin } = window.npm['fullcalendar']

/**
 * The callback is triggered on clicking an item in the calendar
 */
function renderCalendar(events, target='#calendar',callback=console.log) {
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
      renderIcalCalendar(div, events, callback)
    else
      renderFullCalendar(div, events, callback)
}

function renderIcalCalendar(elem, url, callback){
  let p = [timeGridPlugin, iCalendarPlugin]
  let e = {
    url: url,
    format: 'ics'
  }
  renderFullCalendar(elem, e, callback, p)
}

function renderFullCalendar(elem, events, callback, plugins=[ timeGridPlugin ]){
  let calendar = new Calendar(elem, {
    plugins: plugins,
    initialView: 'timeGridWeek',
    events: events,
    eventClick: (info) => {
      info.jsEvent.preventDefault()
      const id = info.event.title
      const st = info.event.start
      callback(id, st, info)
    },
  })
  calendar.render()
}

export { renderCalendar }

