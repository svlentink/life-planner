/* @license GPLv3 */

//In the following block you can switch the imports by removing '\ //WEBPACK'
 //WEBPACK/*
import * as hack from 'https://cdn.lent.ink/js/npm/ical-generator.js'
const ical = window.npm['ical-generator'].default // the following additional postfix was needed before v4; .default

const { saveToFile } = import('https://cdn.lent.ink/js/mod/storage.js')
/*
* //WEBPACK/
import { Buffer } from 'buffer/'
window.Buffer = Buffer
import { ical } from 'ical-generator'
const { saveToFile } = import('./storage.js')
//*/

function getIcal(events, timezone) {
    var cal = ical({
        domain: 'lent.ink',
        prodId: {company: 'lent.ink', product: 'Life-Planner'},
        name: 'exported-routines',
        timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    if (! cal.length()) {
      for (var i in events){
        var ev = events[i]
        cal.createEvent(ev)
      }
    }
    return cal
}

function saveIcal2File(events, filename='routines.ical', timezone) {
    let cal = getIcal(events, timezone)
    let calstr = cal.toString()
    saveToFile(calstr, filename)
}

export { saveIcal2File }
