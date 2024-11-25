
import { LoadElem, substitute_baseURLs } from './abstractelem.js'

import * as markedhack from 'https://cdn.lent.ink/js/npm/marked.js'
const { parse } = window.npm['marked']
const DOMPurify = window.npm['dompurify'].default

class Markdown extends LoadElem {
    container_classname(){ return 'markdown' }
    parse_markdown(data){
        let parsed = 'ERROR failed parsing markdown.' + data
        try {
            parsed = parse(data)
        } catch (e) {
            parsed += e
        }
        return parsed
    }
    set_data(inp){
        this.raw = inp
        this.container.innerHTML = DOMPurify.sanitize(this.parse_markdown(inp))
    }
    constructor(inp){
        super({})

        this.container = this.render_elem('div')
        
        if (inp.endsWith('.md')){
            this.url = substitute_baseURLs(inp)
            this.loadURL(this.url, (data) => {
                this.set_data(data)
            })
        }
        else {
            this.set_data(inp)
        }
    }

    get_elem(){
        return this.container
    }
}

export { Markdown }
