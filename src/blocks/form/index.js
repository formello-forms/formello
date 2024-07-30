import variations from './variations';
import edit from './edit/index.js';
import './actions/email.js';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import { Form } from '../../icons/icons';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './editor.scss';

registerBlockType( metadata, {
	icon: Form,
	variations,
	supports: {
		reusable: false,
		className: true,
		html: false,
		lock: false,
		anchor: true,
		color: true,
		interactivity: true,
		inserter: 'formello_form' === window.pagenow ? true : false,
		multiple: 'formello_form' !== window.pagenow ? true : false,
		// eslint-disable-next-line
		spacing: {
			padding: true,
		},
		typography: {
			fontSize: true,
			__experimentalFontWeight: true,
			__experimentalTextDecoration: false,
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
	save,
} );
