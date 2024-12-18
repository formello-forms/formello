import { registerBlockType, createBlock } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import variations from './variations';
import deprecated from './deprecated';
import metadata from './block.json';
import { Input } from '../../icons/icons';

import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( metadata, {
	variations,

	deprecated,

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'formello/textarea' ],
				transform: ( attrs ) => {
					return createBlock( 'formello/input', attrs );
				},
			},
		],
	},

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: Input,

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
