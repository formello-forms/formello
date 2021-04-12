/**
 * Block: Form
 */

import variations from './variations';
import edit from './edit';
import save from './save';
import getIcon from '../../utils/get-icon';
import blockAttributes from './attributes';

const { __ } = wp.i18n;
import { registerBlockType } from '@wordpress/blocks';

/**
 * Register our Form block.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'formello/form', {
	title: __( 'Form', 'formello' ),
	description: __( 'Drive conversions with beautiful forms.', 'formello' ),
	icon: getIcon( 'form' ),
	category: 'formello',
	example: {},
	keywords: [ __( 'form' ), __( 'forms' ), __( 'formello' ) ],
	attributes: blockAttributes,	
	variations: variations,
	supports: {
		reusable: false,
		className: true,
		html: false,
		spacing: {
			padding: true,
		}
	},
	styles: [
		//{ name: 'normal', label: __( 'Normal' ), isDefault: true },
		//{ name: 'medium', label: __( 'Medium' ) },
		//{ name: 'big', label: __( 'Big' ) },
	],
	example: {
		innerBlocks: [
			{
				name: 'formello/input',
				attributes: {
					/* translators: example text. */
					label: __(
						'Name'
					),
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
					label: __(
						'Message'
					),
					type: 'textarea'
				},
			},
			{
				name: 'formello/button',
				attributes: {
					/* translators: example text. */
					text: __(
						'Submit'
					),
				},
			},
		],
	},
	edit: edit,
	save: save,
} );
