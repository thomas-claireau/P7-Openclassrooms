import loadGoogleMapsApi from 'load-google-maps-api';
import keyData from '../assets/data/key.json';
import restaurants from '../assets/data/restaurants.json';

class Map {
	constructor() {
		this.newMap;
	}
	static loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key });
	}

	static createMap(googleMaps, mapElement, lat, lng) {
		this.newMap = new googleMaps.Map(mapElement, {
			center: { lat: lat, lng: lng },
			zoom: 14,
		});
		return this.newMap;
	}

	static setMarkers() {
		for (let restaurant of restaurants) {
			const myLatLng = new google.maps.LatLng(restaurant.lat, restaurant.lng);
			const marker = new google.maps.Marker({
				position: myLatLng,
				title: restaurant.restaurantName,
			});
			marker.setMap(this.newMap);
		}
	}

	static interactionMap() {
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
