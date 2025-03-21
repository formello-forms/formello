/**
 * External dependencies
 */
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
		type: 'string',
	},
	type: {
		type: 'string',
		default: 'text',
	},
	label: {
		type: 'string',
	},
	hideLabel: {
		type: 'boolean',
	},
	value: {
		type: 'string',
	},
	placeholder: {
		type: 'string',
	},
	required: {
		type: 'boolean',
	},
	requiredText: {
		type: 'string',
	},
	validation: {
		type: 'string',
	},
	readonly: {
		type: 'boolean',
	},
	showHelp: {
		type: 'string',
	},
	help: {
		type: 'string',
	},
	withButton: {
		type: 'boolean',
	},
	enableMismatch: {
		type: 'boolean',
	},
	enableAutoComplete: {
		type: 'boolean',
	},
	advanced: {
		type: 'boolean',
	},
	noWrapper: {
		type: 'boolean',
	},
	grouped: {
		type: 'boolean',
	},
};

const v1 = {
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
			mismatchMessage,
			match,
		} = attributes;

		className = classnames( 'formello', {
			'formello-group': withButton || withOutput,
			'formello-group grouped': grouped,
			'formello-checkbox': 'checkbox' === type || 'radio' === type,
		} );

		const labelClassName = classnames( {
			hide: hideLabel,
		} );

		const fieldClassName = classnames( {
			flatpickr: advanced && 'date' === type,
			filepond: advanced && 'file' === type,
		} );

		// include only supported attributes
		const htmlAttrs = Object.fromEntries(
			SUPPORTED_ATTRIBUTES[ type ].map( ( col ) => [
				col,
				attributes[ col ],
			] )
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

		if ( withOutput ) {
			htmlAttrs.oninput = 'this.nextElementSibling.value = this.value';
		}

		if ( ! enableAutoComplete ) {
			htmlAttrs.autocomplete = undefined;
		}

		if ( 'file' === type ) {
			htmlAttrs.name;
			htmlAttrs.accept = accept?.join( ',' );
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
							<span className="required">{ requiredText }</span>
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
		);
	},
};

const blockAttributesV2 = {
	type: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'type',
		default: 'text',
	},
	id: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'id',
	},
	name: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'name',
	},
	label: {
		type: 'string',
		source: 'html',
		selector: 'label span:not(.required)',
		default: 'Label',
		__experimentalRole: 'content',
	},
	hideLabel: {
		type: 'boolean',
		selector: 'label.hide',
		default: false,
	},
	placeholder: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'placeholder',
		__experimentalRole: 'content',
	},
	value: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'value',
	},
	validation: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'data-bouncer-message',
		default: '',
	},
	enableMismatch: {
		type: 'boolean',
		default: false,
	},
	mismatchMessage: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'data-bouncer-mismatch-message',
		default: '',
	},
	match: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'data-bouncer-match',
	},
	required: {
		type: 'boolean',
		source: 'attribute',
		selector: 'input',
		attribute: 'required',
		default: false,
	},
	requiredText: {
		type: 'string',
		source: 'text',
		selector: 'label span.required',
		default: '*',
	},
	enableAutoComplete: {
		type: 'boolean',
		default: false,
	},
	autocomplete: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'autocomplete',
		default: 'off',
	},
	disabled: {
		type: 'boolean',
		source: 'attribute',
		selector: 'input',
		attribute: 'disabled',
		default: false,
	},
	readonly: {
		type: 'boolean',
		source: 'attribute',
		selector: 'input',
		attribute: 'readonly',
		default: false,
	},
	checked: {
		type: 'boolean',
		source: 'attribute',
		selector: 'input',
		attribute: 'checked',
		default: false,
	},
	multiple: {
		type: 'boolean',
		source: 'attribute',
		selector: 'input',
		attribute: 'multiple',
		default: false,
	},
	showHelp: {
		type: 'boolean',
		default: false,
	},
	help: {
		type: 'string',
		default: '',
	},
	minlength: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'minlength',
	},
	maxlength: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'maxlength',
	},
	pattern: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'pattern',
	},
	min: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'min',
	},
	max: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'max',
	},
	withButton: {
		type: 'boolean',
		default: false,
	},
	grouped: {
		type: 'boolean',
		default: false,
	},
	withOutput: {
		type: 'boolean',
		default: false,
	},
	noWrapper: {
		type: 'boolean',
		default: false,
	},
	step: {
		type: 'number',
		source: 'attribute',
		selector: 'input',
		attribute: 'step',
	},
	dateFormat: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'data-date-format',
	},
	minDate: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'data-min-date',
	},
	timeFormat: {
		type: 'string',
		source: 'attribute',
		selector: 'input',
		attribute: 'data-time-format',
	},
	enableTime: {
		type: 'boolean',
	},
	inlineCalendar: {
		type: 'boolean',
	},
	mode: {
		type: 'string',
		source: 'attribute',
		attribute: 'data-mode',
	},
	advanced: {
		type: 'boolean',
	},
};

const deprecated = [ v1 ];

export default deprecated;
