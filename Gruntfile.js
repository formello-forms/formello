module.exports = function( grunt ) {
	'use strict';

	const pkgInfo = grunt.file.readJSON( 'package.json' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		copy: {
			main: {
				options: {
					mode: true,
				},
				src: [
					'**',
					'!node_modules/**',
					'!src/**',
					'!css/sourcemap/**',
					'!.git/**',
					'!.github/**',
					'!bin/**',
					'!.gitlab-ci.yml',
					'!cghooks.lock',
					'!tests/**',
					'!*.sh',
					'!*.map',
					'!Gruntfile.js',
					'!package.json',
					'!.gitignore',
					'!phpunit.xml',
					'!README.md',
					'!sass/**',
					'!scoper.inc.php',
					'!config.json',
					'!composer.json',
					'!composer.lock',
					'!package-lock.json',
					'!phpcs.xml.dist',
				],
				dest: 'formello/',
			},
		},

		compress: {
			main: {
				options: {
					archive: 'formello-' + pkgInfo.version + '.zip',
					mode: 'zip',
					level: 5,
				},
				files: [
					{
						src: [
							'./formello/**',
						],
					},
				],
			},
		},

		clean: {
			main: [ 'formello' ],
			zip: [ '*.zip' ],
		},
	} );

	// Load grunt tasks
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );

	// Grunt release - Create installable package of the local files
	grunt.registerTask( 'package', [ 'clean:zip', 'copy:main', 'compress:main', 'clean:main' ] );

	grunt.util.linefeed = '\n';
};