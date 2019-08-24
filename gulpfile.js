// const babel = require('gulp-babel');
const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const server = require('browser-sync').create();

const paths = {
	scripts: {
		src: 'src/js/*.js',
		dest: 'dist/js/',
	},
	scss: {
		src: 'src/scss/*.scss',
		dest: 'dist/css/',
	},
};

const clean = () => del(['dist']);

function scripts() {
	return (
		gulp
			.src(paths.scripts.src)
			// .pipe(rename('app.min.js'))
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(paths.scripts.dest))
	);
}

function styles() {
	return gulp
		.src(paths.scss.src, { sourcemaps: true })
		.pipe(sass())
		.pipe(gulp.dest(paths.scss.dest))
		.pipe(server.stream());
}

function reload(done) {
	server.reload();
	done();
}

function serve(done) {
	server.init({
		watch: true,
		server: {
			baseDir: './',
		},
	});
	done();
}

const watch = () =>
	gulp.watch([paths.scripts.src, paths.scss.src], gulp.series(clean, scripts, styles, reload));

const dev = gulp.series(clean, scripts, styles, serve, watch);

module.exports = {
	default: dev,
};
