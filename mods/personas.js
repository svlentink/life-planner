/* @license GPLv3 */
import { AbstractElem, Hide } from './abstractelem.js'

class Persona extends AbstractElem {
  order_of_children(){
    return [ 'title', 'desc', 'emoji', 'goals' ]
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
/*
      status: {
        type: 'span',
        attributes: {
          style: 'display:none;'
        }
      },//*/
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
    return [ 'title', 'desc', 'emoji', 'status', 'intelligences' ]
  }
  container_classname(){ return 'goal' }
  get_child_type(key){
    return Hide
    if (key === 'intelligences') return Hide
    return super.get_child_type(key)
  }
  elem_details(key){
    if (key === 'intelligences')
      return {
        type: 'span',
        innerText: this.get_val(key) + "TEST FIXME",
        attributes: {
          style: 'display:none;',
          'class': key
        }
      }
    if (key === 'status'){
      let icons = {
        idea: 'idea &#128161;', // ideas are hidden since they are not final, thus are not shown
        progressing: '&#8635;', //&#10227; &#x2941;
        maintaining: '&#128736;', //&#128679;
        done: 'done', // also hidden, just like idea
      }
      let val = this.get_val(key) in icons ? icons[this.get_val(key)] : this.get_val(key)
      return {
        type: 'span',
        innerHTML: val,
        attributes: this.default_attributes(key),
      }
    }
    return super.elem_details(key)
  }
  default_value(key){
    if (key === 'status') return '&iquest;?'
    return super.default_value(key)
  }
}


class PersonasView {
  container_classname(){ return 'personasview' }
  constructor(personas){ //, foundation={}){
    this.personas = personas
//    this.foundation = foundation
  }
  get_elem(){
    let p = new Personas(this.personas)
//    let f = new Foundation(this.foundation)
    
    let cont = document.createElement('div')
    cont.setAttribute('class', this.container_classname())
    cont.appendChild(p.get_elem())
//    cont.appendChild(f.get_elem())
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
    let foundation = cont.children[1] || document.createElement('div')
    foundation.setAttribute('class','foundation')
    outer.appendChild(foundation)
    return outer
  }
}


class Foundation extends AbstractElem {
  container_classname(){ return "foundation" }
}

export { RolesView, PersonasView }
