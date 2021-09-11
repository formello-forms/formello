import { registerBlockType } from '@wordpress/blocks';

import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import Edit from './edit';
import save from './save';
import variations from './variations';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( metadata, {
    apiVersion: 2,
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( 'Fieldset', 'formello' ),

	/**
	 * This is a short description for your block, can be translated with `i18n` functions.
	 * It will be shown in the Block Tab in the Settings Sidebar.
	 */
	description: __(
		'Fieldset to group input.',
		'formello'
	),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
	 */
	category: 'formello',

	// Only allow this block when it is nested in a Columns block
	parent: [ 'formello/form' ],

	/**
	 * Block attributes
	 */
	attributes: {
		showLegend: {
			type: 'boolean',
			default: true,
		},
		hideBorder: {
			type: 'boolean',
			default: false,
		},
		legend: {
			type: 'string',
			default: '',
		},
	},

	variations: variations,

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: getIcon( 'fieldset' ),

	/**
	 * Optional block extended support features.
	 */
	supports: {
		// Removes support for an HTML mode.
		className: false,
		html: false,
		reusable: false,
		spacing: true,
		__experimentalBorder: {
			color: true,
			radius: true,
			style: true,
			width: true
		},
	},

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save
} );
