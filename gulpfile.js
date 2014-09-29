
var gulp = require( 'gulp' ),
	sass = require( 'gulp-ruby-sass' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	imagemin = require( 'gulp-imagemin' ),
	uglify = require( 'gulp-uglify' ),
	rename = require( 'gulp-rename' ),
	shell = require( 'gulp-shell' ),
	plumber = require( 'gulp-plumber' ),
	merge_stream = require( 'merge-stream' );

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

	return gulp.src( 'sass/**/*.scss', { base: 'sass' } )
		.pipe( plumber( plumber_config ) )
		.pipe( sass( sass_config ) )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( 'build/css' ) );

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

/*
Tasks
 */
gulp.task( 'default', ['css', 'images', 'js', 'fonts'] );