import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { Textarea } from '../../icons/icons';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( metadata, {

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'formello/input' ],
				transform: ( attributes ) => {
					return createBlock( 'formello/textarea', attributes );
				},
			},
		],
	},

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: Textarea,

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
