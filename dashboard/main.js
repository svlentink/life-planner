/* @license GPLv3 */
import { renderlists } from './mods/renderlists.js'
import { TimeManagementMatrices } from './mods/tmm.js'
import { load_elem_from_URL, is_yaml_url } from './mods/abstractelem.js'
import { Nestedlist } from './mods/nestedlist.js'
import { RolesView, PersonasView } from './mods/personas.js'
import { Routines } from './mods/routines.js'
import { renderCalendar } from './mods/calendar.js'
import { RouteDesc } from './mods/route.js'

import * as yamlhack from 'https://cdn.lent.ink/js/npm/yamljs.js'
const YAML = window.npm['yamljs'].default

//import * as icalhack from 'https://cdn.lent.ink/js/npm/ical.js.js'

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
	route: (obj) => {
		let elem = new RouteDesc(obj.data)
		return elem.get_elem()
	},
	calendar: (obj) => {
		let routines = new Routines(obj.data)
		let events = routines.get_events()
		let cont = document.createElement('div')
		renderCalendar(events, cont, console.log)
		return cont
	},
	timemangementmatrices: (obj) => {
		let elem = new TimeManagementMatrices(obj.data)
		return elem.get_elem()
	},
	personas: (obj) => {
		let elem = new PersonasView(obj.data)
		return elem.get_elem()
	},
	roles: (obj) => {
		let elem = new RolesView(obj.data)
		return elem.get_elem()
	},
	routines: (obj) => {
		let elem = new Routines(obj.data)
		return elem.get_elem()
	},
	nestedlist: (obj) => {
		let elem = new Nestedlist(obj.data)
		return elem.get_elem()
	},
	timemangementmatrix: (obj) => {
		let elem = new Nestedlist(obj.data)
		return elem.get_elem()
	},
	blockquote: (c) => {
		let elem = document.createElement('blockquote')
		elem.innerText = c.data
		return elem
	},
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
		link.href = c.data
		cont.append(link)
		return cont
		document.getElementsByTagName('HEAD')[0].appendChild(link)

		let id = getRandomId()
		
		cont.id = id
		
		let elem = document.createElement('style')
		elem.innerHTML = '#' + id + ' { @import ' + c.data + '; }'
		cont.appendChild(elem)
		return cont
	},
	title: c => {
		let size = c.headersize || 1
		if (size > 7) size = 7
		let elem = document.createElement('h' + size)
		elem.innerText = c.data
		return elem
	},
	desc: c => {
		let elem = document.createElement('span')
		elem.innerText = c.data
		return elem
	},
	unknown: c => {
		let t, msg
		if ('data' in c && typeof c.data === 'string')
			t = c.data
		else {
			t = 'span'
			msg = "ERROR unknown type has no 'data' with type string"
		}
		let elem = document.createElement('span')
		try {
			elem = document.createElement(t)
			if (msg) elem.innerText = msg
		} catch (e) {
			elem.innerText = e
		}
		return elem
	},
	tabs: c => {
		// FIXME use only CSS?
		// https://medium.com/allenhwkim/how-to-build-tabs-only-with-css-844718d7de2f
		// https://css-tricks.com/functional-css-tabs-revisited/
		let cont = document.createElement('div')
		let nav = document.createElement('nav')
		if (! 'data' in c || typeof c.data !== 'object') {
			cont.innerText = 'ERROR tabs should hold an object in its field named data'
			return cont
		}
		cont.appendChild(nav)
		loadStylesheet('tabs.css')
		
		for (let k in c.data){
			let v = c.data[k]
			let btn = document.createElement('button')
			btn.innerText = k
			let id = getRandomId()
			btn.setAttribute('data-id',id)
			btn.onclick = () => {
				cont.childNodes.forEach(p => {
					if(p.className.indexOf('tabcontent') !== -1)
						p.style.display = 'none'
				})
				document.querySelector('#'+id).style.display = 'block'
				btn.parentNode.childNodes.forEach(b => {
					b.removeAttribute("data-activetab")
				})
				btn.setAttribute("data-activetab",'')
			}
			nav.appendChild(btn)
			let data
			if(Array.isArray(v))
				data = { type: 'page', data: id, items: v }
			else
				data = { type: 'desc', data: 'ERROR tab pages should contain a list, not type ' + typeof v }
			
			render(cont, data, c.headersize+1)
		}
		return cont
	},
	page: c => {
		let cont = document.createElement('section')
		cont.className = 'page tabcontent'
		cont.id = c.data
		return cont
	}
}

function render(output_container, content, headersize=1){
	let out, res
	if (typeof content === 'string'){
		if (is_yaml_url(content)){
			let data = load_elem_from_URL(content)
			return render(output_container, data, headersize)
		}
		else
			res = types.error('An URL was expected, starting with http and pointing to YAML (or JSON)')
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

