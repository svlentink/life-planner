/* @license GPLv3 */
import { Lists } from './mods/renderlists.js'
import { TimeManagementMatrices } from './mods/tmm.js'
import { load_elem_from_URL, is_yaml_url } from './mods/abstractelem.js'
import { Nestedlist, Foundation } from './mods/nestedlist.js'
import { RolesView, PersonasView } from './mods/personas.js'
import { Routines } from './mods/routines.js'
import { PlannedActivities } from './mods/plannedacts.js'
import { renderCalendar } from './mods/calendar.js'
import { RouteDesc } from './mods/route.js'
import { CsvGraph } from './mods/csv.js'
import { Markdown } from './mods/markdown.js'

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
	baseurl: c => {
		let elem = document.createElement('span')
		if (typeof c.data !== 'string'){
			elem.innerText = 'ERROR baseurl should contain type string in its data field'
			return elem
		}
		let arr = c.data.split('=')
		if (arr.length !== 2){
			elem.innerText = 'ERROR baseurl should be SOMEID=https://raw.githubusercontent.com/foo/bar'
			return elem
		}
		if (! window.YAMLbaseURLs) window.YAMLbaseURLs = {}
		let id = arr[0]
		let val = arr[1]
		window.YAMLbaseURLs[id] = val
		
		elem.style.display = 'none'
		elem.setAttribute('class','baseurlloaded')
		elem.innerText = 'At this point in the document the baseurl was loaded ' + c.data
		return elem
	},
	route: obj => {
		let elem = new RouteDesc(obj.data)
		return elem.get_elem()
	},
	calendar: obj => {
		// FIXME this should actually be handed an .ical file not a routines file!
		let routines = new Routines(obj.data)
		let events = routines.get_events()
		let cont = document.createElement('div')
		let callback = x=>{alert(x.summary + '\n' + x.description)}
		renderCalendar(events, cont, callback)
		return cont
	},
	csv: obj => {
		let elem = new CsvGraph(obj.data)
		return elem.get_elem()
	},
	timemangementmatrices: obj => {
		let elem = new TimeManagementMatrices(obj.data)
		return elem.get_elem()
	},
	personas: obj => {
		let elem = new PersonasView(obj.data)
		return elem.get_elem()
	},
	roles: obj => {
		let elem = new RolesView(obj.data)
		return elem.get_elem()
	},
	routines: obj => {
		let elem = new Routines(obj.data)
		return elem.get_elem()
	},
	plannedactivities: obj => {
		let elem = new PlannedActivities(obj.data)
		return elem.get_elem()
	},
	lists: obj => {
		let elem = new Lists(obj.data)
		return elem.get_elem()
	},
	nestedlist: obj => {
		let elem = new Nestedlist(obj.data)
		return elem.get_elem()
	},
	foundation: obj => {
		let elem = new Foundation(obj.data)
		return elem.get_elem()
	},
	timemangementmatrix: obj => {
		let elem = new Nestedlist(obj.data)
		return elem.get_elem()
	},
	blockquote: c => {
		let elem = document.createElement('blockquote')
		elem.innerText = c.data
		return elem
	},
	error: (err,obj) => {
		let msg = err
		if (obj)
			msg += JSON.stringify(obj)
		let elem = document.createElement('span')
		elem.innerText = 'ERROR ' + msg
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
	markdown: c => {
		let elem = new Markdown(c.data)
		return elem.get_elem()
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
				data = { type: 'page', id: id, data: v }
			else
				data = { type: 'desc', data: 'ERROR tab pages should contain a list, not type ' + typeof v }
			
			render(cont, data, c.headersize+1)
		}
		return cont
	},
	page: c => {
		let cont = document.createElement('section')
		cont.className = 'page tabcontent'
		cont.id = c.id
		render(cont, c.data, c.headersize)
		return cont
	}
}

function render(output_container, content, headersize=1){
	let res
	if (typeof content === 'string'){
		if (is_yaml_url(content)){
			try {
				let data = load_elem_from_URL(content)
				return render(output_container, data, headersize)
			} catch (e) {
				res = types.error('loading ' +content,e)
			}
		}
		else
			res = types.error('an URL was expected, starting with http and pointing to YAML (or JSON)')
	}
	
	if (Array.isArray(content)){
		for (let i of content)
			render(output_container, i, headersize)
		return
	}
	
	if (typeof content !== 'object')
		res = types.error('provided input not a string, array or object', content)

	if(!res){
		if (! 'type' in content) res = types.error('type missing',content)
		else {
			if (content.type in types){
				content.headersize = headersize
				try {
					res = types[content.type](content)
				} catch (e) {
					console.error(e)
					res = types.error('creating ' + content.type, content)
				}
/*
				if (res) {
					if ('items' in content)
						for (let i of content.items)
							render(res, i, headersize)
				} 
				else res = types.error('Missing element',content)
*/
			} else res = types.unknown(content)
		}
	}

	let out
	if (typeof(output_container) === 'string'){
		out = document.querySelector(output_container)
		if (!out) return console.error('DOM element not found')
	} else out = output_container
	out.appendChild(res)
}

export { render }

