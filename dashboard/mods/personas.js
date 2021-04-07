/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class Persona extends AbstractElem {
  order_of_children(){
    return [ 'title', 'desc', 'img', 'goals' ]
  }
  get_child_type(key){
    if (key === 'goals') return Goals
    return super.get_child_type(key)
  }
  //get_class(){ return 'persona-info' }
  container_classname(){ return "persona" }
  elem_details(key){
    let elems = {
      goals: {
        type: 'div',
        attributes: {
          'class': key
        }
      },
      status: {
        type: 'span',
        attributes: {
          style: 'display:none;'
        }
      },
    }
    if (key in elems) return elems[key]
    return super.elem_details(key)
  }
}

class Personas extends AbstractElem {
  container_classname(){ return "personas" }
  get_child_type(){ return Persona }
}

class Goals extends AbstractElem {
  container_classname(){ return 'goals' }
  get_child_type(){ return Goal }
  elem_details(key){
    return super.elem_details('container')
  }
}
class Goal extends AbstractElem {
  order_of_children(){
    return [ 'title', 'desc', 'img' ]
  }
  container_classname(){ return 'goal' }
}

class Roles extends Personas {
  get_elem(){
    //https://codepen.io/dbpas/pen/LGudb
    let main = super.get_elem(),
        radius = 'var(--radius-roles-overview)', //distance from center
        elements = main.children,
        slice = 180 / elements.length,
        start = -180 + slice/2;

    for (let i=0;i<elements.length;i++){
        let elem = elements[i]
        let rotate = slice * i + start,
            rotateReverse = rotate * -1,
            transform = 'rotate(' + 
              rotate + 'deg) translate(' + 
              radius + ') rotate(' + 
              rotateReverse + 'deg)';

      elem.style.transform = transform
    }
    return main
  }
}

export { Roles, Personas }
