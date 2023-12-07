const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		index: [ path.resolve( __dirname, 'src', '', 'index.js' ) ],
		admin: [ path.resolve( __dirname, 'src', 'admin', 'index.js' ) ],
		frontend: [
			path.resolve( __dirname, 'src', 'frontend', 'frontend.js' ),
		],
	},
};
