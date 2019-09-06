class Front {
	interactionMap() {
		const myMap = document.querySelector('.container-map');
		const sectionLogo = document.querySelector('.logo');

		if (myMap) {
			const bg = myMap.querySelector('.bg');
			const control = myMap.querySelector('.control div');

			bg.addEventListener('click', () => {
				sectionLogo.classList.add('hide');
				myMap.classList.add('active');
				control.classList.add('interaction');
				bg.classList.add('hide');
			});
		}
	}

	updateRangeStars() {
		const rangeStars = document.querySelector('input#stars');
		const outputStars = document.querySelector('.output-stars .nb');

		rangeStars.oninput = () => {
			outputStars.innerHTML = rangeStars.value;
		};
	}

	addIdMarker() {
		const restaurants = document.querySelectorAll('.list-restaurants .restaurant');
		// const markerArea = document.querySelectorAll('div area');

		if (restaurants) {
			for (let i = 0; i < restaurants.length; i++) {
				const titleRestaurant = restaurants[i].dataset.id;
				titleRestaurant = titleRestaurant
					.split(' ')
					.join('-')
					.toLowerCase();

				// console.log(titleRestaurant);
				const idMarker = document.querySelector(`div area[title="${titleRestaurant}"]`);

				const containerIdMarker = idMarker.parentNode.parentNode.querySelector('img');
				containerIdMarker.dataset.id = titleRestaurant;
			}
		}
	}
}

export { Front };
