/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'
import { renderGraph } from './graph.js'
import * as hack from 'https://cdn.lent.ink/js/npm/chart.js.js'
const Chart = window.npm['chart.js'].Chart


class CsvGraph extends AbstractElem {
  valid_header_line(line){
    return line.substr(0,5).toLocaleLowerCase() === 'date,'
  }
  parse_header(){
    let line = this.raw.split('\n')[0]
    if (! this.valid_header_line(line))
      return console.error('Invalid header line for CSV',this.csv)
    for (const key of [',',';','\t','|'])
      if (line.indexOf(key) !== -1)
        return line.split(key)
    return console.error('no valid separator',this.url)
  }
  parse_lines(){
    let result = [],
        last = new Date(1970,1,1).toISOString().substr(0,10),
        lines = this.raw.split('\n')
    lines.forEach((val,key) => {
      if (val.length > 8 && ! isNaN(Number(val.substr(0,4)))) result.push(this.parse_line(val))
      else {
        if (! this.valid_header_line(val)) // header line
          console.log('ignoring',key,val, this.url)
      }
    })
    result.forEach((val,key) => {
      if (val.date < last) console.log('WARNING please verify order',key,val,this.url)
      last = val.date
    })
    return result
  }
  parse_line(line){
    const y = line.substr(0,4),
          ints = '0123456789'
    var i = 4,
        foundfirst = false,
        m = '',
        d = '',
        sep = '' //separator
  
    for (;i < line.length;i++){ // this loop gets month
      var c = line[i] // character
      if (foundfirst && ! ints.includes(c)) break
      if (ints.includes(c)) foundfirst = true
      if(foundfirst) m += c
    }
    for (;i < line.length;){ // this loop gets day
      i++
      var c = line[i]
      if (ints.includes(c)) d += c
      else {
        sep = c
        i++
        break
      }
    }
    //var date = new Date(parseInt(y),parseInt(m),parseInt(d)).toISOString().substr(0,10) // does not do what you would expect
    let date = y + '-' + ('0'+m).substr(-2) + '-' + ('0'+d).substr(-2),
        result = {date: date}
    var vals = line.substr(i).split(sep)
    for (let j in vals){
      var num = Number(vals[j])
      let indx = this.header[parseInt(j)+1]
      result[indx] = num
    }

    return result
  }
  datasets(){
    var data = {}
    for (const title of this.header)
      data[title] = []
    for (const row of this.parse_lines())
      for (const [key,val] of Object.entries(row))
        data[key].push(val)

    let datekey = this.header[0]
    let dates = data[datekey]
    delete data[datekey]
    var datasets = []
    for (const [key,val] of Object.entries(data))
      datasets.push({label: key, data: val})
    
    return {
      labels: dates,
      datasets: datasets,
    }
  }
  loadURL(url,cb) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       cb(this.responseText)
      }
    }
    xhttp.open("GET", url, true)
    xhttp.send()
  }
  container_classname(){ return 'csvgraph' }
  constructor(url){
    super({})
    this.url = url
    this.graph = this.render_elem('canvas')
    this.loadURL(url, (data) => { window.csv = this
      this.raw = data
      this.header = this.parse_header()
      //renderGraph(this.graph, this.datasets(), 'CSV', 'x', 'y', 'line')
      //return
      new Chart(this.graph, {
        type: 'line',
        data: this.datasets(),
        options: {
          scales: {
            x: {
              type: 'time',
              display: true,
              time: {
                  unit: 'day'
              }
            },
            y: {
              display: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: url
            }
          }
        }
      })
    })
  }
  get_elem(){
    return this.graph
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
}

export { CsvGraph }
