/* @license GPLv3 */

import { renderroutines, getEvents } from './routines.js'
import { renderpersonas, renderrolesview } from './personas.js'
import { renderlists } from './dashboard/mods/renderlists.js'
import { rendertmms } from './dashboard/mods/tmm.js'
import { showCalendar } from './calendar.js'
import { renderGraph } from './graph.js'


/*
function showinfo() {
  var infos = document.getElementsByClassName('info')
  for (var i in infos)
    infos[i].setAttribute('style','display:block;')
}
let showinfobtn = document.querySelector('#showinfobtn')
if (showinfobtn) showinfobtn.addEventListener('click',showinfo)
*/

function orchestrator(){
  console.log('Orchestrator called')
  let data = window.data
  if (! data) return console.log('window.data not loaded yet, waiting for YAML.load')

  if (! renderrolesview) return console.log('renderrolesview not loaded yet')
  renderrolesview('rolesview', data.personas.data)

  if (! renderpersonas) return console.log('renderpersonas not loaded yet')
  renderpersonas('personas', data.personas.data)

  if (! renderlists) return console.log('renderlists not loaded yet')
  renderlists('foundation', data.foundation)
  renderlists('lifelists', data.lifelists)

  if (! renderroutines) return console.log('renderroutines not loaded yet')
  renderroutines('routines', data.routines, data.activities)

  if (! showCalendar) return console.log('showCalendar not loaded yet')
  showCalendar(getEvents())

  if (! renderGraph) return console.log('renderGraph not loaded yet')
  renderGraph(data.personas.data, data.activities, data.routines)

  if (! rendertmms) return console.log('rendertmms not loaded yet')
  rendertmms('tmm', data.tmms)
}

export { orchestrator }
