import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { __experimentalUseInnerBlocksProps as useInnerBlocksProps, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import {
	Button,
} from '@wordpress/components';

const ALLOWED_BLOCKS = [
	//'formello/actions-base',
	'formello/actions-email',
	//'formello/actions-mailchimp',
	'formello/actions-sendy',
	'formello/actions-getresponse',
];

import './editor.scss';

import './base/filters';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'formello/actions', {
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( 'Form actions', 'formello' ),

	/**
	 * This is a short description for your block, can be translated with `i18n` functions.
	 * It will be shown in the Block Tab in the Settings Sidebar.
	 */
	description: __(
		'Add your form actions.',
		'formello'
	),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
	 */
	category: 'formello',

	// Only allow this block when it is nested in a Formello block
	parent: [ 'formello/form' ],

	/**
	 * Block attributes
	 */
	attributes: {
	},

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: 'controls-play',

	/**
	 * Optional block extended support features.
	 */
	supports: {
		html: false,
		className: true,
	},

	/**
	 * @see ./edit.js
	 */
	edit: ({ hasChildBlocks, className }) => {
		return (
			<div className={ className }>
			<b>Form Actions</b>
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				renderAppender={ ( hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender /> ) }
			/>
			</div>
		)
	},

	/**
	 * @see ./save.js
	 */
	save: ( { attributes } ) => {
		return (
			<InnerBlocks.Content />
		);
	},
} );
