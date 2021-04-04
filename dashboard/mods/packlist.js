/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class Packlist extends AbstractElem {
  //get_class(){ return 'persona-info' }
  get_class(){ return "packlist" }
  elem_details(key){
    if (key === 'meta') key = 'desc'
    let elems = {
      container: {
        type: 'fieldset',
        attributes: this.default_attributes(key),
        innerHTML: '<legend>' + this.raw + '</legend>'
      },
    }
    //if (key in elems) return elems[key]
    return super.elem_details(key)
  }
  get_child_type(){
    return Packlist
  }
}


export { Packlist }
