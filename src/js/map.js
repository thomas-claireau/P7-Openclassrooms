import loadGoogleMapsApi from 'load-google-maps-api';
import keyData from '../assets/data/key.json';
import restaurants from '../assets/data/restaurants.json';

class Map {
	constructor() {
		this.newMap;
	}
	static loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key });
	}

	static createMap(mapElement, lat, lng) {
		this.newMap = new google.maps.Map(mapElement, {
			center: new google.maps.LatLng(lat, lng),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		});
		google.maps.event.addListener(this.newMap, 'bounds_changed', function() {
			var bounds = this.newMap.getBounds();
			var ne = bounds.getNorthEast();
			var sw = bounds.getSouthWest();

			console.log(bounds);
			//do whatever you want with those bounds
		});
		return this.newMap;
	}

	static setMarkers() {
		for (let restaurant of restaurants) {
			const myLatLng = new google.maps.LatLng(restaurant.lat, restaurant.lng);
			const marker = new google.maps.Marker({
				position: myLatLng,
				map: this.newMap,
				title: restaurant.restaurantName,
			});
			marker.getClickable();
			marker.setMap(this.newMap);
		}
	}
}

export { Map };
