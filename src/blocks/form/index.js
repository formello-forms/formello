import variations from './variations';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import { Form } from '../../icons/icons';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';

import './style.scss';
import './editor.scss';

registerBlockType( metadata, {
	icon: Form,
	variations,
	supports: {
		reusable: false,
		html: false,
		lock: false,
		anchor: true,
		color: true,
		interactivity: true,
		inserter: 'formello_form' === window.pagenow ? true : false,
		multiple: 'formello_form' !== window.pagenow ? true : false,
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

document.addEventListener( 'DOMContentLoaded', function () {
	if ( 'formello_form' === window.pagenow ) {
		// Your code to run since DOM is loaded and ready
		const menuRoot = document.querySelector( '#toplevel_page_formello' );
		menuRoot.classList.remove( 'wp-not-current-submenu' );
		menuRoot.classList.add(
			'wp-has-current-submenu',
			'wp-menu-open',
			'current'
		);
		menuRoot.querySelector( '.wp-first-item' ).classList.add( 'current' );
	}
} );

dispatch( 'core' ).addEntities( [
	{
		label: __( 'Formello submissions', 'formello' ),
		kind: 'formello/v1',
		name: 'submissions',
		baseURL: '/formello/v1/submissions',
		supportsPagination: true,
	},
	{
		label: __( 'Formello addons', 'formello' ),
		kind: 'formello/v1',
		name: 'addons',
		baseURL: '/formello/v1/addons',
	},
	{
		label: __( 'Formello columns', 'formello' ),
		kind: 'formello/v1',
		name: 'columns',
		baseURL: '/formello/v1/columns',
	},
	{
		label: __( 'Formello patterns', 'formello' ),
		kind: 'formello/v1',
		name: 'patterns',
		baseURL: '/formello/v1/patterns',
	},
] );
