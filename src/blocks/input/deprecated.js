/**
 * External dependencies
 */
import { omit } from 'lodash';
import classnames from 'classnames';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const blockAttributes = {
	name: {
		type: 'string',
	},
	id: {
		type: 'string'
	},
	type: {
		type: 'string',
		default: 'text'
	},
	label: {
		type: 'string'
	},
	hideLabel: {
		type: 'boolean'
	},
	value: {
		type: 'string'
	},
	placeholder: {
		type: 'string'
	},
	required: {
		type: 'boolean'
	},
	requiredText: {
		type: 'string'
	},
	validation: {
		type: 'string'
	},
	readonly: {
		type: 'boolean'
	},
	showHelp: {
		type: 'string'
	},
	help: {
		type: 'string'
	},
	withButton: {
		type: 'boolean'
	},
	withButton: {
		type: 'boolean'
	},
	enableMismatch: {
		type: 'boolean'
	},
	enableAutoComplete: {
		type: 'boolean'
	},
	advanced: {
		type: 'boolean'
	},
	noWrapper: {
		type: 'boolean'
	},
	grouped: {
		type: 'boolean'
	},
}

const v1 = 
	{
		attributes: blockAttributes,
		save( { attributes, className } ) {

			const {
				name,
				id,
				type,
				label,
				hideLabel,
				value,
				placeholder,
				required,
				requiredText,
				readonly,
				showHelp,
				help,
				withButton,
				withOutput,
				grouped,
				validation,
				enableMismatch,
				enableAutoComplete,
				advanced,
				noWrapper,
			} = attributes;

			className = classnames( 'formello', {
				'formello-group': withButton || withOutput,
				'formello-group grouped': grouped,
				'formello-checkbox':
					'checkbox' === type || 'radio' === type,
			} );

			const labelClassName = classnames( {
				hide: hideLabel
			} );

			const fieldClassName = classnames( {
				'flatpickr': advanced && 'date' === type,
				'filepond': advanced && 'file' === type,
			} );

			// include only supported attributes
			let htmlAttrs = Object.fromEntries( SUPPORTED_ATTRIBUTES[ type ].map( col => [col, attributes[col] ] ) );

			if ( validation ) {
				htmlAttrs[ 'data-bouncer-message' ] = validation;
			}

			if ( enableMismatch && mismatchMessage ) {
				htmlAttrs[ 'data-bouncer-mismatch-message' ] = mismatchMessage;
			}

			if ( enableMismatch && match ) {
				htmlAttrs[ 'data-bouncer-match' ] = match;
			}

			if ( withOutput ) {
				htmlAttrs.oninput = 'this.nextElementSibling.value = this.value';
			}

			if ( ! enableAutoComplete ) {
				htmlAttrs.autocomplete = undefined;
			}

			if ( 'file' === type ) {
				htmlAttrs.name;
				htmlAttrs.accept = accept?.join(',');
			}

			if ( advanced && 'date' === type ) {
				htmlAttrs.type = 'text';
				Object.entries( flatpickr ).forEach( ( [ key, value ] ) => {
					htmlAttrs[ 'data-' + key ] = value;
				} );
			}

			if ( noWrapper || 'hidden' === type ) {
				return <input { ...htmlAttrs } className={ fieldClassName } />;
			}

			return (

				<div { ...useBlockProps.save() } className={ className }>
					{ 'hidden' !== type && (
						<label className={ labelClassName } htmlFor={ id }>
							{ label }
							{ required && (
								<span className="required">
									{ requiredText }
								</span>
							) }
						</label>
					) }

					<input { ...htmlAttrs } className={ fieldClassName } />

					{ withButton && <InnerBlocks.Content /> }
					{ withOutput && <output>{ value }</output> }
					{ 'hidden' !== type && showHelp && (
						<RichText.Content tagName="small" value={ help } />
					) }
				</div>
			)
		}
	};

const deprecated = [ v1 ]

export default deprecated;
