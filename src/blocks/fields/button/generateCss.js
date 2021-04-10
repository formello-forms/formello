/* eslint-disable quotes */
import buildCSS from '../../../utils/build-css';
import shorthandCSS from '../../../utils/shorthand-css';
import hexToRGBA from '../../../utils/hex-to-rgba';

import {
	Component,
} from '@wordpress/element';

import {
	applyFilters,
} from '@wordpress/hooks';

export default function MainCSS ( props ) {

	const {
		backgroundColor,
		backgroundColorOpacity,
		color,
		backgroundColorHover,
		backgroundColorHoverOpacity,
		colorHover,
		fontFamily,
		fontFamilyFallback,
		fontWeight,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		marginUnit,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		paddingUnit,
		borderSizeTop,
		borderSizeRight,
		borderSizeBottom,
		borderSizeLeft,
		borderRadiusTopRight,
		borderRadiusBottomRight,
		borderRadiusBottomLeft,
		borderRadiusTopLeft,
		borderRadius,
		borderColor,
		borderWidth,
		borderColorOpacity,
		borderColorHover,
		borderColorHoverOpacity,
		fontSize
	} = props;

	let selector = '#' + props.formid + ' .wp-block-formello-button button';

	let cssObj = [];

	cssObj[ selector ] = [ {
		'color': color ? hexToRGBA( color ) : undefined,
		'background-color': backgroundColor ? hexToRGBA( backgroundColor, backgroundColorOpacity ) : undefined,
		'border-color': borderColor ? hexToRGBA( borderColor ) : undefined,
		'font-size': fontSize ? fontSize + 'px' : undefined
	} ];

	if ( borderRadius ) {
		cssObj[ selector ].push( {
			'border-radius': borderRadius + 'px'
		} );
	}

	if ( borderWidth || borderRadius ) {
		cssObj[ selector ].push( {
			'border-width': borderWidth + 'px',
			'border-style': 'solid',
			'border-radius': borderRadius,
		} );
	}

	if ( paddingTop || paddingRight || paddingBottom || paddingLeft ) {
		cssObj[ selector ].push( {
			'padding': shorthandCSS( paddingTop, paddingRight, paddingBottom, paddingLeft, 'px' ),
		} );
	}

	cssObj[ selector + `:hover, ` + 
	selector + `:focus, ` + 
	selector + `:active` ] = [ {
		'background-color': hexToRGBA( backgroundColorHover, backgroundColorHoverOpacity ),
		'color': colorHover, // eslint-disable-line quote-props
		'border-color': hexToRGBA( borderColorHover, borderColorHoverOpacity ),
	} ];

	return (
		<style>{ buildCSS( cssObj ) }</style>
	);
}
/* eslint-enable quotes */