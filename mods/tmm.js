/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class TmmRow extends AbstractElem {
  get_child_type() { return TmmBucket }
  elem_details(key){
    if (key === 'container') return {
      type: 'tr',
    }
    return super.elem_details(key)
  }
}
class TmmBucket extends TmmRow {
  elem_details(key){
    if (key === 'container') return {
      type: 'td',
    }
    if (key === 'stringify') return {
      type: 'li',
      innerText: this.raw,
    }
    return super.elem_details(key)
  }
}
class TimeManagementMatrix extends AbstractElem {
  container_classname(){ return 'timemanagementmatrix' }
  get_child_type(){ return TmmRow }
  constructor(inp,key){
    let important = inp.important || {}
    let unimportant = inp.unimportant || {}
    let res = [
      [
        important.urgent || [],
        important['non-urgent'] || [],
      ],
      [
        unimportant.urgent || [],
        unimportant['non-urgent'] || [],
      ]
    ]
    super(res,key)
  }
  elem_details(key){
    if (key === 'container') return {
      type: 'table',
      attributes: { 'class': this.container_classname() },
    }
    return super.elem_details(key)
  }
}
class TimeManagementMatrixBox extends AbstractElem {
  container_classname() { return 'tmmbox' }
  get_child_type(){ return TimeManagementMatrix }
  generate_from_dict(){
    let child = this.generate_child(this.raw)
    return [ child ]
  }
  elem_details(key){
    if (key === 'container' && this.key)
      return {
        type: 'article',
        attributes: {'class': this.key + ' ' + this.container_classname(key)},
        innerHTML: '<h3>' + this.key + '</h3>'
      }
    return super.elem_details(key)
  }
}
class TimeManagementMatrices extends AbstractElem {
  container_classname(){ return 'timemanagementmatrices' }
  get_child_type(){ return TimeManagementMatrixBox }
}

export { TimeManagementMatrices }
