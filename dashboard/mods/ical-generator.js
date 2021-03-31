/* @license GPLv3 */
import * as hack from 'https://cdn.lent.ink/js/npm/ical-generator.js'
const ical = window.npm['ical-generator'].default
import { saveToFile } from 'https://cdn.lent.ink/js/mod/storage.js'

var cal = ical({
    domain: 'lent.ink',
    prodId: {company: 'lent.ink', product: 'Life-Planner'},
    name: 'exported-routines'
})

function getIcal(events) {
    if (! cal.length()) {
      for (var i in events){
        var ev = events[i]
        cal.createEvent(ev)
      }
    }
    return cal
}

function saveIcal2File(events, filename='routines.ical') {
    var cal = getIcal(events)
    saveToFile(cal.toString(), filename)
}

export { saveIcal2File }
