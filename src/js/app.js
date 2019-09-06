/* eslint-disable import/extensions */
import '../scss/styles.scss';
import { Front } from './front';
import { MyMap } from './myMap';
import functions from './functions';

window.addEventListener('DOMContentLoaded', () => {
	functions.injectSvg();
	const mapElement = document.getElementById('map');

	// start geolocation api
	navigator.geolocation.getCurrentPosition(function(position) {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;

		// start googles maps api
		const newMap = new MyMap(mapElement, lat, lng);
		newMap.loadGoogleMapsApi().then(function() {
			newMap.createMap();
			// newMap.setMarkers();

			// charger getBounds seulement au début de l'intéraction de l'utilisateur avec la carte
			const bgMap = document.querySelector('.container-map .bg');
			bgMap.addEventListener('click', function() {
				newMap.boundsChanged();
			});
		});

		const newMapFront = new Front();
		newMapFront.interactionMap();
		newMapFront.updateRangeStars();
	});
});
