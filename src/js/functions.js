import svgInjector from 'svg-injector';

export default {
	/**
	 * display svgs when the page load
	 * @return {svg} - Svg load
	 */
	injectSvg: () => {
		const svgs = document.querySelectorAll('img.js-inject-me');
		svgInjector(svgs);
	},
};
