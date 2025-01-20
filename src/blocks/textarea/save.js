import { RichText, useBlockProps } from '@wordpress/block-editor';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';
import { getInputClassesAndStyles } from '../input/use-field-props';

export default function save( { attributes } ) {
	const { id, validation, help, value, label, required, requiredText } =
		attributes;

	const fieldProps = getInputClassesAndStyles( attributes );

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
		<div { ...useBlockProps.save() } data-wp-context>
			<label className={ fieldProps.labelClass } htmlFor={ id }>
				<RichText.Content tagName="span" value={ label } />
				{ required && (
					<span className="required" aria-hidden="true">
						{ requiredText }
					</span>
				) }
			</label>
			<textarea
				{ ...htmlAttrs }
				style={ fieldProps.inputStyle }
				className={ fieldProps.inputClass }
			>
				{ value }
			</textarea>
			<div className="error-message" data-wp-text="context.error"></div>
			{ help.length > 0 && (
				<RichText.Content tagName="small" value={ help } />
			) }
		</div>
	);
}
