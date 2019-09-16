import restaurants from '../assets/data/restaurants.json';

class Front {
	constructor(restaurantIdClick) {
		this.restaurantIdClick = restaurantIdClick;
	}
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
		const containerRestaurantExist = document.querySelector('.restaurant');

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

	hideContentRestaurantWhenCommentsDisplay() {
		const containerRestaurants = document.querySelector(
			'.container-map .control .list-restaurants'
		);
		containerRestaurants.classList.add('hide');
	}

	enableScrollContent() {
		const containerlisteRestaurants = document.querySelector('.list-restaurants');

		if (containerlisteRestaurants) {
			if (containerlisteRestaurants.offsetHeight > 500) {
				containerlisteRestaurants.classList.add('scrolled');
			} else {
				containerlisteRestaurants.classList.remove('scrolled');
			}
		}
	}

	static changeColorMarkerOnHover(arrayOfMarkers) {
		const listeRestaurants = document.querySelector('.list-restaurants');

		if (listeRestaurants) {
			const restaurants = listeRestaurants.querySelectorAll('.restaurant');

			restaurants.forEach((restaurant) => {
				restaurant.addEventListener('mouseover', () => {
					const restaurantId = restaurant.dataset.id;

					arrayOfMarkers.forEach((marker) => {
						if (restaurantId === marker.title) {
							marker.setIcon({
								url: '../../src/assets/img/marker-food-hover.png',
							});
						}
					});
				});

				restaurant.addEventListener('mouseout', () => {
					const restaurantId = restaurant.dataset.id;

					arrayOfMarkers.forEach((marker) => {
						if (restaurantId === marker.title) {
							marker.setIcon({
								url: '../../src/assets/img/marker-food.png',
							});
						}
					});
				});
			});
		}
	}

	displayContainerCommentRestaurant() {
		const dataRestaurants = restaurants;
		const containerControl = document.querySelector('.container-map .control');
		const listeRestaurants = document.querySelector('.list-restaurants');

		if (listeRestaurants) {
			const restaurants = document.querySelectorAll('.restaurant');
			const thisFront = this;

			restaurants.forEach((restaurant) => {
				restaurant.addEventListener('click', () => {
					containerControl.classList.add('comment');
					thisFront.hideContentRestaurantWhenCommentsDisplay();
				});
			});
		}
	}

