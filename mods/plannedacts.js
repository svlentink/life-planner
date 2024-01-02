/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'
import { renderGraph, create_dataset } from './graph.js'
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
    let dataset1 = create_dataset(meta.planned_acts, 'minutes_allocated_per_week')
    renderGraph(graph1, dataset1, 'Minutes planned p/w')

    let graph2 = this.render_elem('canvas')
    let dataset2 = create_dataset(meta.energy_ratio)
    renderGraph(graph2, dataset2, 'Energy ratio in min. for planned activities p/w', 'pie')

    let graph3 = this.render_elem('canvas')
    let dataset3 = create_dataset(meta.planned_but_not_defined)
    renderGraph(graph3, dataset3,'Planned but not defined activities p/w')

    let graph4 = this.render_elem('canvas')
    let dataset4 = create_dataset(meta.moscow_ratio)
    renderGraph(graph4, dataset4, 'MoSCoW ratio in min. for planned activities p/w', 'pie')

    let graph5 = this.render_elem('canvas')
    let dataset5 = create_dataset(meta.planned_time_per_goal)
    renderGraph(graph5, dataset5, 'Planned min. for goals p/w')

    let graph6 = this.render_elem('canvas')
    let dataset6 = create_dataset(meta.maslow_ratio)
    renderGraph(graph6, dataset6, 'Maslow Hierarchy ratio in min. for planned activities p/w', 'pie')

    let list = (new Lists({
      'Not planned activites': Object.keys(meta.not_planned)
    })).get_elem()

    let cont = this.render_elem('container')
    cont.appendChild(graph1)
    cont.appendChild(graph2)
    cont.appendChild(graph3)
    cont.appendChild(graph4)
    cont.appendChild(graph6)
    cont.appendChild(graph5)
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
    let planned_acts = {}
    let times = this.acts_time_per_week()
    let fuel = 0 // activities that give cognitive fuel
    let burn = 0 // acts that burn you out
    /*let moscow = {
      must: [],
      should: [],
      could: [],
      wont: [],
    }*/
    let moscow_times = {
      must: 0,
      should: 0,
      could: 0,
      wont: 0,
    }
    let maslow_times = {
      physiological: 0,
      safety: 0,
      belong: 0,
      esteem: 0,
      actualization: 0,
    }
    let goal_times = {}
    for (const [key,actdetails] of Object.entries(acts)){
      if (key in times){
        actdetails['minutes_allocated_per_week'] = times[key]
        planned_acts[key] = actdetails
        if ('energize' in actdetails){
          if (actdetails.energize)
            fuel += times[key]
          else
            burn += times[key]
        }

        if ('moscow' in actdetails){
          let val = actdetails.moscow.toLowerCase()
          if (val in moscow_times){
            //moscow[val].push(key)
            moscow_times[val] += times[key]
          }
          else console.warn('Activity does not specify valid moscow',key)
        } else console.warn('Activity does not contain moscow',key)

        if ('maslow' in actdetails){
          let val = actdetails.maslow.toLowerCase()
          if (val in maslow_times){
            maslow_times[val] += times[key]
          }
          else console.warn('Activity does not specify valid maslow',key)
        } else console.warn('Activity does not contain maslow',key)

        if ('goals' in actdetails && Array.isArray(actdetails.goals))
          for (const goal of actdetails.goals){
            if (!(goal in goal_times)) goal_times[goal] = 0
            goal_times[goal] += times[key]
          }
      }
      else
        not_planned[key] = actdetails
    }
    for (const [key,time] of Object.entries(times)){
      if (!(key in planned_acts || key in not_planned))
        discrepancy[key] = time
    }
    return {
      planned_acts: planned_acts,
      not_planned: not_planned,
      planned_but_not_defined: discrepancy,
      energy_ratio: {
        burning: burn,
        fueling: fuel,
      },
      moscow_ratio: moscow_times,
      maslow_ratio: maslow_times,
      planned_time_per_goal: goal_times,
    }
  }
}

export { PlannedActivities }
