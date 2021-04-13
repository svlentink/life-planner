/* @license GPLv3 */
import { AbstractElem } from './abstractelem.js'

class Itinerary extends AbstractElem {
	
}

class RouteDesc extends AbstractElem {
	to_google_maps_link(){
		let list = this.raw
		let res = 'https://www.google.com/maps/dir/'
		for (let i of list)
			res += i.replace(/\ /g, '+') + '/'
		return res
	}
}

Gondel+15+41,+8243+BP+Lelystad,+Nederland/Terneuzen/Faro,+Portugal/

- Stadhuisplein 51, 8232ZZ Lelystad, Netherlands
- Stationsplein 1, 1012AB Amsterdam, Netherlands
- Terneuzen, Netherlands
