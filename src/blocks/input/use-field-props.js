import {
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
} from '@wordpress/block-editor';
import clsx from 'clsx';

export function getInputClassesAndStyles( attributes ) {
	const borderProps = getBorderClassesAndStyles( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );
	const colorProps = getColorClassesAndStyles( attributes );

	const { name, type, advanced, hideLabel } = attributes;

	const containerClass = clsx( {
		'missing-name': ! name,
	} );

	const labelClass = clsx( {
		hide: hideLabel,
		'textarea-label': 'textarea' === type,
	} );

	const inputClass = clsx(
		borderProps.className,
		spacingProps.className,
		colorProps.className,
		{
			'formello-advanced': advanced,
		}
	);

	const inputStyle = {
		...borderProps.style,
		...spacingProps.style,
		...colorProps.style,
	};

	return {
		containerClass,
		labelClass,
		inputClass,
		inputStyle,
	};
}
