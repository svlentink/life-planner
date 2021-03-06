//import $ from 'jquery';
import { Calendar } from 'fullcalendar';

(function (glob) { // IIFE pattern
  'use strict';
  
  glob.showCalendar = function(events) {
    
    var div = document.querySelector('#calendar');

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
        glob.setSelectedEvent(id,st)
      }
    }
    
    div.innerHTML = ''
    var calendar = new Calendar(div, params)
    calendar.render()
  }

}(typeof window !== 'undefined' ? window : global))

