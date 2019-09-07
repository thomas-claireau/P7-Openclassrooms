import restaurants from '../assets/data/restaurants.json';

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

		import('./myMap').then((MyMap) => {
			MyMap.MyMap.getImgStreetView(restaurantLat, restaurantLng, rightColumnContent);
			rightColumnContent.classList.add('right');
		});

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

	static changeColorMarkerOnHover(arrayOfMarkers) {
		const listrestaurants = document.querySelector('.list-restaurants');

		if (listrestaurants) {
			const restaurants = listrestaurants.querySelectorAll('.restaurant');

			restaurants.forEach((restaurant) => {
				restaurant.addEventListener('mouseover', () => {
					const restaurantId = restaurant.dataset.id;

					arrayOfMarkers.forEach((marker) => {
						if (restaurantId === marker.title) {
							marker.setIcon({
								url: '../../assets/img/marker-food-hover.png',
							});
						}
					});
				});

				restaurant.addEventListener('mouseout', () => {
					const restaurantId = restaurant.dataset.id;

					arrayOfMarkers.forEach((marker) => {
						if (restaurantId === marker.title) {
							marker.setIcon({
								url: '../../assets/img/marker-food.png',
							});
						}
					});
				});
			});
		}
	}

	displayCommentRestaurant() {
		const dataRestaurants = restaurants;
		const containerControl = document.querySelector('.container-map .control');
		const listrestaurants = document.querySelector('.list-restaurants');

		if (listrestaurants) {
			const restaurants = listrestaurants.querySelectorAll('.restaurant');
			const thisFront = new Front();
			restaurants.forEach((restaurant) => {
				restaurant.addEventListener('click', () => {
					containerControl.classList.add('comment');
					thisFront.reloadContentRestaurant();
					const restaurantId = restaurant.dataset.id;

					dataRestaurants.forEach((dataRestaurant) => {
						if (restaurantId === dataRestaurant.restaurantName) {
							const latRestaurant = dataRestaurant.lat;
							const lngRestaurant = dataRestaurant.lng;
							const nameRestaurant = dataRestaurant.restaurantName;
							const averageRatingsRestaurant = dataRestaurant.averageRatings;
							const nbRatings = dataRestaurant.nbRatings;
							const addressRestaurant = dataRestaurant.address;
							const allComments = dataRestaurant.ratings;

							const containerRestaurant = document.createElement('div');
							containerRestaurant.classList.add('container-restaurant');

							// btn back to list of restaurants
							const btnBack = document.createElement('div');
							btnBack.classList.add('back-to-list');
							const iconBack = document.createElement('img');
							iconBack.src = '../../assets/img/chevron-left.png';
							btnBack.appendChild(iconBack);

							btnBack.addEventListener('click', () => {
								this.backToList();
							});

							const containerInfRestaurant = document.createElement('div');
							containerInfRestaurant.classList.add('container-inf-restaurant');

							// image restaurant
							const containerImgRestaurant = document.createElement('div');
							containerImgRestaurant.classList.add('img-restaurant');

							import('./myMap').then((MyMap) => {
								MyMap.MyMap.getImgStreetView(
									latRestaurant,
									lngRestaurant,
									containerImgRestaurant
								);
							});

							// name restaurant
							const containerTitleRestaurant = document.createElement('div');
							containerTitleRestaurant.classList.add('name-restaurant');
							const titleRestaurant = document.createElement('h3');
							titleRestaurant.textContent = nameRestaurant;
							containerTitleRestaurant.appendChild(titleRestaurant);

							// address restaurant
							const containerAddressRestaurant = document.createElement('div');
							containerAddressRestaurant.classList.add('address-restaurant');
							containerAddressRestaurant.textContent = addressRestaurant;

							// average ratings restaurant
							const containerAverageRatings = document.createElement('div');
							containerAverageRatings.classList.add('average-ratings');
							const titleAverageRatings = document.createElement('div');
							const containerRatings = document.createElement('div');
							containerRatings.classList.add('ratings');
							titleAverageRatings.classList.add('title-average');
							titleAverageRatings.textContent = 'Moyenne des avis';
							const averageRatings = document.createElement('span');
							averageRatings.classList.add('average');
							const containerStars = document.createElement('div');
							containerStars.classList.add('stars');
							const containerNbRatings = document.createElement('span');
							containerNbRatings.classList.add('nb-ratings');

							averageRatings.textContent = averageRatingsRestaurant;

							for (let i = 1; i <= 5; i++) {
								const star = document.createElement('span');
								star.classList.add(`star-${i}`);

								if (i <= averageRatingsRestaurant) {
									star.classList.add('active');
								}
								containerStars.appendChild(star);
							}

							containerNbRatings.textContent = `${nbRatings} avis`;

							containerRatings.appendChild(averageRatings);
							containerRatings.appendChild(containerStars);
							containerRatings.appendChild(containerNbRatings);
							containerAverageRatings.appendChild(titleAverageRatings);
							containerAverageRatings.appendChild(containerRatings);

							// display all comments of restaurant (and note)
							const containerCommentsRestaurant = document.createElement('div');
							containerCommentsRestaurant.classList.add('comments-restaurant');

							allComments.forEach((comment) => {
								const containerComment = document.createElement('div');
								containerComment.classList.add('container-comment');
								const containerAvatar = document.createElement('div');
								containerAvatar.classList.add('container-avatar');

								const avatar = document.createElement('div');
								avatar.classList.add('avatar');
								avatar.style.backgroundImage = `url("../../assets/img/unknow.png")`;

								const nameAuthor = document.createElement('div');
								nameAuthor.classList.add('name-author');
								nameAuthor.textContent = 'unknow';

								const note = document.createElement('div');
								note.classList.add('note');

								for (let i = 1; i <= 5; i++) {
									const star = document.createElement('span');
									star.classList.add(`star-${i}`);

									if (i <= comment.stars) {
										star.classList.add('active');
									}
									note.appendChild(star);
								}

								const commentText = document.createElement('div');
								commentText.classList.add('comment');
								commentText.textContent = comment.comment;

								containerAvatar.appendChild(avatar);
								containerAvatar.appendChild(nameAuthor);
								containerComment.appendChild(containerAvatar);
								containerComment.appendChild(note);
								containerComment.appendChild(commentText);
								containerCommentsRestaurant.appendChild(containerComment);
							});

							// multiple insertion in HTML
							containerRestaurant.appendChild(btnBack);
							containerRestaurant.appendChild(containerImgRestaurant);
							containerInfRestaurant.appendChild(containerTitleRestaurant);
							containerInfRestaurant.appendChild(containerAddressRestaurant);
							containerInfRestaurant.appendChild(containerAverageRatings);
							containerInfRestaurant.appendChild(containerCommentsRestaurant);
							containerRestaurant.appendChild(containerInfRestaurant);
							containerControl.appendChild(containerRestaurant);
						}
					});
				});
			});
		}
	}

	backToList() {
		const control = document.querySelector('.control');
		control.classList.remove('comment');
		control.querySelector('.container-restaurant').remove();
	}
}

export { Front };
