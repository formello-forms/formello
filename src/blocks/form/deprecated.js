/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const blockAttributes = {
	id: {
		type: 'string',
	},
	name: {
		type: 'string',
		default: '',
	},
	successMessage: {
		type: 'string',
		default: '',
	},
	errorMessage: {
		type: 'string',
		default: '',
	},
	redirectUrl: {
		type: 'string',
		default: '',
	},
	debug: {
		type: 'boolean',
		default: false,
	},
	recaptchaEnabled: {
		type: 'boolean',
		default: false,
	},
	recaptchaVersion: {
		type: 'number',
		default: 3,
	},
	labelIsBold: {
		type: 'boolean',
		default: false,
	},
	labelAlign: {
		type: 'string',
		default: '',
	},
	requiredText: {
		type: 'string',
		default: '*',
	},
	storeSubmissions: {
		type: 'boolean',
		default: true,
	},
	hide: {
		type: 'boolean',
		default: false,
	},
	constraints: {
		type: 'array',
	},
	fields: {
		type: 'array',
	},
	formSettings: {
		type: 'object',
	},
	asRow: {
		type: 'boolean',
		default: false,
	},
	actions: {
		type: 'array',
		default: [],
	},
};

const v1 = {
	attributes: blockAttributes,
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
				<input
					type="hidden"
					name="_formello_id"
					value={ attributes.id }
				/>
				<input
					type="text"
					name={ honeypot }
					className="formello-hp"
					autoComplete="nope"
				/>
				<input type="hidden" name="action" value="formello" />
				<InnerBlocks.Content />
				<div className="formello-message"></div>
			</form>
		);
	},
};

const v2 = {
	attributes: blockAttributes,
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
				autoComplete={ attributes.autoComplete ? 'on' : 'off' }
			>
				<input
					type="hidden"
					name="_formello_id"
					value={ attributes.id }
				/>
				<input
					type="text"
					name={ honeypot }
					className="formello-hp"
					autoComplete="nope"
				/>
				<input type="hidden" name="action" value="formello" />
				<InnerBlocks.Content />
				<div className="formello-message"></div>
			</form>
		);
	},
};

const v3 = {
	attributes: blockAttributes,
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
				data-id={ attributes.id }
				data-hide={ attributes.hide || undefined }
				data-recaptcha={ attributes.recaptchaEnabled }
				data-redirect={ attributes.redirectUrl }
				noValidate
				autoComplete={ attributes.autoComplete ? 'on' : 'off' }
			>
				<input
					type="hidden"
					name="_formello_id"
					value={ attributes.id }
				/>
				<input
					type="text"
					name={ honeypot }
					className="formello-hp"
					autoComplete="nope"
				/>
				<input type="hidden" name="action" value="formello" />
				<InnerBlocks.Content />
				<div className="formello-message"></div>
			</form>
		);
	},
};

const v4 = {
	attributes: blockAttributes,
	save( { attributes, className } ) {
		const {
			asRow,
			labelAlign,
			id,
			hide,
			captchaEnabled,
			captchaType,
			redirectUrl,
			autoComplete,
			action,
			enableJsValidation,
			noValidate,
			labelIsBold,
			noAjax,
		} = attributes;

		const formClass = classnames( className, {
			'as-row': asRow,
			'formello-label-right': 'right' === labelAlign,
			'is-style-bolded': labelIsBold,
		} );

		const honeypot = '_formello_h' + id;

		return (
			<form
				{ ...useBlockProps.save( {
					className: formClass,
				} ) }
				method="post"
				data-id={ id }
				data-hide={ hide || undefined }
				data-captcha={ captchaEnabled ? captchaType : undefined }
				data-redirect={ redirectUrl || undefined }
				data-validate={ enableJsValidation || undefined }
				data-noajax={ noAjax || undefined }
				noValidate={ noValidate || undefined }
				autoComplete={ autoComplete }
				action={ action }
			>
				<input type="hidden" name="_formello_id" value={ id } />
				<input
					type="text"
					name={ honeypot }
					className="formello-hp"
					tabIndex="-1"
				/>
				<input type="hidden" name="action" value="formello" />
				<InnerBlocks.Content />
				<div
					className="formello-message"
					id={ 'formello-message-' + id }
				></div>
			</form>
		);
	},
};

const deprecated = [ v4, v3, v2, v1 ];

export default deprecated;
