/* @license GPLv3 */
import { AbstractElem } from './abstractelem.mjs'

class ListItem extends AbstractElem {
  container_classname(){ return 'listitem' }
  elem_details(key){
    if (key === 'container')
      return {
        type: 'ul',
        attributes: this.default_attributes(key),
      }
    if (key === 'stringify') return {
      type: 'li',
      innerText: this.raw,
    }
    return {
      type: 'li',
      attributes: this.default_attributes(key),
      children: [{
        type: 'span',
        innerText: key
      },{
        type: 'span',
        innerText: this.get_val(key)
      }]
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
