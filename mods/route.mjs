/* @license GPLv3 */
import { AbstractElem } from './abstractelem.mjs'

class Itinerary extends AbstractElem {
	
}

class RouteList extends AbstractElem {
	container_classname(){ return 'routelist' }
	get_elem(){
	    let elem = super.get_elem()
	    let as = this.get_maps_links()
	    for (let a of as)
	      elem.appendChild(a)
	    return elem
	}
	to_google_maps_urls(){
		let list = this.raw
		let url = 'https://www.google.com/maps/dir/'
		let to_url = ""
		let from_url = ""
		for (let i of list){
			let add = i.replace(/\ /g, '+') + '/'
			to_url += add
			from_url = add + from_url
		}
		return [
			url + to_url, 
			url + from_url
		]
	}
	get_maps_links(){
		let links = this.to_google_maps_urls()
		let a = document.createElement('a')
		a.href = links[0]
		a.innerText = 'This Route on Google Maps'
		a.target = '_blank'
		let b = document.createElement('a')
		b.href = links[1]
		b.innerText = 'Return trip on Google Maps'
		b.target = '_blank'
		return [a, b]
	}
}

class RouteSection extends AbstractElem {
	container_classname(){ return 'routesection' }
	get_child_type(){ return RouteList }
}
class RouteDesc extends AbstractElem {
	container_classname(){ return 'routedesc' }
	get_child_type(){ return RouteSection }
}

export { RouteDesc }
