const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		admin: [ path.resolve( __dirname, 'src', 'admin', 'index.js' ) ],
		frontend: [
			path.resolve( __dirname, 'src', 'frontend', 'frontend.js' ),
		],
	},
	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'build' ),
	},
};
