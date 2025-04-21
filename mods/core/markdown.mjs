
import { LoadElem } from './abstractelem.mjs'

//In the following block you can switch the imports by removing '\ //WEBPACK'
 //WEBPACK/*
import * as markedhack from 'https://cdn.lent.ink/js/npm/marked.js'
const { parse } = window.npm['marked']
const { sanitize } = window.npm['dompurify'].default
/*
* //WEBPACK/
import { parse } from 'marked'
import createDOMPurify from 'dompurify'
const DOMPurify = createDOMPurify(window)
const sanitize = DOMPurify.sanitize
//*/

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
        this.container.innerHTML = sanitize(this.parse_markdown(inp),{
            // https://github.com/umap-project/umap/issues/1140
            ALLOWED_URI_REGEXP:
            /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|geo):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        })
    }
    constructor(inp){
        super({})

        this.container = this.render_elem('div')
        
        if (inp.endsWith('.md')){
            this.loadURL(inp, (data, substituted_url) => {
                this.url = substituted_url
                this.set_data(data)
                this.set_raw(this.container)
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
