import clsx from 'clsx';
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
	const { text, alignment, type, noWrapper } = attributes;

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

	const borderProps = getBorderClassesAndStyles( attributes );
	const colorProps = getColorClassesAndStyles( attributes );

	const buttonClasses = clsx(
		'wp-element-button',
		borderProps.className,
		colorProps.className
	);

	if ( noWrapper ) {
		return (
			<button
				type="submit"
				{ ...useBlockProps.save( {
					className: buttonClasses,
					style: colorProps.style,
				} ) }
			>
				<RichText.Content tagName="span" value={ text } />
				<ButtonIcon />
			</button>
		);
	}

	return (
		<div
			{ ...useBlockProps.save( {
				className: alignment,
			} ) }
		>
			<button
				type="submit"
				className={ buttonClasses }
				style={ colorProps.style }
			>
				<RichText.Content tagName="span" value={ text } />
				<ButtonIcon />
			</button>
		</div>
	);
}
