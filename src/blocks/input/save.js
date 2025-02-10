import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import clsx from 'clsx';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';
import { getInputClassesAndStyles } from './use-field-props';

export default function save( { attributes } ) {
	const {
		type,
		advanced,
		validation,
		enableMismatch,
		mismatchMessage,
		match,
		enableAutoComplete,
		noWrapper,
		required,
		requiredText,
		label,
		showHelp,
		help,
		flatpickr,
	} = attributes;
	const blockProps = useBlockProps.save();

	const TagName = type === 'textarea' ? 'textarea' : 'input';

	const containerClass = clsx( blockProps.className );

	const fieldProps = getInputClassesAndStyles( attributes );

	// include only supported attributes
	const htmlAttrs = Object.fromEntries(
		SUPPORTED_ATTRIBUTES[ type ].map( ( col ) => [
			col,
			attributes[ col ],
		] )
	);

	Object.keys( htmlAttrs ).forEach(
		( k ) => htmlAttrs[ k ] === '' && delete htmlAttrs[ k ]
	);

	if ( validation ) {
		htmlAttrs[ 'data-bouncer-message' ] = validation;
	}

	if ( enableMismatch && mismatchMessage ) {
		htmlAttrs[ 'data-bouncer-mismatch-message' ] = mismatchMessage;
	}

	if ( enableMismatch && match ) {
		htmlAttrs[ 'data-bouncer-match' ] = match;
	}

	if ( ! enableAutoComplete ) {
		htmlAttrs.autocomplete = undefined;
	}

	if ( ( advanced && 'date' === type ) || ( advanced && 'time' === type ) ) {
		if ( required ) {
			flatpickr.allowInput = true;
		}
		htmlAttrs[ 'data-flatpickr' ] = JSON.stringify( flatpickr );
	}

	if ( noWrapper || 'hidden' === type ) {
		return (
			<input
				{ ...htmlAttrs }
				className={ fieldProps.inputClass }
				style={ fieldProps.inputStyle }
			/>
		);
	}

	if ( ! htmlAttrs.name ) {
		htmlAttrs.name = label;
	}

	return (
		<div
			{ ...useBlockProps.save() }
			className={ containerClass }
			data-wp-context
		>
			{ 'hidden' !== type && (
				<label className={ fieldProps.label } htmlFor="id">
					<RichText.Content tagName="span" value={ label } />
					{ required && (
						<span className="required" aria-hidden="true">
							{ requiredText }
						</span>
					) }
				</label>
			) }

			<TagName
				{ ...htmlAttrs }
				className={ fieldProps.inputClass }
				style={ fieldProps.inputStyle }
			/>

			<InnerBlocks.Content />

			{ 'hidden' !== type && showHelp && (
				<RichText.Content tagName="small" value={ help } />
			) }

			<div className="error-message" data-wp-text="context.error"></div>
		</div>
	);
}
