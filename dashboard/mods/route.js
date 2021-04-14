/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class Itinerary extends AbstractElem {
	
}

class RouteList extends AbstractElem {
	get_elem(){
	    let elem = super.get_elem()
	    let a = this.get_maps_link()
	    elem.appendChild(a)
	    return elem
	}
	to_google_maps_url(){
		let list = this.raw
		let url = 'https://www.google.com/maps/dir/'
		for (let i of list)
			url += i.replace(/\ /g, '+') + '/'
		return url
	}
	get_maps_link(){
		let a = document.createElement('a')
		a.href = this.to_google_maps_url()
		a.innerText = 'Google Maps'
		a.target = '_blank'
		return a
	}
}

class RouteSection extends AbstractElem {
	get_child_type(){ return RouteList }
}
class RouteDesc extends AbstractElem {
	get_child_type(){ return RouteSection }
}

export { RouteDesc }
