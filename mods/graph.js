
import * as hack from 'https://cdn.lent.ink/js/npm/chart.js.js'
const Chart = window.npm['chart.js'].Chart
// https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc
/*
const BarElement = window.npm['chart.js'].BarElement
const Filler = window.npm['chart.js'].Filler
const Legend = window.npm['chart.js'].Legend
const Title = window.npm['chart.js'].Title
const Tooltip = window.npm['chart.js'].Tooltip
const SubTitle = window.npm['chart.js'].SubTitle
Chart.register(
  BarElement,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
)*/
const registerables = window.npm['chart.js'].registerables
Chart.register(...registerables)


function renderGraph(canvas_elem, inp, title='', objvalkey='value', objlabelkey='title', chart_type='bar'){
  function get_color(i){
    return i%2? 'SkyBlue' : 'Yellow'
  }
  const labels = [],
        colors = [],
        values = []
  let i=0
  if (Array.isArray(inp)) // either supply an array with objects
    for (const i in inp){
      colors.push(get_color(i))
      labels.push(inp[i][objlabelkey] || 'no_title_found')
      values.push(inp[i][objvalkey] || 0)
    }
  else // or use an object where the keys point to a number
    for (const [k,v] of Object.entries(inp)){
      colors.push(get_color(i))
      i++
      labels.push(k)
      if(typeof v === 'number')
        values.push(v)
      else // or even have an array of objects with one being the value
        values.push(v[objvalkey])
    }

  const data = {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: colors
    }]
  }

  new Chart(canvas_elem, {
    type: chart_type,
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  })
}

export { renderGraph }
