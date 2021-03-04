/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import getIcon from '../../../utils/get-icon';

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'formello/input-button',
		title: __( 'Input with button' ),
		description: __( 'Display an input with a button on same row.' ),
		icon: getIcon( 'input-button' ),
		isDefault: true,
		innerBlocks: [ [ 'formello/input', { type: 'email', label: 'Email' } ], [ 'formello/button' ] ],
		scope: [ 'inserter' ],
	},
	{
		name: 'formello/range-output',
		title: __( 'Input range with value' ),
		description: __( 'Display an output field with the value of the range selected.' ),
		icon: getIcon( 'range' ),
		innerBlocks: [ 
			[ 'formello/input', { type: 'range', label: 'Range' } ],
			[ 'formello/output' ] 
		],
		scope: [ 'inserter' ],
	}
];

/**
 * Add `isActive` function to all `embed` variations, if not defined.
 * `isActive` function is used to find a variation match from a created
 *  Block by providing its attributes.
 */
variations.forEach( ( variation ) => {
	if ( variation.isActive ) return;
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.type ===
		variationAttributes.type;
} );

export default variations;