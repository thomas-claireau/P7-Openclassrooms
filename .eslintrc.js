module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ['airbnb-base', 'prettier'],
	plugins: ['prettier'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	rules: {
		'no-unused-vars': ['off'],
		'no-array-constructor': ['off'],
		'lines-between-class-members': ['off'],
		'class-methods-use-this': ['off'],
		'prefer-destructuring': ['off'],
		'guard-for-in': ['off'],
		'no-restricted-syntax': ['off'],
		'no-undef': ['off'],
		'no-unused-expressions': ['off'],
		'func-names': ['off'],
	},
};
