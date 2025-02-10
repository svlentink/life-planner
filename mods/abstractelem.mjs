
//In the following block you can switch the imports by removing '\ //WEBPACK'
 //WEBPACK/*
import * as hack from 'https://cdn.lent.ink/js/npm/yamljs.js'
const YAML = window.npm['yamljs'].default
import { saveToFile } from 'https://cdn.lent.ink/js/mod/storage.js'
/*
* //WEBPACK/
import * as name from "yamljs";
import { saveToFile } from './storage.mjs'
//*/


/*
import * as hack2 from 'https://cdn.lent.ink/js/npm/exif.js'
import * as hack3 from 'https://cdn.lent.ink/js/npm/exifreader.js'
import * as hack4 from 'https://cdn.lent.ink/js/npm/exif-js.js'
const ExifImage = window.npm['exif'].default
//new ExifImage({image: 'https://cdn.lent.ink/img/face.jpg'},console.log)
*/

//matches './src.yml' or 'https://example.com/src.yaml'


function substitute_baseURLs(url){
  if (url[0] !== '$')
    return url

  if (window.YAMLbaseURLs)
    for (let k in window.YAMLbaseURLs)
      if (url.startsWith('$'+k)){
        let result = url.replace('$'+k, window.YAMLbaseURLs[k])
        return substitute_baseURLs(result)
      }

  console.warn('Probably an URL with a baseurl that has no match',url,window.YAMLbaseURLs)
  return url
}


