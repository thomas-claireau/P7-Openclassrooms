const loadGoogleMapsApi = require('load-google-maps-api');
const keyData = require('../assets/data/key.json');

class Map {
	static loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key });
	}

	static createMap(googleMaps, mapElement, lat, lng) {
		return new googleMaps.Map(mapElement, {
			center: { lat: lat, lng: lng },
			zoom: 14,
		});
	}

	interactionMap() {
		const body = document.querySelector('body');
		const myMap = document.querySelector('.container-map');

		if (myMap) {
			const bg = myMap.querySelector('.bg');
			const control = myMap.querySelector('.control div');

			bg.addEventListener('click', () => {
				body.classList.add('interaction');
				control.classList.add('interaction');
				bg.classList.add('hide');
			});
		}
	}
}

export { Map };
