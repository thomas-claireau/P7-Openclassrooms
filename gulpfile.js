// const babel = require('gulp-babel');
const del = require('del');
const gulp = require('gulp');
const minify = require('gulp-minify');
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
			.src(paths.scripts.src, { sourcemaps: true })
			// .pipe(babel())
			.pipe(minify())
			.pipe(gulp.dest(paths.scripts.dest))
	);
}

function styles() {
	return gulp
		.src(paths.scss.src, { sourcemaps: true })
		.pipe(sass())
		.pipe(gulp.dest(paths.scss.dest));
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

const watch = () => gulp.watch(paths.scripts.src, gulp.series(scripts, styles, reload));

const dev = gulp.series(clean, scripts, styles, serve, watch);

module.exports = {
	default: dev,
};
