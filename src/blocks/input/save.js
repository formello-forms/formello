import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classnames from 'classnames';
import { pickBy, identity, pick } from 'lodash';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

export default function save( { attributes, className } ) {
	// if value is empty assign undefined;
	if ( 'checkbox' === attributes.type || 'radio' === attributes.type ) {
		attributes.value = attributes.value ? attributes.value : undefined;
	}

	if ( ! attributes.name ) {
		attributes.name = attributes.id;
	}

	className = classnames( 'formello', {
		'formello-group': attributes.withButton || attributes.withOutput,
		'formello-group grouped': attributes.grouped,
		'formello-checkbox':
			'checkbox' === attributes.type || 'radio' === attributes.type,
	} );

	const labelClassName = classnames( {
		hide: attributes.hideLabel,
		'textarea-label': 'textarea' === attributes.type,
	} );

	const fieldClassName = classnames( {
		'formello-rtf': attributes.enableRtf && 'textarea' === attributes.type,
		flatpickr: attributes.advancedDate && 'date' === attributes.type,
	} );

	// include only supported attributes
	let htmlAttrs = pick( attributes, SUPPORTED_ATTRIBUTES[ attributes.type ] );
	// clean empty attributes
	htmlAttrs = pickBy( htmlAttrs, identity );

	if ( attributes.validation ) {
		htmlAttrs[ 'data-bouncer-message' ] = attributes.validation;
	}

	if ( attributes.withOutput ) {
		htmlAttrs.oninput = 'this.nextElementSibling.value = this.value';
	}

	if ( attributes.advancedDate ) {
		htmlAttrs.type = 'text';
		Object.entries( attributes.flatpickr ).forEach( ( [ key, value ] ) => {
			htmlAttrs[ 'data-' + key ] = value;
		} );
	}

	if ( attributes.noWrapper || 'hidden' === attributes.type ) {
		return <input { ...htmlAttrs } />;
	}

	return (
		<div { ...useBlockProps.save() } className={ className }>
			{ 'hidden' !== attributes.type && (
				<label className={ labelClassName } htmlFor={ attributes.id }>
					{ attributes.label }
					{ attributes.required && ! attributes.hideRequired && (
						<span className="required">
							{ attributes.requiredText }
						</span>
					) }
				</label>
			) }
			{ 'textarea' === attributes.type ? (
				<textarea { ...htmlAttrs } className={ fieldClassName }>
					{ attributes.value }
				</textarea>
			) : (
				<input { ...htmlAttrs } className={ fieldClassName } />
			) }
			{ attributes.withButton && <InnerBlocks.Content /> }
			{ attributes.withOutput && <output></output> }
			{ 'hidden' !== attributes.type && attributes.showHelp && (
				<RichText.Content tagName="small" value={ attributes.help } />
			) }
		</div>
	);
}
