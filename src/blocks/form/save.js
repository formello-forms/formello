import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import classnames from 'classnames';

export default function save( { attributes, className } ) {
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
}
