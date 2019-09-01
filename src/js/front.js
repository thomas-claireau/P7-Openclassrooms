class Front {
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

export { Front };
