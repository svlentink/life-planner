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
class Foundation extends Nestedlist {
  get_class() { return "foundation" }
}

export { Nestedlist, Foundation }
