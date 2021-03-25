/* @license GPLv3 */
import YAML from 'yamljs'

function loadURL(url, callback=console.log){
	YAML.load(url, (data) => {
		callback(data)
	})
}

function getRandomId(){
	// ids cannot start with a number
	return 'id' + Math.random().toString(36).split('.')[1]
}

/**
 * Only adds stylesheet if it hasn't been added already
 */
function loadStylesheet(url){
	console.warn('unimplemented',url)
}

const types = {
	error: (err,obj) => {
		let msg = err
		if (obj)
			msg += JSON.stringify(obj)
		let elem = document.createElement('span')
		elem.innerText = msg
		return elem
	},
	/** create scoped css */
	css: c => {
		let cont = document.createElement('div')
		cont.class = 'stylecontainer'

		let link = document.createElement('link')
		link.rel = 'stylesheet'
		link.type = 'text/css'
		link.href = c.val
		cont.append(link)
		return cont
		document.getElementsByTagName('HEAD')[0].appendChild(link)

		let id = getRandomId()
		
		cont.id = id
		
		let elem = document.createElement('style')
		elem.innerHTML = '#' + id + ' { @import ' + c.val + '; }'
		cont.appendChild(elem)
		return cont
	},
	page: c => {
		let elem = document.createElement('section')
		return elem
	},
	title: c => {
		let size = c.headersize
		if (size > 7) size = 7
		let elem = document.createElement('h' + size)
		elem.innerText = c.val
		return elem
	},
	desc: c => {
		let elem = document.createElement('span')
		elem.innerText = c.val
		return elem
	},
	unknown: c => {
		let t, msg
		if ('val' in c && typeof c.val === 'string')
			t = c.val
		else {
			t = 'span'
			msg = "ERROR unknown type has no 'val' with type string"
		}
		let elem = document.createElement(t)
		if (msg) elem.innerText = msg
		return elem
	},
	tabs: c => {
		// FIXME use only CSS?
		// https://medium.com/allenhwkim/how-to-build-tabs-only-with-css-844718d7de2f
		// https://css-tricks.com/functional-css-tabs-revisited/
		let cont = document.createElement('div')
		let nav = document.createElement('nav')
		if (! 'val' in c || typeof c.val !== 'object') {
			cont.innerText = 'ERROR tabs should hold an object in its val'
			return cont
		}
		cont.appendChild(nav)
		loadStylesheet('tabs.css')
		
		for (let k in c.val){
			let v = c.val[k]
			let btn = document.createElement('button')
			btn.innerText = k
			let id = getRandomId()
			btn.setAttribute('data-id',id)
			btn.onclick = () => {
				cont.childNodes.forEach(p => {
					if(p.className === 'page')
						p.style.display = 'none'
				})
				document.querySelector('#'+id).style.display = 'block'
				btn.parentNode.childNodes.forEach(b => {
					b.removeAttribute("data-activetab")
				})
				btn.setAttribute("data-activetab",'')
			}
			nav.appendChild(btn)
			let page = { type: 'page', val: id, items: v }
			render(cont, page, c.headersize+1)
		}
		return cont
	},
	page: c => {
		let cont = document.createElement('div')
		cont.className = 'page'
		cont.id = c.val
		return cont
	}
}

function render(output_container, content, headersize=1){
	let out, res
	if (typeof content === 'string'){
		if (content.substr(0,4).toLowerCase() === 'http')
			return loadURL(content, data => { render(output_container, data, headersize) })
		else
			res = types.error('An URL was expected, pointing to YAML (or JSON)')
	}

	if (typeof(output_container) === 'string'){
		out = document.querySelector(output_container)
		if (!out) return console.error('DOM element not found')
	} else out = output_container

	if(!res){
		if (! 'type' in content) res = types.error('Type missing',content)
		else {
			if (content.type in types){
				content.headersize = headersize
				res = types[content.type](content)
				if (res) {
					if ('items' in content)
						for (let i of content.items)
							render(res,i, content.type === 'page' ? headersize+1 : headersize)
				} 
				else res = types.error('Missing element',content)
			} else res = types.unknown(content)
		}
	}
	if(res) out.appendChild(res)
	else console.error('unexpected',content)
}

export { render }