class ElemLogic {
  retrieve_stored_URL(url){
    if (url in window.loaded_URLs)
      return window.loaded_URLs[url]
    return undefined
  }
  store_retrieved_URL(url, data){
    window.loaded_URLs[url] = data
  }
  #is_yaml_url(str){
    if (typeof str !== 'string' ||
        str.indexOf(' ') !== -1)
      return false
    let url = substitute_baseURLs(str)
    for (let ext of ['.yml', '.yaml', '.json'])
      if(url.toLocaleLowerCase().endsWith(ext)) return true
    return false
  }
  #load_elem_from_URL(inp){
    if (!this.#is_yaml_url(inp)) return inp
    let url = substitute_baseURLs(inp)

    let retrieved = this.retrieve_stored_URL(url)
    if (retrieved) return retrieved

    let data = YAML.load(url)
    let msg = 'Failed loading '+url
    data = data || { type: 'blockquote', data: msg, innerText: msg }
    this.store_retrieved_URL(url, data)
    return data
  }
  load_obj(inp, unite_if_array=false){
    // We allow a list of sources
    if (Array.isArray(inp) && unite_if_array/*inp.length && this.#is_yaml_url(inp[0])*/){
      let result = 0
      for (let i of inp){
        let obj = this.load_obj(i, false)
        if (!result){
          result = obj
          continue
        }
        if (Array.isArray(result))
          result = result.concat(obj)
        else if (typeof result === 'object')
          Object.assign(result, obj)
        else
          result += obj
      }
      return result
    }
    // this is for an individual data source
    return this.#load_elem_from_URL(inp)
  }
  constructor(obj,key=undefined){
    if (! obj) return console.error('ERROR nothing provided ', obj)
    this.key = key
    this.raw = this.load_obj(obj)
  }
  // everything that is a string will be added as data attribute
  #addDataAttributes(elem) {
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
  render_elem(type='stringify', details=null){
    details = details || this.elem_details(type)
    let elem = document.createElement(details.type.toString())
    delete details.type

    if ('innerHTML' in details){
      console.debug("Security prevents using innerHTML",details)
      delete details.innerHTML
    }

    if ('attributes' in details)
      for (let k in details.attributes){
        if (k.toLowerCase().substring(0,2) == "on"){
          console.debug("attribute starting with 'on' can be a security risk",k)
          continue
        }
        let v = details.attributes[k]
        elem.setAttribute(k,v)
      }
    delete details.attributes

    if ('children' in details){
      for (let c of details.children)
        elem.appendChild(this.render_elem(null,c))
      delete details.children
    }
    
    for (let k in details) // set innerText
      elem[k] = details[k]

    this.#addDataAttributes(elem)
    return elem
  }
  #generate_from_list(){
    let result = []
    for (let i of this.raw)
      result.push( this.#gen_list_item(i) )
    return result
  }
  #gen_list_item(i){
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
      let elem = this.#gen_dict_item(k, this.raw[k])
      result.push( elem )
      already.push(k)
    }
    if (order.length === 0) return result

    let unknowns = {}
    for (let k of objkeys){
      if (already.includes(k)) continue
      //let elem = this.#gen_dict_item(k, this.raw[k])
      unknowns[k] = this.raw[k]
    }
    if (Object.keys(unknowns).length){
      let unknown_container = this.generate_child(unknowns,'unknown_children')
      result.push(unknown_container)
    }
    return result
  }
  #gen_dict_item(k,v){
    if (v && typeof v === 'object') // null is also an object
      return this.generate_child(v,k)
    if (this.#is_yaml_url(v)){
      let loaded = this.#load_elem_from_URL(v)
      return this.generate_child(loaded,k)
    }
    return this.render_elem(k)
  }
  set_raw(elem){
    elem.dataset.raw = JSON.stringify(this.raw)
  }
  get_elem(){
    if (typeof this.raw !== 'object')
      return this.render_elem('stringify')
    let cont = this.render_elem('container')
    let elems
    if (Array.isArray(this.raw)) elems = this.#generate_from_list()
    else {
      if (this.raw) elems = this.generate_from_dict()
      else elems = [ this.render_elem('stringify') ]
    }
    for (let elem of elems)
      cont.appendChild(elem)

    this.set_raw(cont)
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
//    if (this.#is_yaml_url(val))
//      return this.#load_elem_from_URL(val)
/*
    if (this.#is_yaml_url(val)){
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
      emoji: {
        type: 'span',
        innerText: this.get_val(key),
        attributes: this.default_attributes(key),
      },
    }

    if (this.key)
      elems.container = {
        type: 'fieldset',
        attributes: {'class': this.key + ' ' + this.container_classname(key)},
        children: [{
          type: 'legend',
          innerText: this.key,
        }]
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
      img: 'https://placeimg.com/400/400/any',
      emoji: '&#10068;',
    }
    if (key in keys) return keys[key]
    return "ERROR no default value found"
  }
  order_of_children(){ return [] }
  container_classname(inp=''){ return inp }
}

// The following serves as an example
class Hide extends AbstractElem {
  elem_details(key){
    return {
        type: 'span',
        innerText: this.get_val(key),
        attributes: {
          style: "display:none;",
          "data-key": key,
          "data-this-key": this.key,
          "data-this-raw": this.raw,
          'class': 'Hide',
          "data-value": this.get_val(key),
        },
      }
  }
}


class FlattenedElem extends AbstractElem {
  container_classname(){return 'flattened'}
  store_retrieved_URLs(obj){
    for (const [key, val] of Object.entries(obj))
      this.store_retrieved_URL(key, val)
  }
  constructor(flattened){
    super({})
    if (! flattened) return console.error('ERROR nothing provided ', flattened)
    this.key = flattened.url
    this.raw = flattened.data
    this.store_retrieved_URLs(flattened.data)
  }
  static flatten(){
    if(document.readyState !== 'complete')
      return window.alert("Please wait until the page is fully loaded and try again")
    const data = {
      url: window.dataURL,
      data: window.loaded_URLs,
    }
    let flatten_elem = [{
      type: 'flattened',
      data: data,
    }]
    saveToFile(JSON.stringify(flatten_elem),'flattened.yml')
  }
}
if (! ('loaded_URLs' in window))
  window.loaded_URLs = {} /* don't set directly, use FlattenedElem */
window.flatten = FlattenedElem.flatten


class LoadElem extends AbstractElem {
  loadURL(url,cb) {
    url = substitute_baseURLs(url)

    let retrieved = this.retrieve_stored_URL(url)
    if (retrieved) return cb(retrieved, url)

    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let data = xhr.responseText
        this.store_retrieved_URL(url, data)
        cb(data, url)
      }
    }
    xhr.open("GET", url, true)
    xhr.send()
  }
}


export { ElemLogic, AbstractElem, LoadElem, Hide, substitute_baseURLs, FlattenedElem }
