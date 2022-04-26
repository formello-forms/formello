import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import { Select } from '../../utils/icons';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType(metadata, {
	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: getIcon('select'),

	supports: {
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
});
