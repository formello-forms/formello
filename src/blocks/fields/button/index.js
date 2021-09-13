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

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import getIcon from '../../../utils/get-icon';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'formello/button', {
    apiVersion: 2,
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( 'Button', 'formello' ),

	/**
	 * This is a short description for your block, can be translated with `i18n` functions.
	 * It will be shown in the Block Tab in the Settings Sidebar.
	 */
	description: __(
		'Submit Button.',
		'formello'
	),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
	 */
	category: 'formello',

	// Only allow this block when it is nested in a Form block
	parent: [ 'formello/form', 'formello/input', 'core/column' ],

	/**
	 * Block attributes
	 */
	attributes: {
		form_id: {
			type: 'number'
		},
		text: {
			type: 'string',
			default: 'Submit',
		},
		iconPosition: {
			type: 'string',
			default: 'ld-ext-right',
		},
		iconType: {
			type: 'string',
			default: 'ld-ring',
		},
		alignment: {
			type: 'string',
			default: 'left',
		},
		fontSize: {
			type: 'number',
			default: '14',
		},
		backgroundColor: {
			type: 'string',
			//default: 'black'
		},
		textColor: {
			type: 'string',
			//default: 'white'
		},
		/*borderColor: {
			type: 'string',
		},
		customBorderColor: {
			type: 'string',
		},
		borderWidth: {
			type: 'numeric'
		},
		borderRadius: {
			type: 'numeric'
		},
		paddingTop: {
			type: 'string',
		},
		paddingRight: {
			type: 'string',
		},
		paddingBottom: {
			type: 'string',
		},
		paddingLeft: {
			type: 'string',
		},
		paddingUnit: {
			type: 'string',
		},
		style: {
			type: 'object'
		},*/
	},

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: getIcon('button'),

	/**
	 * Optional block extended support features.
	 */
	supports: {
		html: false,
		reusable: false,
		color: {
			gradients: true,
			__experimentalSkipSerialization: true
		},
		__experimentalBorder: {
			radius: true,
			__experimentalSkipSerialization: true
		},
		multiple: false,
		//spacing: true,
		spacing: {
			__experimentalSkipSerialization: true,
			padding: [ 'horizontal', 'vertical' ],
			__experimentalDefaultControls: {
				padding: true
			}
		},
		//__experimentalSelector: "button",
		//inserter: 'formello_form' === pagenow ? true : false,
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
