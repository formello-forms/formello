import { registerBlockType, createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import variations from './variations';
import metadata from './block.json';
import { Fieldset } from '../../icons/icons';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( metadata, {
	variations,

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: Fieldset,

	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'formello/select' ],
				transform: ( attrs ) => {
					const { type, ...restAttrs } = attrs;
					return createBlock( 'formello/select', restAttrs );
				},
			},
		],
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
