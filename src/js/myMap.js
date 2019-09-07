import loadGoogleMapsApi from 'load-google-maps-api';
import keyData from '../assets/data/key.json';
import restaurants from '../assets/data/restaurants.json';
import { Front } from './front.js';

class MyMap {
	constructor(mapElement, lat, lng) {
		this.newMap;
		this.allMarkers = [];
		this.mapElement = mapElement;
		this.lat = lat;
		this.lng = lng;
	}
	loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key });
	}

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

	static addMarker(map, latLng, title, arrayOfAllMarkers) {
		const marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: title,
		});

		marker.set('id', title);
		marker.setMap(map);

		arrayOfAllMarkers.push(marker);

		return arrayOfAllMarkers;
	}

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

	static displayRestaurant(
		restaurantName,
		restaurantStars,
		restaurantAddresse,
		restaurantLat,
		restaurantLng
	) {
		// container global
		const containerRestaurants = document.querySelector(
			'.container-map .control .list-restaurants'
		);

		// container of each restaurant
		const containerRestaurant = document.createElement('div');
		containerRestaurant.classList.add('restaurant');
		containerRestaurant.setAttribute('data-id', restaurantName);

		// left column inside container (flexbox)
		const leftColumnContent = document.createElement('div');
		leftColumnContent.classList.add('left');

		// name of restaurant
		const nameRestaurant = document.createElement('div');
		nameRestaurant.classList.add('nameRestaurant');
		nameRestaurant.innerHTML = `<h3>${restaurantName}</h3>`;

		// number of stars (container)
		const stars = document.createElement('div');
		stars.classList.add('stars');

		// add 5 container span and condition to display star active
		for (let i = 1; i <= 5; i++) {
			const star = document.createElement('span');
			star.classList.add(`star-${i}`);

			if (i <= restaurantStars) {
				star.classList.add('active');
			}

			stars.appendChild(star);
		}

		// addresse of restaurant
		const addresseRestaurant = document.createElement('div');
		addresseRestaurant.classList.add('addresse');
		addresseRestaurant.textContent = restaurantAddresse;

		// right column inside container (flexbox)
		const rightColumnContent = document.createElement('div');
		MyMap.getImgStreetView(restaurantLat, restaurantLng, rightColumnContent);
		rightColumnContent.classList.add('right');

		leftColumnContent.appendChild(nameRestaurant);
		leftColumnContent.appendChild(stars);
		leftColumnContent.appendChild(addresseRestaurant);

		containerRestaurant.appendChild(leftColumnContent);
		containerRestaurant.appendChild(rightColumnContent);

		containerRestaurants.appendChild(containerRestaurant);
	}

	reloadContentRestaurant() {
		const containerRestaurants = document.querySelector(
			'.container-map .control .list-restaurants'
		);
		containerRestaurants.innerHTML = '';
	}

	getAverageStars() {
		// average stars
		let nbRestaurants = 0;
		let averageStars = 0;
		for (const restaurant of restaurants) {
			nbRestaurants++;
			averageStars += restaurant.ratings[0].stars;
		}

		averageStars = averageStars / nbRestaurants;
	}

	static setMapOnAll(map, arrayOfAllMarkers) {
		for (let i = 0; i < arrayOfAllMarkers.length; i++) {
			arrayOfAllMarkers[i].setMap(map);
		}
	}

	static clearMarkers(arrayOfAllMarkers) {
		MyMap.setMapOnAll(null, arrayOfAllMarkers);
	}

	static deleteMarkers(arrayOfAllMarkers) {
		MyMap.clearMarkers(arrayOfAllMarkers);
		arrayOfAllMarkers = [];
		return arrayOfAllMarkers;
	}

	static filterMarker(listrestaurants, map, limiteMap) {
		for (const restaurant of listrestaurants) {
			const latLngRestaurant = { lat: restaurant.lat, lng: restaurant.lng };

			if (limiteMap.contains(latLngRestaurant)) {
				MyMap.addMarker(
					map.newMap,
					latLngRestaurant,
					restaurant.restaurantName,
					map.allMarkers
				);

				MyMap.displayRestaurant(
					restaurant.restaurantName,
					restaurant.ratings[0].stars,
					restaurant.address,
					restaurant.lat,
					restaurant.lng
				);
			}
		}
	}

	boundsChanged() {
		const thisMap = this;
		google.maps.event.addListener(thisMap.newMap, 'idle', function() {
			MyMap.deleteMarkers(thisMap.allMarkers);
			const limite = thisMap.newMap.getBounds();

			thisMap.getAverageStars();
			thisMap.reloadContentRestaurant();

			MyMap.filterMarker(restaurants, thisMap, limite);
		});
	}
}

export { MyMap };
