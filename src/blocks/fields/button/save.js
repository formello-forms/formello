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

	const textClass = getColorClassName( 'color', attributes.textColor );
	const backgroundClass = getColorClassName( 'background-color', attributes.backgroundColor );
	const buttonClass = classnames( textClass, backgroundClass, 'ld-ext-right', {
		'has-text-color': attributes.textColor || attributes.style?.color?.text,
		'has-background-color': attributes.backgroundColor || attributes.style?.color?.background
	} )
	const containerClass = classnames( className, attributes.alignment );
	const iconClass = classnames( 'ld', 'ld-spin', attributes.iconType );

	return (
		<div className={ containerClass }>
			<button 
				type="submit" 
				className={ buttonClass }
				style={ attributes.style }
			>
				<span>{ attributes.text }</span>
				<div className={ iconClass }></div>
			</button>
		</div>
	);
}