	displayCommentRestaurant() {
		const dataRestaurants = restaurants;
		const containerControl = document.querySelector('.container-map .control');
		const listeRestaurants = document.querySelector('.list-restaurants');
		const thisFront = this;
		const restaurantId = this.restaurantIdClick;

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
				iconBack.src = '../../src/assets/img/chevron-left.png';
				btnBack.appendChild(iconBack);

				btnBack.addEventListener('click', () => {
					thisFront.backToList();
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

				// display btn add comment
				const containerAddComment = document.createElement('div');
				containerAddComment.classList.add('container-add-comment');
				const btnAddComment = document.createElement('button');
				btnAddComment.classList.add('add-comment');
				btnAddComment.setAttribute('id-restaurant', restaurantId);
				btnAddComment.textContent = 'Ajouter un avis';
				containerAddComment.appendChild(btnAddComment);

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
					avatar.style.backgroundImage = `url("../../src/assets/img/unknow.png")`;

					const nameAuthor = document.createElement('div');
					nameAuthor.classList.add('name-author');
					nameAuthor.textContent = comment.user;

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
				containerInfRestaurant.appendChild(containerAddComment);
				containerInfRestaurant.appendChild(containerCommentsRestaurant);
				containerRestaurant.appendChild(containerInfRestaurant);
				containerControl.appendChild(containerRestaurant);
			}
		});
		this.enableScrollComment();
		this.displayModalAddComment();
	}

	enableScrollComment() {
		const containerComments = document.querySelector('.comments-restaurant');
		if (containerComments) {
			if (containerComments.offsetHeight > 400) {
				containerComments.classList.add('scrolled-comment');
			}
		}
	}

	backToList() {
		const control = document.querySelector('.control');

		if (control) {
			const containerlisteRestaurants = control.querySelector('.list-restaurants');
			const containerRestaurants = control.querySelectorAll('.container-restaurant');
			containerlisteRestaurants.classList.remove('hide');
			control.classList.remove('comment');
			containerRestaurants.forEach((containerRestaurant) => {
				containerRestaurant.remove();
			});
		}
	}

	displayModalAddComment() {
		const containerMap = document.querySelector('.container-map');
		const btnAddComment = document.querySelector('.container-add-comment .add-comment');
		const bg = document.querySelector('.bg');

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
					modalAddComment.classList.add('modal');
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

	updateNoteChoice() {
		const modalAddComment = document.querySelector('.modal-add-comment');

		if (modalAddComment) {
			const notes = document.querySelectorAll('.container-note .star');

			notes.forEach((note) => {
				note.addEventListener('mouseover', () => {
					const dataNote = note.getAttribute('data-note');

					notes.forEach((note) => {
						note.classList.remove('selected');
						if (note.getAttribute('data-note') <= dataNote) {
							note.classList.add('active');
							note.classList.add('selected');
						} else {
							note.classList.remove('active');
						}
					});
				});

				note.addEventListener('mouseout', () => {
					const dataNote = note.getAttribute('data-note');

					notes.forEach((note) => {
						if (note.getAttribute('data-note') < dataNote) {
							note.classList.remove('selected');
						}
					});
				});

				note.addEventListener('click', () => {
					notes.forEach((note) => {
						note.classList.remove('selected');
					});

					note.classList.add('selected');
				});
			});
		}
	}

	addCommentFromModal() {
		const dataRestaurants = restaurants;
		const modalAddComment = document.querySelector('.modal-add-comment');

		if (modalAddComment) {
			const btnSubmit = modalAddComment.querySelector('input[type="submit"]');
			const idRestaurantTarget = modalAddComment.dataset.id;

			btnSubmit.addEventListener('click', (e) => {
				e.preventDefault();
				const nameValue = modalAddComment.querySelector('input#name-user').value;
				const noteValue = modalAddComment
					.querySelector('.star.selected')
					.getAttribute('data-note');
				const commentValue = modalAddComment.querySelector('textarea#comment-user').value;

				if (nameValue !== '' && commentValue !== '') {
					dataRestaurants.forEach((restaurant) => {
						if (restaurant.restaurantName === idRestaurantTarget) {
							const allComments = restaurant.ratings;
							const addCommentObj = {
								user: nameValue,
								stars: Number(noteValue),
								comment: commentValue,
							};

							allComments.push(addCommentObj);
						}
					});

					const containerCommentsRestaurant = document.querySelector(
						'.comments-restaurant'
					);

					const containerComment = document.createElement('div');
					containerComment.classList.add('container-comment');
					const containerAvatar = document.createElement('div');
					containerAvatar.classList.add('container-avatar');

					const avatar = document.createElement('div');
					avatar.classList.add('avatar');
					avatar.style.backgroundImage = `url("../../src/assets/img/unknow.png")`;

					const nameAuthor = document.createElement('div');
					nameAuthor.classList.add('name-author');
					nameAuthor.textContent = nameValue;

					const note = document.createElement('div');
					note.classList.add('note');

					for (let i = 1; i <= 5; i++) {
						const star = document.createElement('span');
						star.classList.add(`star-${i}`);

						if (i <= noteValue) {
							star.classList.add('active');
						}
						note.appendChild(star);
					}

					const commentText = document.createElement('div');
					commentText.classList.add('comment');
					commentText.textContent = commentValue;

					containerAvatar.appendChild(avatar);
					containerAvatar.appendChild(nameAuthor);
					containerComment.appendChild(containerAvatar);
					containerComment.appendChild(note);
					containerComment.appendChild(commentText);
					containerCommentsRestaurant.appendChild(containerComment);

					import('./myMap').then((MyMap) => {
						MyMap.MyMap.getAverageStars(restaurants, noteValue);

						const averageRatings = document.querySelector('.average-ratings');

						if (averageRatings) {
							const textAverage = averageRatings.querySelector('.average');
							const stars = averageRatings.querySelectorAll('span');
							const nbRatings = averageRatings.querySelector('.nb-ratings');

							dataRestaurants.forEach((restaurant) => {
								if (restaurant.restaurantName === idRestaurantTarget) {
									textAverage.textContent = restaurant.averageRatings;

									stars.forEach((star, key) => {
										let i = key;
										if (i <= restaurant.averageRatings) {
											star.classList.add('active');
										} else {
											star.classList.remove('active');
										}
									});

									nbRatings.textContent = `${restaurant.nbRatings} avis`;
								}
							});
						}
					});

					modalAddComment.remove();

					const bg = document.querySelector('.bg');
					bg.classList.add('hide');
				}
				this.enableScrollComment();
			});
		}
	}
}

export { Front };
