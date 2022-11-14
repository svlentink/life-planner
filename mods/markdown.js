
import { LoadElem, substitute_baseURLs } from './abstractelem.js'

import * as markedhack from 'https://cdn.lent.ink/js/npm/marked.js'
const { parse } = window.npm['marked']


class Markdown extends LoadElem {
    container_classname(){ return 'markdown' }
    parse_markdown(){
        let data = this.raw
        if ( (! data.includes("<script") && ! data.includes("<iframe") ) ||
            window.localStorage.getItem(window.dataurl) ||
            confirm('This page wants to load markdown which might run JS, okay?'))
            window.localStorage.setItem(window.dataurl, 'allow_markdown_loading')
        else
            return 'Loading Markdown not permitted'

        let parsed = 'ERROR failed parsing markdown.' + data
        try {
            parsed = /*marked.*/parse(data)
        } catch (e) {
            parsed += e
        }
        return parsed
    }
    constructor(inp){
        super({})

        this.container = this.render_elem('div')
        
        if (inp.endsWith('.md')){
            this.url = inp
            this.url = substitute_baseURLs(url)
            this.loadURL(this.url, (data) => {
                this.raw = data
                this.container.innerHTML = this.parse_markdown()
            })
        }
        else {
          this.raw = inp
          this.container.innerHTML = this.parse_markdown()
        }
    }

    get_elem(){
        return this.container
    }
}

export { Markdown }
