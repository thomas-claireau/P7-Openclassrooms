import loadGoogleMapsApi from 'load-google-maps-api';
import keyData from '../assets/data/key.json';
import restaurants from '../assets/data/restaurants.json';

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

	boundsChanged() {
		const map = this.newMap;
		const allMarkers = this.allMarkers;
		google.maps.event.addListener(map, 'bounds_changed', function() {
			MyMap.deleteMarkers(allMarkers);
			const limite = map.getBounds();
			const center = map.getCenter();
			const centerLat = center.lat();
			const centerLng = center.lng();
			const location = { lat: centerLat, lng: centerLng };

			let posRestaurants = [];
			for (const restaurant of restaurants) {
				const latLng = { lat: restaurant.lat, lng: restaurant.lng };
				const restaurantName = restaurant.restaurantName;

				posRestaurants.push({ latLng: latLng, restaurantName: restaurantName });
			}

			posRestaurants.forEach((posRestaurant) => {
				if (limite.contains(posRestaurant.latLng)) {
					MyMap.addMarker(
						map,
						posRestaurant.latLng,
						posRestaurant.restaurantName,
						allMarkers
					);
				}
			});
		});
	}
}

export { MyMap };
