import loadGoogleMapsApi from 'load-google-maps-api';
import keyData from '../assets/data/key.json';
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
		this.dataPlaces;
		this.restaurants = [];
	}

	/**
	 * Load the googles maps api and places libraries
	 * @return {promises} The promise of Google Maps Api
	 */
	loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key, libraries: ['places'] });
	}

	/**
	 * Use a Geocoding (and reverse geocoding) from Google Maps Api
	 * @param {number} lat - Lat of the map
	 * @param {number} lng - Lng of the map
	 * @param {boolean} isReverse - which indicate that's reverse geocoding or not
	 * @param {object} obj - which indicate if the container is an object or not
	 * @param {HTMLElement} container - which indicate if the container is an html element
	 * @param {boolean} isForm  - which indicate if the container is inside a form
	 */
	static loadGeocoding(
		lat,
		lng,
		isReverse = false,
		obj = false,
		container = false,
		isForm = false
	) {
		const latLng = `${lat}, ${lng}`;
		let myRequest;

		if (isReverse) {
			myRequest = new Request(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${keyData.keyGeocodingPlaces}`
			);
		}

		const reverseGeocoding = fetch(myRequest)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				if (container) {
					const addressClick = data.results[0].formatted_address;
					if (isForm) {
						container.value = addressClick;
						container.setAttribute('data-place-id', data.results[0].place_id);
					} else {
						container.textContent = addressClick;
					}
				}
			});
	}

	/**
	 *
	 * @param {object} restaurants - Data of restaurants
	 * @param {object} thisMap - Map object create from Google Maps Api
	 * @param {object} boundsLocation - center of the google maps (lat and lng)
	 * @param {object} limite - lat and lng of the current viewport
	 */
	static addRestaurantFromNearbySearch(restaurants, thisMap, boundsLocation, limite) {
		const nearbySearchRestaurant = new google.maps.places.PlacesService(thisMap.newMap);
		const request = {
			location: boundsLocation,
			radius: '1500',
			type: ['restaurant'],
			fields: ['rating'],
		};
		const thisFront = new Front();
		nearbySearchRestaurant.nearbySearch(request, (results) => {
			let nameRestaurant,
				addressRestaurant,
				latRestaurant,
				lngRestaurant,
				placeIdRestaurant,
				averageRatings,
				objAddRestaurant;

			if (results !== null) {
				results.forEach((result) => {
					nameRestaurant = result.name;
					addressRestaurant = result.vicinity;
					latRestaurant = result.geometry.location.lat();
					lngRestaurant = result.geometry.location.lng();
					averageRatings = result.rating;
					placeIdRestaurant = result.place_id;

					objAddRestaurant = {
						restaurantName: nameRestaurant,
						address: addressRestaurant,
						lat: latRestaurant,
						lng: lngRestaurant,
						placeId: placeIdRestaurant,
						averageRatings: averageRatings,
						nbRatings: 0,
						ratings: [],
						type: null,
					};

					restaurants.push(objAddRestaurant);
				});

				MyMap.filterMarker(restaurants, thisMap, limite);
				thisFront.enableScrollContent();
				Front.displayContainerCommentRestaurant();

				const restaurantsFront = document.querySelectorAll('.list-restaurants .restaurant');
				let restaurantFrontId;

				restaurantsFront.forEach((restaurantFront) => {
					restaurantFront.addEventListener('click', () => {
						restaurantFrontId = restaurantFront.dataset.id;
						MyMap.addReviewsRestaurantFromSearchDetails(
							thisMap,
							thisMap.newMap,
							restaurantFrontId
						);
					});
				});
			}
		});
	}

	/**
	 * Display details and reviews of the restaurant
	 * @param {object} thisMap - Instance of Map
	 * @param {object} newMap - Map object create from Google Maps Api
	 * @param {string} restaurantId - Id of restaurant where to display reviews
	 */
	static addReviewsRestaurantFromSearchDetails(thisMap, newMap, restaurantId) {
		const searchDetailsRestaurant = new google.maps.places.PlacesService(newMap);
		const thisFront = new Front(restaurantId);

		thisMap.restaurants.forEach((restaurant) => {
			if (restaurantId === restaurant.restaurantName) {
				if (restaurant.ratings.length > 0) {
					restaurant.ratings.forEach((rating, key) => {
						if (rating.type === 'init') {
							delete restaurant.ratings[key];
						}
					});
				}

				const request = {
					placeId: restaurant.placeId,
					fields: ['name', 'rating', 'reviews'],
				};

				searchDetailsRestaurant.getDetails(request, (place, status) => {
					let averageRatings, userReview, starsReview, commentReview, objAddReview;
					if (place !== null) {
						if (restaurant.restaurantName === place.name) {
							if (place.reviews !== undefined) {
								place.reviews.forEach((review) => {
									userReview = review.author_name;
									starsReview = review.rating;
									commentReview = review.text;
									averageRatings = review.rating;

									objAddReview = {
										user: userReview,
										stars: starsReview,
										comment: commentReview,
										type: 'init',
									};

									restaurant.averageRatings = averageRatings;
									restaurant.nbRatings = place.reviews.length;

									restaurant.ratings.push(objAddReview);
								});
							}
						}
					}
					thisFront.restaurants = thisMap.restaurants;
					thisFront.displayCommentRestaurant();
				});
			}
		});
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
				url: '../src/assets/img/icon-here.png',
			},
		});

		return this.newMap;
	}

	/**
	 * Add marker from the google maps object
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {object} latLng - position of marker
	 * @param {string} title - title of marker
	 * @param {number} stars - averageRatings of restaurant's marker
	 * @param {array} arrayOfAllMarkers - list of all markers
	 * @param {boolean} isAdd - if marker is adding by user
	 * @return {array} - Array of all markers
	 */
	static addMarker(map, latLng, title, stars, arrayOfAllMarkers, isAdd = false) {
		const marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: title,
			stars: stars,
			icon: '../../src/assets/img/marker-food.png',
		});

		marker.setMap(map);

		if (isAdd) {
			map.panTo(latLng);
		}

		arrayOfAllMarkers.push(marker);

		return arrayOfAllMarkers;
	}

	/**
	 * Use street view api from the google maps to get image of restaurant
	 * @param {number} lat - latitude position
	 * @param {number} lng - longitude position
	 * @param {HTMLElement} container - container who receive image
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
	 * @param {object} restaurants - data of restaurants
	 * @return {object} - Restaurant object with new value (average rating and nb rating)
	 */
	static getAverageStars(restaurants) {
		// average stars
		restaurants.forEach((restaurant) => {
			let averageRatingRestaurant = 0;
			let nbRatings = 0;

			if (restaurant.ratings.length > 0) {
				restaurant.ratings.forEach((ratingRestaurant) => {
					nbRatings++;
					averageRatingRestaurant += ratingRestaurant.stars;
				});

				averageRatingRestaurant = averageRatingRestaurant / nbRatings;
			}

			if (averageRatingRestaurant % 1 !== 0) {
				averageRatingRestaurant = averageRatingRestaurant.toFixed(1);
			}

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
		arrayOfAllMarkers.forEach((marker) => {
			marker.setMap(map);
		});
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
	 * Delete restaurant data inside json file
	 * @return {array} - Empty file with only brackets of array
	 */
	deleteRestaurantsData() {
		let restaurantsAdd = this.restaurants.filter((restaurant) => restaurant.type === 'add');

		while (this.restaurants.length > 0) {
			this.restaurants.pop();
		}

		this.restaurants = restaurantsAdd.concat(this.restaurants);
	}

	/**
	 * Filter marker of google map with differents filters (limite of the map, reviews)
	 * @param {*} listeRestaurants - data of restaurants
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {*} limiteMap - limite viewport of the google map
	 */
	static filterMarker(listeRestaurants, map, limiteMap) {
		MyMap.deleteMarkers(map.allMarkers);
		for (const restaurant of listeRestaurants) {
			const latLngRestaurant = { lat: restaurant.lat, lng: restaurant.lng };
			const rangeStarsLeft = document.querySelector('input.range.left').value;
			const rangeStarsRight = document.querySelector('input.range.right').value;
			const restaurantStars = restaurant.averageRatings;

			if (rangeStarsLeft || rangeStarsRight) {
				if (
					limiteMap.contains(latLngRestaurant) &&
					restaurantStars >= rangeStarsLeft &&
					restaurantStars <= rangeStarsRight
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

		Front.changeColorMarkerOnHover(map.allMarkers);
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
		let centerLatLng;

		google.maps.event.addListener(thisMap.newMap, 'idle', function() {
			if (!containerControl.classList.contains('comment')) {
				limite = thisMap.newMap.getBounds();
				const centerLat = limite.getCenter().lat();
				const centerLng = limite.getCenter().lng();
				centerLatLng = new google.maps.LatLng(centerLat, centerLng);
				thisMap.deleteRestaurantsData();
				MyMap.addRestaurantFromNearbySearch(
					thisMap.restaurants,
					thisMap,
					centerLatLng,
					limite
				);
				thisFront.reloadContentRestaurant();
				thisFront.enableScrollContent();
				Front.displayContainerCommentRestaurant();
			}
		});

		const rangeStars = document.querySelectorAll('.container-range input.range');
		const rangeStarsLeft = document.querySelector('.container-range input.range.left');
		const rangeStarsRight = document.querySelector('.container-range input.range.right');
		const outputStarsLeft = document.querySelector('.container-range .output-stars .nb .left');
		const outputStarsRight = document.querySelector(
			'.container-range .output-stars .nb .right'
		);

		if (rangeStars) {
			function updateRange(range, event) {
				if (rangeStarsLeft.value <= rangeStarsRight.value) {
					if (range.classList.contains('left')) {
						outputStarsLeft.textContent = range.value;
					} else {
						outputStarsRight.textContent = range.value;
					}
				} else {
					const currentRange = event.currentTarget;

					if (currentRange.classList.contains('left')) {
						currentRange.value = rangeStarsRight.value;
					} else {
						currentRange.value = rangeStarsLeft.value;
					}
				}
			}
			rangeStars.forEach((range) => {
				range.oninput = (e) => {
					if (!containerControl.classList.contains('comment')) {
						updateRange(range, e);

						if (rangeStarsLeft.value === '5') {
							rangeStarsLeft.classList.add('up');
						} else {
							rangeStarsLeft.classList.remove('up');
						}

						if (rangeStarsRight.value === '1') {
							rangeStarsRight.classList.add('up');
						} else {
							rangeStarsRight.classList.remove('up');
						}
					}
				};

				range.onchange = (e) => {
					if (!containerControl.classList.contains('comment')) {
						updateRange(range, e);

						thisMap.deleteRestaurantsData();
						MyMap.addRestaurantFromNearbySearch(
							thisMap.restaurants,
							thisMap,
							centerLatLng,
							limite
						);
						thisFront.reloadContentRestaurant();
						thisFront.enableScrollContent();
						Front.displayContainerCommentRestaurant();
					}
				};
			});
		}
	}

	/**
	 * Display modal add restaurant when right clicking inside the google map
	 * @return {modal} - Display modal add restaurant
	 */
	displayModalAddRestaurant() {
		const map = this.newMap;
		const bg = document.querySelector('.bg');
		const containerMap = document.querySelector('.container-map');
		const thisMap = this;

		map.addListener('click', function(e) {
			const latLngClick = e.latLng;
			const latClick = latLngClick.lat();
			const lngClick = latLngClick.lng();

			bg.classList.remove('hide');

			// container modal
			const modalAddRestaurant = document.createElement('div');
			modalAddRestaurant.classList.add('modal');
			modalAddRestaurant.classList.add('modal-add-restaurant');

			// left content
			const leftColumn = document.createElement('div');
			leftColumn.classList.add('left-column');

			// titre column left
			const containerTitleColumnLeft = document.createElement('div');
			containerTitleColumnLeft.classList.add('container-title');
			const title = document.createElement('h3');
			title.textContent = 'Ajouter un restaurant';
			const subTitle = document.createElement('span');
			subTitle.textContent = 'à cette adresse';

			title.appendChild(subTitle);
			containerTitleColumnLeft.appendChild(title);

			// input fields
			const inputFields = document.createElement('div');
			inputFields.classList.add('input-fields');

			// create form
			const formInputFields = document.createElement('form');

			// name of restaurant
			const containerNameRestaurant = document.createElement('div');
			containerNameRestaurant.classList.add('container-name-restaurant');
			const labelNameRestaurant = document.createElement('label');
			labelNameRestaurant.setAttribute('for', 'name-restaurant');
			labelNameRestaurant.textContent = 'Rentrez le nom de votre restaurant : ';
			const inputNameRestaurant = document.createElement('input');
			inputNameRestaurant.type = 'text';
			inputNameRestaurant.setAttribute('required', '');
			inputNameRestaurant.setAttribute('maxLength', '50');
			inputNameRestaurant.id = 'name-restaurant';

			containerNameRestaurant.appendChild(labelNameRestaurant);
			containerNameRestaurant.appendChild(inputNameRestaurant);
			inputFields.appendChild(containerNameRestaurant);

			// address of restaurant
			const containerAddressRestaurant = document.createElement('div');
			containerAddressRestaurant.classList.add('container-address-restaurant');
			const labelAddressRestaurant = document.createElement('label');
			labelAddressRestaurant.setAttribute('for', 'address-restaurant');
			labelAddressRestaurant.textContent = "Rentrez l'adresse de votre restaurant : ";
			const inputAddressRestaurant = document.createElement('input');
			inputAddressRestaurant.type = 'text';
			inputAddressRestaurant.setAttribute('required', '');
			inputAddressRestaurant.setAttribute('maxLength', '100');
			inputAddressRestaurant.setAttribute('disabled', '');
			inputAddressRestaurant.id = 'address-restaurant';

			MyMap.loadGeocoding(latClick, lngClick, true, false, inputAddressRestaurant, true);

			containerAddressRestaurant.appendChild(labelAddressRestaurant);
			containerAddressRestaurant.appendChild(inputAddressRestaurant);
			inputFields.appendChild(containerAddressRestaurant);

			// btn submit
			const containerBtnSubmit = document.createElement('div');
			containerBtnSubmit.classList.add('submit-comment');
			const btnSubmit = document.createElement('input');
			btnSubmit.type = 'submit';

			containerBtnSubmit.appendChild(btnSubmit);
			inputFields.appendChild(containerBtnSubmit);

			formInputFields.appendChild(inputFields);

			// right content
			const rightColumn = document.createElement('div');
			rightColumn.classList.add('right-column');
			// get image street view
			import('./myMap').then((MyMap) => {
				MyMap.MyMap.getImgStreetView(latLngClick.lat(), latLngClick.lng(), rightColumn);
			});

			leftColumn.appendChild(containerTitleColumnLeft);
			leftColumn.appendChild(formInputFields);

			modalAddRestaurant.appendChild(leftColumn);
			modalAddRestaurant.appendChild(rightColumn);
			containerMap.appendChild(modalAddRestaurant);

			bg.addEventListener('click', () => {
				const modalAddRestaurant = document.querySelectorAll('.modal-add-restaurant');
				modalAddRestaurant.forEach((modal) => {
					modal.remove();
				});
			});

			MyMap.addRestaurant(thisMap, thisMap.newMap, latClick, lngClick, thisMap.allMarkers);
		});
	}

	/**
	 * Add restaurant after clicking of submit button from the modal add restaurant
	 * @param {object} thisMap - Instance of map
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {number} latClick - lat position of the right click
	 * @param {number} lngClick - lng position of the right click
	 * @param {*} arrayOfAllMarkers - array of all markers
	 */
	static addRestaurant(thisMap, map, latClick, lngClick, arrayOfAllMarkers) {
		const modalAddRestaurant = document.querySelector('.modal-add-restaurant');

		if (modalAddRestaurant) {
			const btnSubmit = modalAddRestaurant.querySelector('input[type="submit"]');

			btnSubmit.addEventListener('click', (e) => {
				const inputNameRestaurant = modalAddRestaurant.querySelector(
					'input#name-restaurant'
				);
				const inputAddressRestaurant = modalAddRestaurant.querySelector(
					'input#address-restaurant'
				);
				if (inputNameRestaurant.value !== '' && inputAddressRestaurant.value !== '') {
					e.preventDefault();

					const nameRestaurant = inputNameRestaurant.value;
					const addressRestaurant = inputAddressRestaurant.value;
					const placeId = inputAddressRestaurant.dataset.placeId;
					const latRestaurant = latClick;
					const lngRestaurant = lngClick;
					const latLngRestaurant = { lat: latRestaurant, lng: lngRestaurant };
					const averageRatingsDefault = 1;

					const jsonDataRestaurant = {
						restaurantName: nameRestaurant,
						address: addressRestaurant,
						lat: latRestaurant,
						lng: lngRestaurant,
						averageRatings: averageRatingsDefault,
						nbRatings: 0,
						ratings: [],
						placeId: placeId,
						type: 'add',
					};

					thisMap.restaurants.push(jsonDataRestaurant);

					MyMap.addMarker(
						map,
						latLngRestaurant,
						nameRestaurant,
						averageRatingsDefault,
						arrayOfAllMarkers,
						true
					);

					Front.displayRestaurant(
						nameRestaurant,
						averageRatingsDefault,
						addressRestaurant,
						latRestaurant,
						lngRestaurant
					);

					modalAddRestaurant.remove();

					const bg = document.querySelector('.bg');
					bg.classList.add('hide');
				}
			});
		}
	}
}

export { MyMap };
