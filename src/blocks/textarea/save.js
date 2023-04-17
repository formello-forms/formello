import {
	RichText,
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
} from '@wordpress/block-editor';
import classnames from 'classnames';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

export default function save( { attributes } ) {
	const {
		id,
		hideLabel,
		enableRtf,
		validation,
		help,
		value,
		label,
		required,
		requiredText,
	} = attributes;

	const borderProps = getBorderClassesAndStyles( attributes );

	const wrapperClassName = classnames( 'formello' );

	const labelClassName = classnames( 'textarea-label', {
		hide: hideLabel,
	} );

	const fieldClassName = classnames( borderProps.className, {
		'formello-rtf': enableRtf,
	} );

	// include only supported attributes
	const htmlAttrs = Object.fromEntries( SUPPORTED_ATTRIBUTES.textarea.map( ( col ) => [ col, attributes[ col ] ] ) );

	if ( validation ) {
		htmlAttrs[ 'data-bouncer-message' ] = validation;
	}

	return (
		<div { ...useBlockProps.save() } className={ wrapperClassName }>
			<label className={ labelClassName } htmlFor={ id }>
				<RichText.Content tagName="span" value={ label } />
				{ required && (
					<span className="required">
						{ requiredText }
					</span>
				) }
			</label>
			<textarea { ...htmlAttrs } className={ fieldClassName } style={ borderProps.style }>
				{ value }
			</textarea>
			{ help.length > 0 && (
				<RichText.Content tagName="small" value={ help } />
			) }
		</div>
	);
}
