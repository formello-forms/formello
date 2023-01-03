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
		autoComplete
	} = attributes;

	className = classnames(
		asRow ? labelAlign : undefined,
		{
			'as-row': asRow,
			'formello-label-right': 'right' === labelAlign,
		}
	);

	const honeypot = '_formello_h' + id;
	return (
		<form
			{ ...useBlockProps.save( {
				className,
			} ) }
			method="post"
			id={ 'formello-' + id }
			data-id={ 'formello-' + id }
			data-hide={ hide }
			data-recaptcha={ recaptchaEnabled }
			data-redirect={ redirectUrl }
			novalidate
			autocomplete={ autoComplete }
		>
			<input type="hidden" name="_formello_id" value={ id } />
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
