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
}

export { Front };
