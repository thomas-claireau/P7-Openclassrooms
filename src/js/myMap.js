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
		this.dataPlaces;
	}

	loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key, libraries: ['places'] });
	}

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

	static addRestaurantFromNearbySearch(thisMap, boundsLocation, limite) {
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
					};

					restaurants.push(objAddRestaurant);
				});

				MyMap.addReviewsRestaurantFromSearchDetails(thisMap.newMap);
				MyMap.filterMarker(restaurants, thisMap, limite);
				thisFront.displayCommentRestaurant();
				thisFront.enableScrollContent();
			}
		});
	}

	static addReviewsRestaurantFromSearchDetails(thisMap) {
		const searchDetailsRestaurant = new google.maps.places.PlacesService(thisMap);

		restaurants.forEach((restaurant) => {
			const request = {
				placeId: restaurant.placeId,
				fields: ['name', 'rating', 'reviews'],
			};

			searchDetailsRestaurant.getDetails(request, (place) => {
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
								};

								restaurant.averageRatings = averageRatings;
								restaurant.ratings.push(objAddReview);
							});
						}
					}
				}
			});
		});
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

	static addMarker(map, latLng, title, stars, arrayOfAllMarkers, isAdd = false) {
		const marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: title,
			stars: stars,
			icon: '../../assets/img/marker-food.png',
		});

		marker.setMap(map);

		if (isAdd) {
			map.panTo(latLng);
		}

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

	static getAverageStars(dataRestaurant) {
		// average stars
		let averageRatingRestaurant = 0;
		let nbRatings = 0;

		if (dataRestaurant.ratings.length > 0) {
			dataRestaurant.ratings.forEach((ratingRestaurant) => {
				nbRatings++;
				averageRatingRestaurant += ratingRestaurant.stars;
			});

			averageRatingRestaurant = averageRatingRestaurant / nbRatings;
		}

		if (averageRatingRestaurant % 1 !== 0) {
			averageRatingRestaurant = averageRatingRestaurant.toFixed(1);
		}

		dataRestaurant.averageRatings = averageRatingRestaurant;
		dataRestaurant.nbRatings = nbRatings;
	}

	static setMapOnAll(map, arrayOfAllMarkers) {
		for (let i = 0; i < arrayOfAllMarkers.length; i++) {
			arrayOfAllMarkers[i].setMap(map);
		}
	}

	static clearMarkers(arrayOfAllMarkers) {
		MyMap.setMapOnAll(null, arrayOfAllMarkers);
		arrayOfAllMarkers.splice(0, arrayOfAllMarkers.length);
	}

	static deleteMarkers(arrayOfAllMarkers) {
		MyMap.clearMarkers(arrayOfAllMarkers);
		arrayOfAllMarkers = [];
		return arrayOfAllMarkers;
	}

	deleteRestaurantsData() {
		restaurants.forEach((restaurant, index, object) => {
			// don't remove restaurant add
			if (restaurant.type === 'add') {
				return;
			} else {
				object.splice(index, 1);
			}
		});
	}

	static filterMarker(listeRestaurants, map, limiteMap) {
		MyMap.deleteMarkers(map.allMarkers);
		for (const restaurant of listeRestaurants) {
			const latLngRestaurant = { lat: restaurant.lat, lng: restaurant.lng };
			const rangeStars = document.querySelector('input#stars').value;
			const restaurantStars = restaurant.averageRatings;

			if (
				limiteMap.contains(latLngRestaurant) &&
				restaurantStars >= 0 &&
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

	boundsChanged() {
		const containerControl = document.querySelector('.control');
		const thisMap = this;
		const thisFront = new Front();
		const arrayOfMarker = this.allMarkers;
		let limite;

		google.maps.event.addListener(thisMap.newMap, 'idle', function() {
			console.log('passe');
			if (!containerControl.classList.contains('comment')) {
				limite = thisMap.newMap.getBounds();
				const centerLat = limite.getCenter().lat();
				const centerLng = limite.getCenter().lng();
				const centerLatLng = new google.maps.LatLng(centerLat, centerLng);
				thisMap.deleteRestaurantsData();
				MyMap.addRestaurantFromNearbySearch(thisMap, centerLatLng, limite);
				thisFront.reloadContentRestaurant();
				thisFront.enableScrollContent();
				Front.changeColorMarkerOnHover(arrayOfMarker);
				// thisFront.displayCommentRestaurant();
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
					thisFront.enableScrollContent();
					Front.changeColorMarkerOnHover(arrayOfMarker);
					thisFront.displayCommentRestaurant();
				}
			};
		}
	}

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

			MyMap.addRestaurant(thisMap.newMap, latClick, lngClick, thisMap.allMarkers);
		});
	}

	static addRestaurant(map, latClick, lngClick, arrayOfAllMarkers) {
		const modalAddRestaurant = document.querySelector('.modal-add-restaurant');

		if (modalAddRestaurant) {
			const inputNameRestaurant = modalAddRestaurant.querySelector('input#name-restaurant');
			const inputAddressRestaurant = modalAddRestaurant.querySelector(
				'input#address-restaurant'
			);
			const btnSubmit = modalAddRestaurant.querySelector('input[type="submit"]');

			btnSubmit.addEventListener('click', (e) => {
				if (inputNameRestaurant.value !== '' && inputAddressRestaurant.value !== '') {
					e.preventDefault();

					const nameRestaurant = inputNameRestaurant.value;
					const addressRestaurant = inputAddressRestaurant.value;
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
						type: 'add',
					};

					restaurants.push(jsonDataRestaurant);

					MyMap.addMarker(
						map,
						latLngRestaurant,
						nameRestaurant,
						averageRatingsDefault,
						arrayOfAllMarkers,
						true
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
