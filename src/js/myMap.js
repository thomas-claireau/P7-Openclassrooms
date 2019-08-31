import keyFile from '../assets/data/key.json';

export default class MyMap {
	constructor(lat, lng) {
		this.lat = lat;
		this.lng = lng;
	}

	// load() {
	// 	const urlApi = `https://maps.googleapis.com/maps/api/js?key=${keyFile.key}`;
	// 	const scriptKey = document.createElement('script');
	// 	scriptKey.setAttribute('async', '');
	// 	scriptKey.setAttribute('defer', '');
	// 	scriptKey.src = urlApi;
	// 	document.querySelector('body').append(scriptKey);
	// }

	static loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyFile.key });
	}

	initMap() {
		const google = window.google;
		const map = new google.maps.Map(document.getElementById('map'), {
			center: new google.maps.LatLng(this.lat, this.lng),
			zoom: 11,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			scrollwheel: false,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			},
			navigationControl: true,
			navigationControlOptions: {
				style: google.maps.NavigationControlStyle.ZOOM_PAN,
			},
		});
	}

	interactionMap() {
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
