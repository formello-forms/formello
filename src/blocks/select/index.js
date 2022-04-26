import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import getIcon from '../../utils/get-icon';
import metadata from './block.json';

registerBlockType( metadata, {
	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: getIcon( 'select' ),

	supports: {
		// eslint-disable-next-line no-undef
		inserter:
			'formello_form' === pagenow || 'popper' === pagenow ? true : false,
		html: false,
		className: false,
		reusable: false,
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
