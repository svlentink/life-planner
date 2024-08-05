/* @license GPLv3 */

class Csv {
  valid_header_line(line){
    /*
    The first line (header) is expected to start with;
    date, datetime or timestamp
    */
    let low = line.toLowerCase()
    return low.substr(0,4) == "date" || low.substr(0,9) == "timestamp"
  }
  parse_header(line){
    line = line || this.raw.split('\n')[0]
    if (! this.valid_header_line(line))
      return console.error('Invalid header line for CSV',this.path)
    for (const key of [',',';','\t','|'])
      if (line.indexOf(key) !== -1)
        return line.split(key)
    return console.error('no valid separator',this.path)
  }
  last_line_parsed(){
    /*
      We take the last line since you might add more columns to a dataset later,
      resulting in the first lines not containing all the values set.
    */
    return this.parse_lines().at(-1)
  }
  form_fields(){
    let result = [],
        now_str = (new Date(Date.now())).toISOString().substring(0,16),
        lastline = this.last_line_parsed()
    for (let h of this.header){
      let type = "text",
          val = "",
          example_val = lastline[h]
      if (["datetime", "timestamp"].includes(h.toLowerCase())){
        type = "datetime-local"
        val = now_str
      }
      if (h == "date"){
        type = "date"
        val = now_str.substring(0,10)
      }
      
      if (typeof example_val == 'number' || /^[0-9]+(\.)?[0-9]$/.test(example_val))
        type = "number"
      result.push({
        name: h,
        type: type,
        value: val,
        placeholder: example_val
      })
    }
    return result
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
            console.warn('ignoring',key,val, this.path)
      }
    })
    result.forEach((val,key) => {
      if (val.date < last) console.log('WARNING please verify order',key,val,this.path)
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
        time = '',
        result = {},
        sep = '' //separator
  
    for (;i < line.length;i++){ // this loop gets month
      var c = line[i] // character
      if (foundfirst && ! ints.includes(c)) break
      if (ints.includes(c)) foundfirst = true
      if(foundfirst) m += c
    }
    for (;i < line.length;){
      i++
      var c = line[i]
      if (ints.includes(c)){ // this loop gets day
        d += c
        continue
      }
      if (c == "T"){ // timestamp on datetime
        time = c
        for (;i < line.length;){
          i++
          c = line[i]
          if ((ints+":").includes(c))
            time += c
          else
            break
        }
      }
      sep = c
      i++
      break
    }
    //var date = new Date(parseInt(y),parseInt(m),parseInt(d)).toISOString().substr(0,10) // does not do what you would expect
    let datetime = y + '-' + ('0'+m).substr(-2) + '-' + ('0'+d).substr(-2) + time
    result[this.header[0]] = datetime
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
      
      let indx = this.header[parseInt(j)+1] // +1 because of date(time)/timestamp at front
      if (indx && num !== NaN)
        result[indx] = num
      else
        console.warn('Ignoring', indx, vals[j], this.path)
    }

    return result
  }

  constructor(path, content, header){
    /*
    header is optional, if not provided,
    it will be obtained from content
    */
    this.path = path
    this.raw = content
    this.header = this.parse_header(header)
  }
}

export { Csv }
