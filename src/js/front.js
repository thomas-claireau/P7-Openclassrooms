import restaurants from '../assets/data/restaurants.json';

class Front {
	/**
	 * Display background opacity. When clicking on the background, application start
	 * @return {HTMLElement} - Application
	 */
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

	/**
	 * Display restaurant's informations on the left column of the application
	 * @param {string} restaurantName - Name of the restaurant
	 * @param {number} restaurantStars - Rating of the restaurant
	 * @param {string} restaurantAddresse - Address of the restaurant
	 * @param {number} restaurantLat - Lat position of the restaurant
	 * @param {number} restaurantLng - Lng position of the restaurant
	 */
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

	/**
	 * Clear content of the left column after changes
	 * @return {HTMLElement} - Empty left column
	 */
	reloadContentRestaurant() {
		const containerRestaurants = document.querySelector(
			'.container-map .control .list-restaurants'
		);
		containerRestaurants.innerHTML = '';
	}

	/**
	 * Enable scroll content of restaurant when height of content exceeds 500px of height
	 * @return {HTMLElement} - Left column content with class scrolled
	 */
	enableScrollContent() {
		const containerListRestaurants = document.querySelector('.list-restaurants');

		if (containerListRestaurants) {
			const restaurants = containerListRestaurants.querySelectorAll('.restaurant');

			if (restaurants.length > 6) {
				containerListRestaurants.classList.add('scrolled');
			} else {
				containerListRestaurants.classList.remove('scrolled');
			}
		}
	}

	/**
	 * Change design of marker when mouseover each restaurant container (on the left column)
	 * @param {array} arrayOfMarkers - Array of all markers on the map
	 */
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

	/**
	 * Display comments inside the container of restaurant
	 * @return {HTMLElement} - Comments of the restaurant clicking
	 */
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
					this.enableScrollComment();
				});
			});
		}
	}

	/**
	 * Enable scroll content of the list of comments when height exceeds 400px of height
	 * @return {HTMLElement} - List comments content with class scrolled-comment
	 */
	enableScrollComment() {
		const containerComments = document.querySelector('.comments-restaurant');

		if (containerComments) {
			if (containerComments.offsetHeight > 600) {
				containerComments.classList.add('scrolled-comment');
			} else {
				containerComments.classList.remove('scrolled-comment');
			}
		}
	}

	/**
	 * Back to the list of the restaurants when clicking button back
	 * @return {HTMLElement} - List of the restaurant inside the left column content
	 */
	backToList() {
		const control = document.querySelector('.control');
		const containerListRestaurants = document.querySelector('.list-restaurants');
		containerListRestaurants.classList.remove('scrolled');
		control.classList.remove('comment');
		control.querySelector('.container-restaurant').remove();
	}
}

export { Front };
