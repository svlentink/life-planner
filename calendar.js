import { renderCalendar } from './dashboard/mods/calendar.js'

let showCalendar = (events) => {renderCalendar(events, '#calendar', window.setSelectedEvent)}

export { showCalendar }
