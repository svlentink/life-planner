/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class Nestedlist extends AbstractElem {
  get_class(){ return "nestedlist" }
  get_child_type(){
    return Nestedlist
  }
  get_elem(key){
    let elem = super.get_elem()
    if (typeof this.raw === 'object'){
      let firstchild = elem.children[0]
      if (firstchild.nodeName === 'LEGEND')
        firstchild.onclick = e => {
          let p = e.target.parentNode
          let c = p.style.backgroundColor
          if (c === 'green') p.style.backgroundColor = ''
          else p.style.backgroundColor = 'green'
        }
    }
    return elem
  }
}

// FIXME, there are two Foundation classes !!
class Foundation extends AbstractElem { //Nestedlist {
  container_classname() { return "foundation" }
  get_child_type() { return FoundationPillar }
}
class FoundationPillar extends AbstractElem {
  container_classname() { return "foundationpillar" }
  get_child_type(key){
    if (key === 'data') return PillarData
    return super.get_child_type(key)
  }
/*
  elem_details(key){
    if (key === 'data') return super.elem_details('container')
    return super.elem_details(key)
  }
  get_child_type() { return PillarData }
*/
}
class PillarData extends Nestedlist {
  container_classname() { return "pillardata" }
//  get_child_type() { console.log('get_child_type',arguments);return PillarItem }
  elem_details(key){
    if (key === 'container')
      return {
        type: 'ul',
        attributes: this.default_attributes(key),
      }
    return {
      type: 'li',
      attributes: this.default_attributes(key),
      innerHTML: '<span>' + key + '</span> <span>' + this.get_val(key) + '</span>',
    }
  }
}
/*
class PillarItem extends Nestedlist {
  container_classname() { return "pillaritem" }
  constructor(obj,key){
    this.order_of_children = () => {
      return Object.keys(obj)
    }
    console.log(obj,key)
    super.constructor(obj.key)
  }
}
*/

export { Nestedlist, Foundation }
