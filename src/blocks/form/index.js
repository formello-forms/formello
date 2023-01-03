/**
 * Block: Form
 */

import variations from './variations';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import { ReactComponent as Form } from '../../../assets/icons/form.svg';
import metadata from './block.json';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Register our Form block.
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( metadata, {
	icon: Form,
	variations,
	supports: {
		reusable: false,
		className: true,
		multiple: false,
		html: false,
		lock: false,
		// eslint-disable-next-line
		inserter:
			'formello_form' === pagenow || 'popper' === pagenow ? true : false,
		spacing: {
			padding: true,
		},
	},
	example: {
		innerBlocks: [
			{
				name: 'formello/input',
				attributes: {
					/* translators: example text. */
					label: __( 'Name' ),
				},
			},
			{
				name: 'formello/input',
				attributes: {
					label: 'Email',
				},
			},
			{
				name: 'formello/input',
				attributes: {
					/* translators: example text. */
					label: __( 'Message' ),
					type: 'textarea',
				},
			},
			{
				name: 'formello/button',
				attributes: {
					/* translators: example text. */
					text: __( 'Submit' ),
				},
			},
		],
	},
	deprecated,
	edit,
	save
} );
