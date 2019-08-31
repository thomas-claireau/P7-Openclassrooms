/* eslint-disable import/extensions */
// import SVGInjector from 'svg-injector';
import '../scss/styles.scss';
// import loadKey from './loadKey';
// import MyMap from './myMap';
import functions from './functions';
import config from './config';
import svgInjector from 'svg-injector';
import { Map } from './map';

window.addEventListener('DOMContentLoaded', () => {
	// loadKey.load(test);
	// function test() {
	// const lat = 48.852969;
	// const lng = 2.349903;
	// let map;
	// const newMap = new MyMap(lat, lng);
	// // newMap.load();
	// newMap.initMap();
	// newMap.interactionMap();
	// new Map(lat, lng).initMap();
	// }
	// functions.injectSvg();
	let mapElement = document.getElementById('map');

	Map.loadGoogleMapsApi().then(function(googleMaps) {
		Map.createMap(googleMaps, mapElement);
	});
});
