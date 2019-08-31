/* eslint-disable import/extensions */
// import SVGInjector from 'svg-injector';
import myMap from './myMap';
import functions from './functions';
import config from './config';
import '../scss/styles.scss';
// import $ from 'jquery';

myMap.test();

document.addEventListener('DOMContentLoaded', () => {
	console.log(config.name);
	console.log('passe');
	const btnjQuery = document.querySelector('.add-jquery');
	btnjQuery.addEventListener('click', () => {
		// import('jquery').then(({ default: $ }) => {
		// 	$('body').css('backgroundColor', '#000');
		// 	console.log('passe');
		// });
	});
	// const lat = 48.852969;
	// const lng = 2.349903;
	// const newMap = new MyMap(lat, lng);
	// newMap.initMap();
	// newMap.interactionMap();
	// new MyMap(lat, lng).initMap();
	functions.injectSvg();
});
