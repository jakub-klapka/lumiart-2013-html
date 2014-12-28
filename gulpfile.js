
var gulp = require( 'gulp' ),
	sass = require( 'gulp-ruby-sass' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	imagemin = require( 'gulp-imagemin' ),
	uglify = require( 'gulp-uglify' ),
	rename = require( 'gulp-rename' ),
	shell = require( 'gulp-shell' ),
	critical = require( 'critical' ),
	plumber = require( 'gulp-plumber' ),
	gulp_filter = require( 'gulp-filter' ),
	livereload = require( 'gulp-livereload' ),
	merge_stream = require( 'merge-stream' ),
	gulpsync = require('gulp-sync')(gulp);

var sass_config = {
	'style': 'compressed',
	'compass': true
};

var imagemin_config = {
	progressive: true
};

var plumber_config = {
	errorHandler: function( err ) {
		console.log(err.toString());
		this.emit( 'end' );
	}
};


/*
CSS
 */
gulp.task( 'css', function(){
	var filter = gulp_filter(['*', '!*.map']);
	return gulp.src( 'sass/**/*.scss', { base: 'sass' } )
		.pipe( plumber( plumber_config ) )
		.pipe( sass( sass_config ) )
		.pipe( filter )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( 'build/css' ) );

} );
gulp.task( 'watch_css', function(){
	gulp.watch( 'sass/**/*.scss', [ 'css' ] );
} );

/*
Fonts
 */
gulp.task( 'fonts', function(){
	return gulp.src( 'fonts/**/*', { base: 'fonts' } )
		.pipe( gulp.dest( 'build/fonts' ) );
} );

/*
Images
 */
gulp.task( 'images', function(){

	var ns = gulp.src( [ 'images/**/*', '!images/**/*.{jpg,jpeg,gif,png,svg}' ], { base: 'images' } )
		.pipe( gulp.dest( 'build/images' ) );

	var s = gulp.src( [ 'images/**/*.{jpg,jpeg,gif,png,svg}' ], { base: 'images' } )
		.pipe( imagemin( imagemin_config ) )
		.pipe( gulp.dest( 'build/images' ) );

	return merge_stream( ns, s );

} );

/*
JS
 */
gulp.task( 'handlebars_precompile', function(){
	return gulp.src( 'js/**/*.handlebars', { base: 'js', read: false } )
		.pipe( plumber( plumber_config ) )
		.pipe( shell( [ 'handlebars "<%= file.path %>" -f "<%= removext(file.path) %>"' ], {
			templateData: {
				removext: function( path ) {
					return path.replace( '.handlebars', '' ) + '.js';
				}
			}
		}) );
} );
gulp.task( 'js', ['handlebars_precompile'], function(){

	var copy = gulp.src( 'js/**/*.min.js', { base: 'js' } )
		.pipe( gulp.dest( 'build/js' ) );

	var f_uglify = gulp.src( [ 'js/**/*.js', '!js/**/*.min.js' ], { base: 'js' } )
		.pipe( plumber( plumber_config ) )
		.pipe( uglify() )
		.pipe( rename( function( path ){
			path.extname = '.min.js';
		} ) )
		.pipe( gulp.dest( 'build/js' ) );

	return merge_stream( copy, f_uglify );

} );

gulp.task( 'critical', function(){
	critical.generate({
		base: '.',
		src: 'home.html',
		width: 1024,
		height: 768,
		dest: 'build/css/critical-home.css'
	});
	critical.generate({
		base: '.',
		src: 'contact.html',
		width: 1024,
		height: 768,
		dest: 'build/css/critical-contact.css'
	});
	critical.generate({
		base: '.',
		src: 'layout.html',
		//css: ['build/css/layout.css'],
		width: 1024,
		height: 768,
		dest: 'build/css/critical-layout.css'
	});
	critical.generate({
		base: '.',
		src: 'portfolio.html',
		//css: ['build/css/portfolio.css'],
		width: 1024,
		height: 768,
		dest: 'build/css/critical-portfolio.css'
	});
	critical.generate({
		base: '.',
		src: 'team.html',
		//css: ['build/css/team.css'],
		width: 1024,
		height: 768,
		dest: 'build/css/critical-team.css'
	});



} );

/*
Livereload
 */
gulp.task( 'livereload', function(){
	livereload.listen();
	gulp.watch( [ 'build/**/*', '*.html', '*.json' ], function( evt ){
		livereload.changed( evt.path );
	} );
} );


/*
Tasks
 */
gulp.task( 'default', gulpsync.async( [ [ 'css', 'critical' ], 'images', 'js', 'fonts'] ) );
gulp.task( 'dev', [ 'watch_css', 'livereload' ] );