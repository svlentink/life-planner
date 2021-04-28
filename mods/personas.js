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


class PersonasView {
  container_classname(){ return 'personasview' }
  constructor(personas, foundation={}){
    this.personas = personas
    this.foundation = foundation
  }
  get_elem(){
    let p = new Personas(this.personas)
    let f = new Foundation(this.foundation)
    
    let cont = document.createElement('div')
    cont.setAttribute('class',this.container_classname())
    cont.appendChild(p.get_elem())
    cont.appendChild(f.get_elem())
    return cont
  }
}
class RolesView extends PersonasView {
  container_classname(){ return 'rolesview' }
  get_elem(){
    //https://codepen.io/dbpas/pen/LGudb
    let cont = super.get_elem(),
        roles = cont.children[0],
        radius = 'var(--radius-roles-overview)', //distance from center
        elements = roles.children,
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

    let outer = document.createElement('div')
    outer.setAttribute('class','container rolesoverview')
    outer.appendChild(cont)
    let foundation = cont.children[1]
    outer.appendChild(foundation)
    return outer
  }
}


class Foundation extends AbstractElem {
  container_classname(){ return "foundation" }
}

export { RolesView, PersonasView }