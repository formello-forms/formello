import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { createBlock } from '@wordpress/blocks';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata, {

	transforms: {
	    from: [
	        {
	            type: 'raw',
	            isMatch: ( node ) =>
	                node.nodeName === 'BUTTON',
	            transform: ( node ) => {
	                return createBlock( 'formello/button' );
	            },
	        },
	    ],
	},

	icon: {
	    // Specifying a background color to appear with the icon e.g.: in the inserter.
	    background: '#fff',
	    // Specifying a color for the icon (optional: if not set, a readable color will be automatically defined)
	    foreground: '#000000',
	   	
	   	src: 'button'

	},

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
