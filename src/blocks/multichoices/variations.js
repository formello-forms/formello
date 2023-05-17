/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Checkboxes,
	Radios,
} from '../../icons/icons';

const variations = [
	{
		name: 'checkboxes',
		title: __( 'Multiple choices (Checkboxes)' ),
		description: __( 'Offer users a list of choices, and allow them to select multiple option.', 'formello-pro' ),
		icon: Checkboxes,
		attributes: {
			type: 'checkbox'
		},
		scope: [ 'inserter', 'block', 'transform' ],
		isDefault: true
	},
	{
		name: 'radios',
		title: __( 'Single choice (Radio)' ),
		description: __( 'Offer users a list of choices, and allow them to select a single option.', 'formello-pro' ),
		icon: Radios,
		attributes: {
			type: 'radio'
		},
		scope: [ 'inserter', 'block', 'transform' ],
	},
];

/**
 * Add `isActive` function to all `embed` variations, if not defined.
 * `isActive` function is used to find a variation match from a created
 *  Block by providing its attributes.
 */
variations.forEach( ( variation ) => {
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.type === variationAttributes.type;
} );

export default variations;
