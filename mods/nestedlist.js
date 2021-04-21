/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class Nestedlist extends AbstractElem {
  get_class(){ return "nestedlist" }
  get_child_type(){
    return Nestedlist
  }
}

class Foundation extends Nestedlist {
  get_class() { return "foundation" }
}

export { Nestedlist, Foundation }
