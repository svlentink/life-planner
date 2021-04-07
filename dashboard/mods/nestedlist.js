/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class Nestedlist extends AbstractElem {
  get_class(){ return "nestedlist" }
  get_child_type(){
    return Nestedlist
  }
}

export { Nestedlist }
