// export default {
// 	load: (callback) => {
// 		const urlApi = `https://maps.googleapis.com/maps/api/js?key=${keyFile.key}`;
// 		const scriptKey = document.createElement('script');
// 		scriptKey.setAttribute('async', '');
// 		scriptKey.setAttribute('defer', '');
// 		scriptKey.src = urlApi;
// 		document.querySelector('body').append(scriptKey);

// 		callback();
// 	},
// };

import keyFile from '../assets/data/key.json';

class Geolocation {
	static loadGeolocation() {
		// const urlApiGeo = `https://www.googleapis.com/geolocation/v1/geolocate?key=${keyFile.key}`;
		// const scriptGeo = document.createElement('script');
		// console.log(urlApiGeo);
		// scriptGeo.src = urlApiGeo;
		// console.log(scriptGeo);
		// document.querySelector('body').appendChild(scriptGeo);
	}
}

export { Geolocation };
