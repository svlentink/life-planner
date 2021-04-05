
import * as hack from 'https://cdn.lent.ink/js/npm/yamljs.js'
const YAML = window.npm['yamljs'].default

class AbstractElem {
  constructor(obj){
    if (! obj) return console.error('ERROR nothing provided ', obj)
    this.raw = obj
  }
  // everything that is a string will be added as data attribute
  addDataAttributes(elem) {
    let obj = this.raw
    if (typeof obj === 'object' && ! Array.isArray(obj))
      for (var key in obj){
        var val = obj[key]
        var attr = 'data-' + key.toLocaleLowerCase().replace(/[^a-zA-Z0-9]*/g,'') //https://www.w3schools.com/tags/att_global_data.asp
        if (typeof val === 'string' ||
          typeof val === 'number' ||
          typeof val === 'boolean') elem.setAttribute(attr, val)
      }
    elem.setAttribute('title',JSON.stringify(obj, null, 2))
  }
  render_elem(type='stringify'){
    let details = this.elem_details(type)
    //console.debug(details)
    let elem = document.createElement(details.type.toString())
    delete details.type

    if ('attributes' in details)
      for (let k in details.attributes){
        let v = details.attributes[k]
        elem.setAttribute(k,v)
      }
    delete details.attributes
    
    for (let k in details) // set innerText
      elem[k] = details[k]

    this.addDataAttributes(elem)
    return elem
  }
  generate_list(){
    let result = []
    for (let i of this.raw)
      result.push( this.gen_list_item(i) )
    return result
  }
  get_child_type(){
    return AbstractElem
  }
  gen_list_item(i){
    let child_type = this.get_child_type()
    let child = new child_type(i)
    return child.get_elem()
  }
  generate_dict(){
    let result = []
    for (let k in this.raw){
      let v = this.raw[k]
      let elem = this.gen_dict_item(k, v)
      result.push(elem)
    }
    return result
  }
  gen_dict_item(k,v){
    if (v && typeof v === 'object'){ // null is also an object
      let child = new Dict(k,v)
      return child.get_elem(v)
    }
    return this.render_elem(k)
  }
  get_elem(){
    if (typeof this.raw !== 'object')
      return this.render_elem('stringify')
    let cont = this.render_elem('container')
    let elems
    if (Array.isArray(this.raw)) elems = this.generate_list()
    else {
      if (this.raw && typeof this.raw === 'object') elems = this.generate_dict()
      else elems = [ this.render_elem('stringify') ]
    }
    for (let elem of elems)
      cont.appendChild(elem)

    return cont
  }
  elem_details(key){
    let elems = {
      stringify: {
        type: 'blockquote',
        attributes: {
          'class': 'stringify',
        },
        innerText: this.raw,
      },
      container: {
        type: 'div',
        attributes: this.default_attributes(key),
      },
      title: {
        type: 'span',
        innerText: this.get_val(key),
        attributes: this.default_attributes(key),
      },
      desc: {
        type: 'span',
        innerText: this.get_val(key),
        attributes: this.default_attributes(key),
      },
      img: {
        type: 'img',
        attributes: {
          'src': this.get_val(key),
        },
      },
    }
    if (key in elems) return elems[key]

    let val = this.get_val(key)
    if (typeof val === 'string')
      for (let ext of ['.yml', '.yaml', '.json'])
        if(val.endsWith(ext) && val.indexOf('/') !== -1){
          let b64 = window.btoa(val).split('=')[0]
          console.debug('Loading from URL ', val)
          YAML.load(val, (data) => {
            let target = document.querySelector('[data-src=' + b64 + ']')
            let res = {}
            res[key] = data
        		let loaded = this.generate_child(res)
        		target.replaceWith(loaded)
        	})
        	return {
        	  type: 'span',
        	  innerText: 'Loading from ' + val,
        	  attributes: {
        	    'data-src': b64,
        	  },
        	}
        }

    return {
      type: 'span',
      innerText: 'ERROR unknown key: ' + key,
    }
  }
  default_attributes(key){
    return {
      'class': this.get_class(key),
      'id': this.get_id(),
    }
  }
  default_value(key){
    let keys = {
      title: 'No_title_found',
      desc: 'No_description_found',
      img: 'https://placeimg.com/400/400/any'
    }
    if (key in keys) return keys[key]
    return "ERROR no default value found"
  }
  get_val(key){
    if (typeof this.raw !== 'object')
      return this.raw
    if (key in this.raw) return this.raw[key]
    return this.default_value(key)
  }
  fields(){ return [] }
  get_id(){ return '' }
  get_class(inp=''){ return inp }
  generate_child(obj){
    let child_type = this.get_child_type()
    let child = new child_type(obj)
    return child.get_elem()
  }
}

class Dict extends AbstractElem {
  constructor(key,val){
    super(val)
    this.key = key
  }
  elem_details(key){
    let elems = {
      container: {
        type: 'fieldset',
        attributes: {},
        innerHTML: '<legend>' + this.key + '</legend>'
      },
    }
    if (key in elems) return elems[key]
    return super.elem_details(key)
  }
}

export { AbstractElem }
