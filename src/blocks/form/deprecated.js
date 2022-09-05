/**
 * External dependencies
 */
import { omit } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const blockAttributes = {
		id: {
			type: 'number'
		},
		name: {
			type: 'string',
			default: ''
		},
		successMessage: {
			type: 'string',
			default: ''
		},
		errorMessage: {
			type: 'string',
			default: ''
		},
		redirectUrl: {
			type: 'string',
			default: ''
		},
		debug: {
			type: 'boolean',
			default: false
		},
		recaptchaEnabled: {
			type: 'boolean',
			default: false
		},
		recaptchaVersion: {
			type: 'number',
			default: 3
		},
		labelIsBold: {
			type: 'boolean',
			default: false
		},
		labelAlign: {
			type: 'string',
			default: ''
		},
		requiredText: {
			type: 'string',
			default: '*'
		},
		storeSubmissions: {
			type: 'boolean',
			default: true
		},
		hide: {
			type: 'boolean',
			default: false
		},
		constraints: {
			type: 'array'
		},
		fields: {
			type: 'array'
		},
		formSettings: {
			type: 'object'
		},
		asRow: {
			type: 'boolean',
			default: false
		},
		actions: {
			type: 'array',
			default: []
		}		
}

const deprecated = [
	{
		attributes: {
			id: {
				type: 'number',
			},
			asRow: {
				type: 'boolean',
			},
			labelAlign: {
				type: 'string',
			},
			labelIsBold: {
				type: 'boolean',
			},
			recaptchaEnabled: {
				type: 'boolean',
			},
			hide: {
				type: 'boolean',
			},
			redirectUrl: {
				type: 'string',
			},
		},
		save( { attributes, className } ) {
			className = classnames(
				//blockProps.className,
				attributes.asRow ? attributes.labelAlign : undefined,
				{
					'as-row': attributes.asRow,
					'is-bold': attributes.labelIsBold,
					'formello-label-right': 'right' === attributes.labelAlign,
				}
			);
			const honeypot = '_formello_h' + attributes.id;

			return (
				<form
					{ ...useBlockProps.save( {
						className,
					} ) }
					method="post"
					id={ 'formello-' + attributes.id }
					data-id={ 'formello-' + attributes.id }
					data-hide={ attributes.hide }
					data-recaptcha={ attributes.recaptchaEnabled }
					data-redirect={ attributes.redirectUrl }
					noValidate
				>
					<input type="hidden" name="_formello_id" value={ attributes.id } />
					<input
						type="text"
						name={ honeypot }
						className="formello-hp"
						autocomplete="nope"
					/>
					<input type="hidden" name="action" value="formello" />
					<InnerBlocks.Content />
					<div className="formello-message"></div>
				</form>
			)

		},
	},
];

export default deprecated;
