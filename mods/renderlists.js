/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class ListItem extends AbstractElem {
  container_classname(){ return 'listitem' }
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

class List extends AbstractElem {
  container_classname(){ return 'list' }
  get_child_type(){
    return ListItem
  }
}

class Lists extends AbstractElem {
  container_classname(){ return 'lists' }
  get_child_type(){
    return List
  }
}

export { Lists, ListItem }
