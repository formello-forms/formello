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
import shorthandCSS from '../../../utils/shorthand-css';

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
		textColor,
		borderColor,
		text,
		alignment,
		iconType,
		iconPosition,
		customBackgroundColor,
		customTextColor,
		customBorderColor,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight
	} = attributes;

	const containerClass = classnames( className, alignment );
	const iconClass = classnames( 'ld', 'ld-spin', iconType );

	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName( 'background-color', backgroundColor );
	const borderClass = getColorClassName( 'border-color', borderColor );
	const buttonClass = classnames( 'button-span', attributes.iconPosition, {
		'has-background': backgroundColor,
		[ textClass ]: textClass,
		[ backgroundClass ]: backgroundClass,
	} );

	const style = {
		'backgroundColor': customBackgroundColor,
		'color': customTextColor,
		'borderWidth': attributes.borderWidth,
		'borderRadius': attributes.borderRadius,
		'borderColor': customBorderColor,
		//'padding': shorthandCSS( paddingTop, paddingRight, paddingBottom, paddingLeft, 'px' )
		'paddingTop': paddingTop,
		'paddingRight': paddingRight,
		'paddingBottom': paddingBottom,
		'paddingLeft': paddingLeft,
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
