import {
	RichText,
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
} from '@wordpress/block-editor';
import clsx from 'clsx';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

export default function save( { attributes } ) {
	const {
		id,
		hideLabel,
		advanced,
		validation,
		help,
		value,
		label,
		required,
		requiredText,
	} = attributes;

	const borderProps = getBorderClassesAndStyles( attributes );

	const labelClassName = clsx( {
		hide: hideLabel,
	} );

	const fieldClassName = clsx( borderProps.className, {
		'formello-rtf': advanced,
	} );

	// include only supported attributes
	const htmlAttrs = Object.fromEntries(
		SUPPORTED_ATTRIBUTES.textarea.map( ( col ) => [
			col,
			attributes[ col ],
		] )
	);

	if ( validation ) {
		htmlAttrs[ 'data-bouncer-message' ] = validation;
	}

	return (
		<div { ...useBlockProps.save() }>
			<label className={ labelClassName } htmlFor={ id }>
				<RichText.Content tagName="span" value={ label } />
				{ required && (
					<span className="required">{ requiredText }</span>
				) }
			</label>
			<textarea
				{ ...htmlAttrs }
				className={ fieldClassName }
				style={ borderProps.style }
			>
				{ value }
			</textarea>
			{ help.length > 0 && (
				<RichText.Content tagName="small" value={ help } />
			) }
		</div>
	);
}
