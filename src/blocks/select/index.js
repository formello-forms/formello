import { registerBlockType, createBlock } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { ReactComponent as Icon } from '../../../assets/icons/select.svg';

import './style.scss';

registerBlockType( metadata, {
	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: Icon,

	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'formello/multichoices' ],
				transform: ( attrs ) => {
					const { name, type, required, options } = attrs;
					return createBlock( 'formello/multichoices', {
						name,
						type,
						required,
						options,
					} );
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
