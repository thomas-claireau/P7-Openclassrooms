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

	static displayReverseGeocoding(lat, lng, container = false, isForm = false) {
		const latLng = `${lat}, ${lng}`;
		const myRequest = new Request(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${keyData.keyGeocoding}`
		);

		this.reverseGeocoding = fetch(myRequest)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				if (container) {
					const addressClick = data.results[0].formatted_address;
					if (isForm) {
						container.value = addressClick;
					} else {
						container.textContent = addressClick;
					}
				}
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

	static getAverageStars() {
		// average stars
		restaurants.forEach((restaurant) => {
			let averageRatingRestaurant = 0;
			let nbRatings = 0;

			restaurant.ratings.forEach((ratingRestaurant) => {
				nbRatings++;
				averageRatingRestaurant += ratingRestaurant.stars;
			});

			averageRatingRestaurant = averageRatingRestaurant / nbRatings;
			averageRatingRestaurant = averageRatingRestaurant.toFixed(1);

			restaurant.averageRatings = averageRatingRestaurant;
			restaurant.nbRatings = nbRatings;
		});
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

	boundsChanged() {
		const containerControl = document.querySelector('.control');
		const thisMap = this;
		const thisFront = new Front();
		const arrayOfMarker = this.allMarkers;
		let limite;

		google.maps.event.addListener(thisMap.newMap, 'idle', function() {
			if (!containerControl.classList.contains('comment')) {
				limite = thisMap.newMap.getBounds();
				MyMap.getAverageStars();
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
			inputAddressRestaurant.id = 'address-restaurant';

			MyMap.displayReverseGeocoding(latClick, lngClick, inputAddressRestaurant, true);

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
		});

		// function placeMarker(position, map) {
		// 	var marker = new google.maps.Marker({
		// 		position: position,
		// 		map: map,
		// 	});
		// 	map.panTo(position);
		// }
	}

	test() {
		btnAddComment.addEventListener('click', () => {
			const idRestaurant = btnAddComment.getAttribute('id-restaurant');
			restaurants.forEach((restaurant) => {
				if (restaurant.restaurantName === idRestaurant) {
					const nameRestaurant = restaurant.restaurantName;
					const restaurantLat = restaurant.lat;
					const restaurantLng = restaurant.lng;
					bg.classList.remove('hide');
					// container modal
					const modalAddComment = document.createElement('div');
					modalAddComment.classList.add('modal-add-comment');
					modalAddComment.setAttribute('data-id', restaurant.restaurantName);
					// left content
					const leftColumn = document.createElement('div');
					leftColumn.classList.add('left-column');
					// name of restaurant
					const containerNameRestaurant = document.createElement('div');
					containerNameRestaurant.classList.add('name-restaurant');
					const name = document.createElement('h3');
					const sousTitre = document.createElement('span');
					sousTitre.textContent = 'Ajouter un avis';
					name.textContent = nameRestaurant;
					name.appendChild(sousTitre);
					// input fields
					const inputFields = document.createElement('div');
					inputFields.classList.add('input-fields');
					// create form
					const formInputFields = document.createElement('form');
					// name of user
					const containerNameUser = document.createElement('div');
					containerNameUser.classList.add('container-name-user');
					const labelNameUser = document.createElement('label');
					labelNameUser.setAttribute('for', 'name-user');
					labelNameUser.textContent = 'Votre nom : ';
					const nameUser = document.createElement('input');
					nameUser.type = 'text';
					nameUser.setAttribute('required', '');
					nameUser.setAttribute('maxLength', '55');
					nameUser.id = 'name-user';
					containerNameUser.appendChild(labelNameUser);
					containerNameUser.appendChild(nameUser);
					// note of user
					const containerNote = document.createElement('div');
					containerNote.classList.add('container-note');
					const textNote = document.createElement('label');
					textNote.textContent = 'Votre note :';
					containerNote.appendChild(textNote);
					for (let i = 1; i <= 5; i++) {
						const star = document.createElement('span');
						star.classList.add('star');
						if (i === 1) star.classList.add('selected');
						star.setAttribute('data-note', i);
						containerNote.appendChild(star);
					}
					// comment of user
					const containerCommentUser = document.createElement('div');
					containerCommentUser.classList.add('container-comment-user');
					const labelCommentUser = document.createElement('label');
					labelCommentUser.setAttribute('for', 'comment-user');
					labelCommentUser.textContent = 'Votre commentaire : ';
					const commentUser = document.createElement('textarea');
					commentUser.id = 'comment-user';
					commentUser.setAttribute('required', '');
					// btn submit
					const containerBtnSubmit = document.createElement('div');
					containerBtnSubmit.classList.add('submit-comment');
					const btnSubmit = document.createElement('input');
					btnSubmit.type = 'submit';
					containerBtnSubmit.appendChild(btnSubmit);
					containerCommentUser.appendChild(labelCommentUser);
					containerCommentUser.appendChild(commentUser);
					formInputFields.appendChild(containerNameUser);
					formInputFields.appendChild(containerNote);
					formInputFields.appendChild(containerCommentUser);
					formInputFields.appendChild(containerBtnSubmit);
					inputFields.appendChild(formInputFields);
					// insection left content
					containerNameRestaurant.appendChild(name);
					leftColumn.appendChild(containerNameRestaurant);
					leftColumn.appendChild(inputFields);
					// right content
					const rightColumn = document.createElement('div');
					rightColumn.classList.add('right-column');
					// get image street view
					import('./myMap').then((MyMap) => {
						MyMap.MyMap.getImgStreetView(restaurantLat, restaurantLng, rightColumn);
					});
					modalAddComment.appendChild(leftColumn);
					modalAddComment.appendChild(rightColumn);
					containerMap.appendChild(modalAddComment);
				}
			});
			bg.addEventListener('click', () => {
				const modalAddComment = document.querySelectorAll('.modal-add-comment');
				modalAddComment.forEach((modal) => {
					modal.remove();
				});
			});
			this.updateNoteChoice();
			this.addCommentFromModal();
		});
	}
}

export { MyMap };
