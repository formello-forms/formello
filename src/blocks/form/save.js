import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import classnames from 'classnames';

export default function save( { attributes, className } ) {
	const {
		asRow,
		labelAlign,
		id,
		hide,
		recaptchaEnabled,
		redirectUrl,
		autoComplete,
		enableJsValidation,
		noValidate,
	} = attributes;

	const formClass = classnames(
		className,
		{
			'as-row': asRow,
			'formello-label-right': 'right' === labelAlign,
		}
	);

	const honeypot = '_formello_h' + id;
	return (
		<form
			{ ...useBlockProps.save( {
				className: formClass,
			} ) }
			method="post"
			data-id={ id }
			data-hide={ hide || undefined }
			data-recaptcha={ recaptchaEnabled || undefined }
			data-redirect={ redirectUrl }
			data-validate={ enableJsValidation || undefined }
			noValidate={ noValidate || undefined }
			autoComplete={ autoComplete }
		>
			<input type="hidden" name="_formello_id" value={ id } />
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
}
