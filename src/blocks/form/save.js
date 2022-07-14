import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import classnames from 'classnames';

export default function save( { attributes, className } ) {
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
	);
}
