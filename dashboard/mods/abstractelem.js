

class AbstractElem {
  constructor(obj, children=[]){
    this.raw = obj
    this.children = children
  }
  // everything that is a string will be added as data attribute
  addDataAttributes(elem) {
    for (var key in this.raw){
      var val = this.raw[key]
      var attr = 'data-' + key.toLocaleLowerCase() //https://www.w3schools.com/tags/att_global_data.asp
      if (typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean') elem.setAttribute(attr, val)
    }
    elem.setAttribute('title',JSON.stringify(this.raw, null, 2))
    return elem
  }
  get_elem(){
    let div = document.createElement("div")
    div.setAttribute('class', this.get_class())
    div = this.addDataAttributes(div)
    
    // Elements either use a list of fields it want to generate
    // or it provides children to add
    for (let key of this.fields()){
      let elem_details = this.default_elem(key)
      let elem = document.createElement(elem_details.type)
      //FIXME make innerText part of also a loop; elem_details[innertext]
      if ('innerText' in elem_details) elem.innerText = elem_details.innerText
      if ('attributes' in elem_details)
        for (let k in elem_details.attributes){
          let v = elem_details.attributes[k]
          elem.setAttribute(k,v)
        }
      div.appendChild(elem)
    }
    for (let c of this.children){
      let child = this.generate_child(c)
      div.appendChild(child)
    }
    return div
  }
  default_elem(key){
    let attr = {
      'class': this.get_class(key),
      'id': this.get_id(),
    }
    let elems = {
      title: {
        type: 'span',
        innerText: this.get_val(key),
        attributes: attr,
      },
      desc: {
        type: 'span',
        innerText: this.get_val(key),
        attributes: attr,
      },
      img: {
        type: 'img',
        attributes: {
          'src': this.get_val(key),
        },
      },
    }
    if (key in elems) return elems[key]
    return {
      type: 'span',
      innerText: 'ERROR unknown key: ' + key,
    }
  }
  default_value(key){
    let keys = {
      title: 'No_title_found',
      desc: 'No_description_found',
      img: 'https://placeimg.com/400/400/any'
    }
    if (key in keys) return keys[key]
    return undefined
  }
  get_val(key){
    if (key in this.raw) return this.raw[key]
    return this.default_value(key)
  }
  fields(){ return [] }
  get_id(){ return '' }
  get_class(inp){ return inp }
  generate_child(obj){
    let child = new AbstractElem(obj)
    return child.get_elem()
  }
}

export { AbstractElem }
