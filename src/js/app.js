/* eslint-disable import/extensions */
import '../scss/styles.scss';
import { Map } from './map';
import { Front } from './front';

window.addEventListener('DOMContentLoaded', () => {
	const mapElement = document.getElementById('map');

	// start geolocation api
	navigator.geolocation.getCurrentPosition(function(position) {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;

		// start googles maps api
		Map.loadGoogleMapsApi().then(function() {
			Map.createMap(mapElement, lat, lng);
			Map.setMarkers();
		});

		Front.interactionMap();
	});
});
