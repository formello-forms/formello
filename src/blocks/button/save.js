import classnames from 'classnames';
import {
	useBlockProps,
	RichText,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
} from '@wordpress/block-editor';
import {
	Loading,
	Loading2,
	Pulse,
	Loading4,
	LoadingCircles,
	LoadingCirclePath,
	Audio,
	BallTriangle,
	Bars,
	Circles,
	Grid,
	ThreeDots,
} from '../../icons/loading';

export default function save( { attributes } ) {
	const { text, alignment, type, style } = attributes;

	const icons = {
		Loading,
		Loading2,
		Pulse,
		Loading4,
		LoadingCircles,
		LoadingCirclePath,
		Audio,
		BallTriangle,
		Bars,
		Circles,
		Grid,
		ThreeDots,
	};

	const ButtonIcon = icons[ type ];
	const borderRadius = style?.border?.radius;
	const borderProps = getBorderClassesAndStyles( attributes );

	// Check for old deprecated numerical border radius. Done as a separate
	// check so that a borderRadius style won't overwrite the longhand
	// per-corner styles.
	if ( typeof borderRadius === 'number' ) {
		borderProps.style.borderRadius = `${ borderRadius }px`;
	}

	const colorProps = getColorClassesAndStyles( attributes );

	const buttonClasses = classnames(
		borderProps.className,
		colorProps.className,
		alignment
	);

	const blockProps = useBlockProps.save( {
		className: buttonClasses,
		style: colorProps.style,
	} );

	return (
		<button type="submit" { ...blockProps }>
			<RichText.Content tagName="span" value={ text } />
			<ButtonIcon />
		</button>
	);
}
