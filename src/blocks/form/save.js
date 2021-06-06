/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

import { useState } from '@wordpress/element';
import classnames from 'classnames';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( { attributes, className, innerBlocks } ) {

	className = classnames( 
		className,
		attributes.asRow
			? attributes.labelAlign
			: undefined,
		{
			'as-row': attributes.asRow,
			'is-bold': attributes.labelIsBold,
		} 
	)

	if ( !attributes.name && attributes.id ) {
		attributes.name = 'form_' + attributes.id;
	}

	let honeypot = '_formello_h' + attributes.id;
	return (
		<form className={ className } 
			id={ 'formello-' + attributes.id }
			method="post" 
			data-hide={ attributes.hide } 
			data-recaptcha={ attributes.recaptchaEnabled } 
			data-redirect={ attributes.redirectUrl } 
			data-id={ attributes.id }>
			<input type="hidden" name="_formello_id" value={ attributes.id } />
			<input type="text" name={ honeypot } className="formello-hp" autocomplete="nope" />
			<input type="hidden" name="action" value="formello" />
			<InnerBlocks.Content />
		</form>
	);
}
