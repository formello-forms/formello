/* eslint-disable jsx-a11y/label-has-associated-control */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';
import { getInputClassesAndStyles } from '../input/use-field-props';

export default function save( { attributes } ) {
	const { label, options, required, requiredText, showHelp, help } =
		attributes;

	const fieldProps = getInputClassesAndStyles( attributes );

	const blockProps = useBlockProps.save();

	// include only supported attributes
	const htmlAttrs = Object.fromEntries(
		SUPPORTED_ATTRIBUTES.select.map( ( col ) => [ col, attributes[ col ] ] )
	);

	const selectedOpts = options
		.filter( ( x ) => true === x.selected )
		.map( ( x ) => x.value );

	return (
		<div { ...blockProps } data-wp-context>
			<label className={ fieldProps.labelClass }>
				<RichText.Content tagName="span" value={ label } />
				{ required && (
					<span className="required" aria-hidden="true">
						{ requiredText }
					</span>
				) }
			</label>
			<select
				{ ...htmlAttrs }
				defaultValue={ selectedOpts }
				style={ fieldProps.inputStyle }
				className={ fieldProps.inputClass }
			>
				{ options.map( ( opt, index ) => {
					return (
						<option
							value={ opt.value || index > 0 ? opt.label : '' }
							key={ index }
							selected={ opt.selected }
						>
							{ opt.label }
						</option>
					);
				} ) }
			</select>
			<div className="error-message" data-wp-text="context.error"></div>
			{ showHelp && <RichText.Content tagName="small" value={ help } /> }
		</div>
	);
}
