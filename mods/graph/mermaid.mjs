/* @license GPLv3 */
import { AbstractElem } from '../core/abstractelem.mjs'
//import * as hack from 'https://cdn.lent.ink/js/npm/mermaid.js'
//const mermaid = window.npm['mermaid'].default
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'

class Mermaid extends AbstractElem {
  container_classname () {
    return 'mermaid'
  }
  elem_details (key) {
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
      attributes: this.default_attributes(key)
      //innerHTML: svg
    }
  }
}

export { Mermaid }
