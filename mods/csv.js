/* @license GPLv3 */
import { LoadElem, substitute_baseURLs } from './abstractelem.js'
import { get_color, renderGraph } from './graph.js'


class CsvGraph extends LoadElem {
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
          if (val.length !== 0) // not printing a warning for empty lines
            console.warn('ignoring',key,val, this.url)
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
      let item = vals[j]
      let num
      if (item.indexOf(':') !== -1) // convert time notation to decimal
        num = Number(item.split(':')[0]) + (Number(item.split(':')[1]) / 60)
      else{
        if (item.length === 0)
          num = NaN
        else
          num = Number(item)
      }
      
      let indx = this.header[parseInt(j)+1] // +1 because of date at front
      if (indx && num !== NaN)
        result[indx] = num
      else
        console.warn('Ignoring', indx, vals[j], this.url)
    }

    return result
  }
  datasets(){
    var data = {}
    for (const title of this.header)
      data[title] = []
    for (const row of this.parse_lines())
      for (const title of this.header){
        let val = row[title]
        data[title].push(val)
      }
    let datekey = this.header[0]
    let dates = data[datekey]
    delete data[datekey]
    var datasets = []
    let i = 0
    for (const [key,val] of Object.entries(data)){
      let color = get_color(i)
      datasets.push({label: key, data: val, borderColor: color})
      i++
    }
    
    return {
      labels: dates,
      datasets: datasets,
    }
  }

  container_classname(){ return 'csvgraph' }
  constructor(url){
    super({})
    this.url = substitute_baseURLs(url)
    this.graph = this.render_elem('canvas')
    this.loadURL(this.url, (data) => {
      this.raw = data
      this.header = this.parse_header()
      renderGraph(this.graph, this.datasets(), this.url, 'time')
    })
  }
  get_elem(){
    return this.graph
  }
  elem_details(key){
    if (key === 'canvas') return {
      type: key,
      attributes: {
        style: 'max-height:500px;border:1px solid;margin:5px;'
      }
    }
    return super.elem_details(key)
  }
}

export { CsvGraph }
