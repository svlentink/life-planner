
import * as hack from 'https://cdn.lent.ink/js/npm/yamljs.js'
const YAML = window.npm['yamljs'].default


//matches './src.yml' or 'https://example.com/src.yaml'
function is_yaml_url(str){
  if (typeof str === 'string' &&
      str.indexOf(' ') === -1)
    for (let ext of ['.yml', '.yaml', '.json'])
      if(str.endsWith(ext)) return true
  return false
}

function load_elem_from_URL(url){
  if (window.YAMLbaseURLs && url[0] === '$')
    for (let k in window.YAMLbaseURLs)
      if (url.startsWith('$'+k))
        url = url.replace('$'+k, window.YAMLbaseURLs[k])
  if (url[0] === '$') console.warn('Probably an URL with a baseurl that has no match',url)
	//console.debug('Loading from',url)
	let data = YAML.load(url)
  let msg = 'Failed loading '+url
	data = data || { type: 'blockquote', data: msg, innerText: msg  }
	return data
}

class ElemLogic {
  constructor(obj,key=undefined){
    if (! obj) return console.error('ERROR nothing provided ', obj)
    this.key = key
    if (is_yaml_url(obj))
      this.raw = load_elem_from_URL(obj)
    else
      this.raw = obj
  }
  load_object(){
    
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
//FIXME
//    elem.setAttribute('title',JSON.stringify(obj, null, 2))
  }
  render_elem(type='stringify'){
    let details = this.elem_details(type)
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
  generate_from_list(){
    let result = []
    for (let i of this.raw)
      result.push( this.gen_list_item(i) )
    return result
  }
  gen_list_item(i){
    return this.generate_child(i)
  }
  generate_from_dict(){
    let result = []
    let order = this.order_of_children()
    let already = []
    let objkeys = Object.keys(this.raw)
    
    let keys = objkeys
    if (order.length) keys = order
    for (let k of keys){
      if (! k in this.raw) continue
      let elem = this.gen_dict_item(k, this.raw[k])
      result.push( elem )
      already.push(k)
    }
    if (order.length === 0) return result

    let unknowns = {}
    for (let k of objkeys){
      if (already.includes(k)) continue
      //let elem = this.gen_dict_item(k, this.raw[k])
      unknowns[k] = this.raw[k]
    }
    if (Object.keys(unknowns).length){
      let unknown_container = this.generate_child(unknowns,'unknown_children')
      result.push(unknown_container)
    }
    return result
  }
  gen_dict_item(k,v){
    if (v && typeof v === 'object') // null is also an object
      return this.generate_child(v,k)
    if (is_yaml_url(v)){
      let loaded = load_elem_from_URL(v)
      return this.generate_child(loaded,k)
    }
    return this.render_elem(k)
  }
  get_elem(){
    if (typeof this.raw !== 'object')
      return this.render_elem('stringify')
    let cont = this.render_elem('container')
    let elems
    if (Array.isArray(this.raw)) elems = this.generate_from_list()
    else {
      if (this.raw) elems = this.generate_from_dict()
      else elems = [ this.render_elem('stringify') ]
    }
    for (let elem of elems)
      cont.appendChild(elem)

    return cont
  }
  get_val(key){
    if (typeof this.raw !== 'object')
      return this.raw
    if (key in this.raw) return this.raw[key]
    return this.default_value(key)
  }
  generate_child(obj, key=''){
    let child_type = this.get_child_type(key)
    let child = new child_type(obj,key)
    return child.get_elem()
  }
  elem_details(key){
//    let val = this.get_val(key)
//    if (is_yaml_url(val))
//      return load_elem_from_URL(val)
/*
    if (is_yaml_url(val)){
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
*/
    return {
      type: 'span',
      innerText: 'ERROR unknown key: ' + key,
      attributes: {
        'data-err': 'unknown key',
        'data-key': key,
        'class': 'error',
      }
    }
  }
}

class AbstractElem extends ElemLogic {
  get_child_type(key=''){
    return AbstractElem
  }
  elem_details(key){
    let elems = {
      unknown_children: {
        type: 'div',
        attributes: {
          class: 'unknownchildren',
          'data-warn': 'unknown children in dict'
        }
      },
      stringify: {
        type: 'blockquote',
        attributes: {
          'class': 'stringify',
        },
        innerText: this.raw,
      },
      container: {
        type: 'div',
        attributes: {'class': key + ' ' + this.container_classname(key)},
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
    if (this.key)
      elems.container = {
        type: 'fieldset',
        attributes: {'class': this.key + ' ' + this.container_classname(key)},
        innerHTML: '<legend>' + this.key + '</legend>'
      }
    if (key in elems) return elems[key]
    return super.elem_details(key)
  }
  default_attributes(key){
    return {
      'class': key || this.container_classname(),
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
  order_of_children(){ return [] }
  container_classname(inp=''){ return inp }
}

export { AbstractElem, load_elem_from_URL, is_yaml_url }
