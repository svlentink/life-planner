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
  get_child_type() { return PillarItem }
  /*
  elem_details(key){
    return {
      type: 'div',
      //innerText: this.get_val(key) + "TEST FIXME",
      attributes: {
        'class': 'pdata'
      }
    }
  }//*/
}
class PillarItem extends Nestedlist {
  container_classname() { return "pillaritem" }
}

export { Nestedlist, Foundation }
