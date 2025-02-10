/* @license GPLv3 */
import { LoadElem } from './abstractelem.mjs'

// FIXME verify that this is scoped css
class Css extends LoadElem {
  container_classname(){ return 'css' }
  constructor(path){
    super({})
    this.path = path
    this.elem = this.render_elem('style')
    this.loadURL(path, (data, substituted_url) => {
      this.raw = data
      this.path = substituted_url
      this.elem.setAttribute('href', substituted_url)
      this.elem.innerText = data
    })
  }
  get_elem(){
    return this.elem
  }
  elem_details(key){
    return {
        type: key, /* both 'link' and 'style' work, but style is used so we can insert it from cache, with link it will still fetch the remote source */
        attributes: {
          type: 'text/css',
          rel: 'stylesheet',
        },
      }
  }
}

export { Css }
