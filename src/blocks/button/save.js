/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { 
	getColorClassName,
	useBlockProps,
	RichText,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles
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
export default function save( { attributes } ) {

	const {
		text,
		alignment,
		iconType,
		iconPosition,
		style
	} = attributes;

	const borderRadius = style?.border?.radius;
	const borderColor = style?.border?.color;
	const borderProps = getBorderClassesAndStyles( attributes );

	// Check for old deprecated numerical border radius. Done as a separate
	// check so that a borderRadius style won't overwrite the longhand
	// per-corner styles.
	if ( typeof borderRadius === 'number' ) {
		borderProps.style.borderRadius = `${ borderRadius }px`;
	}

	const colorProps = getColorClassesAndStyles( attributes );

	//const iconClass = classnames( 'ld', 'ld-spin', attributes.iconType );

	const buttonClasses = classnames(
		colorProps.className,
		attributes.iconPosition,
		attributes.alignment
	);
	const buttonStyles = {
		...colorProps.style,
		...borderProps.style
	};

	const blockProps = useBlockProps.save({
		className: buttonClasses
	});

	return (
		<button 
			className={ buttonClasses } 
			//style={ buttonStyles }
			type="submit"
			{...blockProps}
		>
        	{ text }
		</button>
	);
}
