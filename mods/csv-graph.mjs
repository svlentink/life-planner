/* @license GPLv3 */
import { LoadElem, substitute_baseURLs } from './abstractelem.mjs'
import { get_color, renderGraph } from './graph.mjs'
import { Csv } from './csv.mjs'


class CsvGraph extends LoadElem {
  datasets(){
    /*
    This specific data format is used by graph.js
    */
    var dataframe = {}
    for (const colname of this.csv.header)
      dataframe[colname] = []

    for (const row of this.csv.parse_lines())
      for (const colname of this.csv.header){
        let val = row[colname]
        dataframe[colname].push(val)
      }
    let datekey = this.csv.header[0]
    let dates = dataframe[datekey]
    delete dataframe[datekey]
    var datasets = []
    let i = 0
    for (const [key,val] of Object.entries(dataframe)){
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
  constructor(path){
    super({})
    this.path = substitute_baseURLs(path)
    this.graph = this.render_elem('canvas')
    this.loadURL(this.path, (data) => {
      this.raw = data
      this.csv = new Csv(this.path, data)
      renderGraph(this.graph, this.datasets(), this.path, 'time')
      this.set_raw(this.graph)
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
