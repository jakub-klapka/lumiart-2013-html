module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		sass: {
			options: {
				compass: true,
				style: 'compressed'
			},
			all_files: {
				files: [{
					expand: true,
					cwd: 'sass',
					src: '*.scss',
					dest: 'css',
					ext: '.css'
				}]
			}
		},
		autoprefixer: {
			all_files: {
				files: [{
					expand: true,
					cwd: 'css',
					src: '*.css',
					dest: 'css'
				}]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');

	grunt.registerTask('css', ['sass:all_files', 'autoprefixer:all_files']);

	// Default task(s).
	grunt.registerTask('default', ['css']);

};