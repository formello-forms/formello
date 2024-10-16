/* eslint-disable jsx-a11y/label-has-associated-control */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

export default function save( { attributes } ) {
	const {
		label,
		hideLabel,
		options,
		required,
		requiredText,
		showHelp,
		help,
	} = attributes;

	const labelClassName = clsx( 'select-label', {
		hide: hideLabel,
	} );

	const blockProps = useBlockProps.save( {
		className: 'formello',
	} );

	// include only supported attributes
	const htmlAttrs = Object.fromEntries(
		SUPPORTED_ATTRIBUTES.select.map( ( col ) => [ col, attributes[ col ] ] )
	);

	const selectedOpts = options
		.filter( ( x ) => true === x.selected )
		.map( ( x ) => x.value );

	return (
		<div { ...blockProps }>
			<label className={ labelClassName }>
				<RichText.Content tagName="span" value={ label } />
				{ required && (
					<span className="required">{ requiredText }</span>
				) }
			</label>
			<select { ...htmlAttrs } defaultValue={ selectedOpts }>
				{ options.map( ( opt, index ) => {
					return (
						<option
							value={ opt.value || opt.label }
							key={ index }
							selected={ opt.selected }
						>
							{ opt.label }
						</option>
					);
				} ) }
			</select>
			{ showHelp && <RichText.Content tagName="small" value={ help } /> }
		</div>
	);
}
