const loadGoogleMapsApi = require('load-google-maps-api');
const keyData = require('../assets/data/key.json');

class Map {
	static loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key });
	}
	static createMap(googleMaps, mapElement) {
		return new googleMaps.Map(mapElement, {
			center: { lat: 45.520562, lng: -122.677438 },
			zoom: 14,
		});
	}
}
export { Map };
