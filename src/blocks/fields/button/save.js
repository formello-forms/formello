/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { 
	getColorClassName 
} from '@wordpress/block-editor';
import hexToRGBA from '../../../utils/hex-to-rgba';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( { attributes, className } ) {

	const {
		backgroundColor,
		backgroundColorOpacity,
		backgroundColorHover,
		backgroundColorHoverOpacity,
		textColor,
		textColorHover,
		borderColor,
		borderColorOpacity,
		borderColorHover,
		borderColorHoverOpacity,
		text,
		alignment,
		iconType,
		iconPosition
	} = attributes;

	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName( 'background-color', backgroundColor );
	const buttonClass = classnames( textClass, backgroundClass, iconPosition, {
		'has-text-color': textColor || style?.color?.text,
		'has-background-color': backgroundColor || style?.color?.background
	} )
	const containerClass = classnames( className, alignment );
	const iconClass = classnames( 'ld', 'ld-spin', iconType );
	const style = {
		color: textColor ? hexToRGBA( textColor ) : undefined,
		backgroundColor: backgroundColor ? hexToRGBA( backgroundColor, backgroundColorOpacity ) : undefined,
		borderColor: borderColor ? hexToRGBA( borderColor, borderColorOpacity ) : undefined
	}

	return (
		<div className={ containerClass }>
			<button 
				type="submit" 
				className={ buttonClass }
				style={ style }
			>
				<span>{ text }</span>
				<div className={ iconClass }></div>
			</button>
		</div>
	);
}
