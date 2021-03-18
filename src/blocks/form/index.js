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
	keywords: [ __( 'form' ), __( 'forms' ), __( 'formello' ) ],
	attributes: blockAttributes,	
	variations: variations,
	supports: {
		reusable: false,
		className: true,
		html: false
	},
	edit: edit,
	save: save,
} );
