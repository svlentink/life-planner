/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'
import { renderGraph } from './graph.js'
import { Lists } from './renderlists.js'


class PlannedActivities extends AbstractElem {
  container_classname(){ return 'plannedactivites' }
  constructor(obj){
    if (! (obj && obj.routines && obj.activities))
      return console.error('keys missing: routines, activities',obj)
    super({})
    this.raw = obj
    this.routines = this.load_obj(obj.routines)
    this.activities = this.load_obj(obj.activities)
  }
  get_elem(){
    let meta = this.metadata()
    let graph1 = this.render_elem('canvas')
    renderGraph(graph1, meta.result, 'Minutes planned p/w','minutes_allocated_per_week')
    let graph2 = this.render_elem('canvas')
    renderGraph(graph2, meta.energy_ratio, 'Energy ratio in min. for planned activities p/w', null, null, 'pie')
    let graph3 = this.render_elem('canvas')
    renderGraph(graph3, meta.planned_but_not_defined, 'Planned but not defined activities p/w')
    let graph4 = this.render_elem('canvas')
    renderGraph(graph4, meta.moscow_ratio, 'MoSCoW ratio in min. for planned activities p/w', null, null, 'pie')

    let list = (new Lists({
      'Not planned activites': Object.keys(meta.not_planned)
    })).get_elem()

    let cont = this.render_elem('container')
    cont.appendChild(graph1)
    cont.appendChild(graph2)
    cont.appendChild(graph3)
    cont.appendChild(graph4)
    cont.appendChild(list)
    return cont
  }
  elem_details(key){
    if (key === 'canvas') return {
      type: key,
      attributes: {
        style: 'max-height:500px;border:1px solid;'
      }
    }
    return super.elem_details(key)
  }
  acts_time_per_week(){
    let rts = this.routines
    let routineacts = {}
    for (const [key, routinedetails] of Object.entries(rts)) {
      if (! Array.isArray(routinedetails.start))
        continue
      let occurrences = 0
      for (const obj of routinedetails.start)
        occurrences += obj.days.length
      for (const act of routinedetails.actions){
        let time = parseInt(act.split(' ')[0])
        let actname = act.split(' ')[1]
        if (!(actname in routineacts))
          routineacts[actname] = 0
        routineacts[actname] += (time * occurrences)
      }
    }
    return routineacts
  }
  metadata(){
    let acts = this.activities
    let discrepancy = {}
    let not_planned = {}
    let result = {}
    let times = this.acts_time_per_week()
    let fuel = 0 // activities that give cognitive fuel
    let burn = 0 // acts that burn you out
    let moscow = {
      must: [],
      should: [],
      could: [],
      wont: [],
    }
    let moscow_times = {
      must: 0,
      should: 0,
      could: 0,
      wont: 0,
    }
    for (const [key,actdetails] of Object.entries(acts)){
      if (key in times){
        actdetails['minutes_allocated_per_week'] = times[key]
        result[key] = actdetails
        if ('energize' in actdetails){
          if (actdetails.energize)
            fuel += times[key]
          else
            burn += times[key]
        }
        if ('moscow' in actdetails){
          let val = actdetails.moscow.toLowerCase()
          if (val in moscow){
            moscow[val].push(key)
            moscow_times[val] += times[key]
          }
          else console.warn('Activity does not specify valid moscow',key)
        } else console.warn('Activity does not contain moscow',key)
      }
      else
        not_planned[key] = actdetails
    }
    for (const [key,time] of Object.entries(times)){
      if (!(key in result || key in not_planned))
        discrepancy[key] = time
    }
    return {
      result: result,
      not_planned: not_planned,
      planned_but_not_defined: discrepancy,
      energy_ratio: {
        burning: burn,
        fueling: fuel,
      },
      moscow_ratio: moscow_times,
    }
  }
}

export { PlannedActivities }
