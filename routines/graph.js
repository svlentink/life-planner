
import Chart from 'chart.js';

(function (glob) { // IIFE pattern
  'use strict';

  var ctx = document.getElementById('timepergoal');

  glob.renderGraph = function(personas, activities, routines){
    var raw = getMetrics(personas,activities,routines)
    glob.addDataAttributes(ctx,raw)

    const labels = [],
          colors = [],
          values = [],
          obj = getMetrics(personas,activities,routines)
    for (const ri in obj.data){
      const role = obj.data[ri]
      if (role.total){
        labels.push(ri)
        colors.push('SkyBlue')
        values.push(role.total)
        for (const gi in role.data) if (role.data[gi].total) {
          labels.push(gi)
          colors.push('Yellow')
          values.push(role.data[gi].total)
        }
      }
    }
    const data = {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors
      }]
    }

    new Chart(ctx, {
      type: 'bar',
      data: data
    })
  }

  function getMetrics(personas, activities, routines){
    const result = {total:0,data:{}}
    const events = glob.getEvents(routines,activities,1)
    personas.forEach((p) => {
      result.data[p['title']] = {total:0,data:{}}
      var goals = result.data[p['title']]
      if (p.goals) for (const gi in p.goals) {
        goals.data[gi] = {total:0,data:{}}
        for (const ai in activities) if (activities[ai].goals &&
                                         activities[ai].goals.includes(gi)){
          const d = activities[ai].time || activities[ai].duration
          const occurrences = []
          events.forEach((e) => {
            e.routine_actions.forEach((a) => {
              if (a == ai) e.daysOfWeek.forEach((d) => {
                const str = 'On ' + d + 'th day of week at ' + e.startTime
                occurrences.push(str)
              })
            })
          })
          var t = d*occurrences.length
          goals.data[gi].data[ai] = {
            data: {
              duration : d,
              occurs: occurrences
            },
            total: t
          }
          goals.data[gi].total += t
        }
        result.data[p['title']].total += goals.data[gi].total
      }
    })
    return result
  }

}(typeof window !== 'undefined' ? window : global))
