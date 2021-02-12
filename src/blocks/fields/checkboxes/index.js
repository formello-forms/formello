/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import getIcon from '../../../utils/get-icon';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'formello/checkboxes', {
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( 'Checkboxes', 'formaster' ),

	/**
	 * This is a short description for your block, can be translated with `i18n` functions.
	 * It will be shown in the Block Tab in the Settings Sidebar.
	 */
	description: __(
		'Example block written with ESNext standard and JSX support – build step required.',
		'formaster'
	),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
	 */
	category: 'formello',

	// Only allow this block when it is nested in a Columns block
	parent: [ 'formello/form', 'core/column' ],

	/**
	 * Block attributes
	 */
	attributes: {
		showLegend: {
			type: 'boolean',
			default: true,
		},
		legend: {
			type: 'string',
			default: 'Checkboxes',
		},
		options: {
			type: 'array',
			default: [
				{
					value: 'one',
					label: 'One',
				},
				{
					value: 'two',
					label: 'Two',
				},
				{
					value: 'three',
					label: 'Three',
				},
			],
		},
	},

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: getIcon( 'checkboxes' ),

	/**
	 * Optional block extended support features.
	 */
	supports: {
		// Removes support for an HTML mode.
		html: true,
		reusable: false,
	},

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save: ( { attributes } ) => {
		return (
			<fieldset>
				{ attributes.showLegend && (
					<legend>{ attributes.legend }</legend>
				) }
				<InnerBlocks.Content />
			</fieldset>
		);
	},
} );
