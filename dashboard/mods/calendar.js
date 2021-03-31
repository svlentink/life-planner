/* @license GPLv3 */
import * as hack from 'https://cdn.lent.ink/js/npm/fullcalendar-v4.js'
const Calendar = window.npm['fullcalendar-v4'].Calendar

/**
 * The callback is triggered on clicking an item in the calendar
 */
function renderCalendar(events, target='#calendar',callback=console.log) {
    let div = target
    if (typeof target === 'string')
        div = document.querySelector(target)
    
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
      events: events,
      eventClick: function(info) {
        info.jsEvent.preventDefault()
        const id = info.event.title
        const st = info.event.start
        callback(id,st)
      }
    }
    
    div.innerHTML = ''
    var calendar = new Calendar(div, params)
    calendar.render()
}

export { renderCalendar }
