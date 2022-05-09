import { RichText, useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function save( { attributes } ) {
	const opts = attributes.selectedOpt.map( ( item ) => {
		return item.value;
	} );

	if ( ! attributes.name ) {
		attributes.name = attributes.id;
	}

	const labelClassName = classnames( {
		hide: attributes.hideLabel,
		'textarea-label': attributes.multiple,
	} );

	const blockProps = useBlockProps.save( {
		className: 'formello',
	} );

	const name = attributes.name + ( attributes.multiple ? '[]' : '' );

	return (
		<div { ...blockProps }>
			<label className={ labelClassName } htmlFor={ attributes.id }>
				{ attributes.label }
				{ attributes.required && ! attributes.hideRequired && (
					<span className="required">{ attributes.requiredText }</span>
				) }
			</label>
			<select
				id={ attributes.id }
				name={ name }
				className={ attributes.fieldClass }
				multiple={ attributes.multiple }
				defaultValue={ attributes.selectedOpt }
				required={ attributes.required }
			>
				{ attributes.options.map( ( obj, index ) => {
					return (
						<option
							value={ obj.value || obj.label }
							key={ index }
							selected={ opts.includes( obj.value ) }
						>
							{ obj.label }
						</option>
					);
				} ) }
			</select>
			{ attributes.showHelp && (
				<RichText.Content tagName="small" value={ attributes.help } />
			) }
		</div>
	);
}
