import loadGoogleMapsApi from 'load-google-maps-api';
import keyData from '../assets/data/key.json';
import restaurants from '../assets/data/restaurants.json';
import { Front } from './front.js';

class MyMap {
	/**
	 * Create a map and interactions with her
	 * @param {object} mapElement - Map object create from Google Maps Api
	 * @param {number} lat - Lat of the map
	 * @param {number} lng - Lng of the map
	 */
	constructor(mapElement, lat, lng) {
		this.newMap;
		this.allMarkers = [];
		this.mapElement = mapElement;
		this.lat = lat;
		this.lng = lng;
	}

	/**
	 * Load the googles maps api and places libraries
	 * @return {promises} The promise of Google Maps Api
	 */
	loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key });
	}

	/**
	 * Create a google maps api
	 * @return {object} - New object of google maps api
	 */
	createMap() {
		this.newMap = new google.maps.Map(this.mapElement, {
			zoom: 14,
			center: new google.maps.LatLng(this.lat, this.lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		});

		const markerCenter = new google.maps.Marker({
			position: this.newMap.center,
			map: this.newMap,
			icon: {
				url: '../assets/img/icon-here.png',
			},
		});

		return this.newMap;
	}

	/**
	 * Add marker from the google maps object
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {object} latLng
	 * @param {string} title
	 * @param {number} stars
	 * @param {array} arrayOfAllMarkers
	 * @param {boolean} isAdd
	 * @return {array} - Array of all markers
	 */
	static addMarker(map, latLng, title, stars, arrayOfAllMarkers) {
		const marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: title,
			stars: stars,
			icon: '../../assets/img/marker-food.png',
		});

		marker.setMap(map);

		arrayOfAllMarkers.push(marker);

		return arrayOfAllMarkers;
	}

	/**
	 * Use street view api from the google maps to get image of restaurant
	 * @param {number} lat
	 * @param {number} lng
	 * @param {HTMLElement} container
	 */
	static getImgStreetView(lat, lng, container) {
		const location = `${lat}, ${lng}`;
		const params = {
			size: '600x600',
			location: location,
			key: keyData.key,
		};

		const urlImg = `https://maps.googleapis.com/maps/api/streetview?size=${params.size}&location=${params.location}&key=${params.key}`;

		container.style.backgroundImage = `url("${urlImg}")`;
	}

	/**
	 * Get average ratings and number of comment of each restaurant and add it of restaurant object
	 * @return {object} - Restaurant object with new value (average rating and nb rating)
	 */
	getAverageStars() {
		// average stars
		restaurants.forEach((restaurant) => {
			let averageRatingRestaurant = 0;
			let nbRatings = 0;

			restaurant.ratings.forEach((ratingRestaurant) => {
				nbRatings++;
				averageRatingRestaurant += ratingRestaurant.stars;
			});

			averageRatingRestaurant = averageRatingRestaurant / nbRatings;

			restaurant.averageRatings = averageRatingRestaurant;
			restaurant.nbRatings = nbRatings;
		});
	}

	/**
	 * Set the all marker inside objet of google maps
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {array} arrayOfAllMarkers - Array of all markers
	 */
	static setMapOnAll(map, arrayOfAllMarkers) {
		for (let i = 0; i < arrayOfAllMarkers.length; i++) {
			arrayOfAllMarkers[i].setMap(map);
		}
	}

	/**
	 * clear the all markers inside object of google maps
	 * @param {array} arrayOfAllMarkers - Array of all markers
	 */
	static clearMarkers(arrayOfAllMarkers) {
		MyMap.setMapOnAll(null, arrayOfAllMarkers);
		arrayOfAllMarkers.splice(0, arrayOfAllMarkers.length);
	}

	/**
	 * delete all markers from array of all markers
	 * @param {array} arrayOfAllMarkers - Array of all markers
	 */
	static deleteMarkers(arrayOfAllMarkers) {
		MyMap.clearMarkers(arrayOfAllMarkers);
		arrayOfAllMarkers = [];
		return arrayOfAllMarkers;
	}

	/**
	 * Filter marker of google map with differents filters (limite of the map, reviews)
	 * @param {*} listeRestaurants
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {*} limiteMap
	 */
	static filterMarker(listrestaurants, map, limiteMap) {
		MyMap.deleteMarkers(map.allMarkers);
		for (const restaurant of listrestaurants) {
			const latLngRestaurant = { lat: restaurant.lat, lng: restaurant.lng };
			const rangeStars = document.querySelector('input#stars').value;
			const restaurantStars = restaurant.averageRatings;

			if (
				limiteMap.contains(latLngRestaurant) &&
				restaurantStars > 0 &&
				restaurantStars <= rangeStars
			) {
				MyMap.addMarker(
					map.newMap,
					latLngRestaurant,
					restaurant.restaurantName,
					restaurant.averageRatings,
					map.allMarkers
				);

				Front.displayRestaurant(
					restaurant.restaurantName,
					restaurant.averageRatings,
					restaurant.address,
					restaurant.lat,
					restaurant.lng
				);
			}
		}
	}

	/**
	 * Controller method which display all markers of the maps under conditions
	 * @return {map} - Map with all markers displayed
	 */
	boundsChanged() {
		const containerControl = document.querySelector('.control');
		const thisMap = this;
		const thisFront = new Front();
		const arrayOfMarker = this.allMarkers;
		let limite;

		google.maps.event.addListener(thisMap.newMap, 'idle', function() {
			if (!containerControl.classList.contains('comment')) {
				limite = thisMap.newMap.getBounds();
				thisMap.getAverageStars();
				thisFront.reloadContentRestaurant();
				MyMap.filterMarker(restaurants, thisMap, limite);
				thisFront.enableScrollContent();
				Front.changeColorMarkerOnHover(arrayOfMarker);
				thisFront.displayCommentRestaurant();
			}
		});

		const rangeStars = document.querySelector('input#stars');
		const outputStars = document.querySelector('.output-stars .nb');

		if (rangeStars) {
			rangeStars.oninput = () => {
				if (!containerControl.classList.contains('comment')) {
					outputStars.innerHTML = rangeStars.value;
					thisFront.reloadContentRestaurant();
					MyMap.filterMarker(restaurants, thisMap, limite);
					Front.changeColorMarkerOnHover(arrayOfMarker);
					thisFront.displayCommentRestaurant();
				}
			};
		}
	}
}

export { MyMap };
