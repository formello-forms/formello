const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		index: [ path.resolve( __dirname, 'src', '', 'index.js' ) ],
		settings: [ path.resolve( __dirname, 'src', 'settings', 'index.js' ) ],
		addons: [ path.resolve( __dirname, 'src', 'settings/addons', 'index.js' ) ],
		submission: [ path.resolve( __dirname, 'src', 'submission', 'index.js' ) ],
		frontend: [ path.resolve( __dirname, 'src', 'frontend', 'frontend.js' ) ],
	},
};
