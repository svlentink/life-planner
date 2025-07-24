/* @license GPLv3 */
import { LoadElem } from '../core/abstractelem.mjs'
//import * as hack from 'https://cdn.lent.ink/js/npm/mermaid.js'
//const mermaid = window.npm['mermaid'].default
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'

class Mermaid extends LoadElem {
  container_classname () {
    return 'mermaid'
  }
  elem_details (key) {
    if (key != 'mermaid') return super.elem_details('container')

    // https://mermaid.js.org/config/schema-docs/config.html#mermaid-config-properties
    // https://github.com/mermaid-js/mermaid/blob/a566353030e8b5aa6379b2989aa19663d5f37bc3/packages/mermaid/src/mermaid.ts#L392
    mermaid
      .render('non_existing_elem_id', this.raw)
      .then(res => {
        this.svg = res.svg
        this.elem.innerHTML = this.svg
        if (res.bindFunctions) res.bindFunctions(this.elem)
      })
      .catch(rej => console.error('mermaid.render', rej))

    return {
      type: 'pre',
      attributes: this.default_attributes()
      //innerHTML: svg
    }
  }
  constructor (inp) {
    super({})

    this.container = this.render_elem('container')

    if (inp.endsWith('.mmd') || inp.endsWith('.mermaid')) {
      this.loadURL(inp, (data, substituted_url) => {
        this.url = substituted_url
        this.raw = data
        this.container.appendChild(this.render_elem('mermaid'))
      })
    } else {
      this.raw = inp
      this.container.textContent = inp
    }
  }

  get_elem () {
    return this.container
  }
}

export { Mermaid }
