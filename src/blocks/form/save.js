/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

//const { getCurrentPostId } = wp.data.select("core/editor");

import { useState } from '@wordpress/element';
import classnames from 'classnames';

import {
	getConstraints,
	getWordpressTags,
	getFormTags,
	getOtherTags,
	getMetaTags,
} from '../components/merge-tags/functions';

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
	if( attributes.blockId ){
		attributes.constraints = getConstraints( attributes.blockId );
	}
	delete attributes['blockId']; 

	className = classnames( {
		'column': !attributes.asRow,
	} )

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
			<input type="hidden" name={ honeypot } />
			<input type="hidden" name="action" value="formello" />
			<InnerBlocks.Content />
			{
				(attributes.recaptchaEnabled && attributes.settings.recaptcha.version == 1) &&
				<div 
					class="g-recaptcha" 
					data-sitekey={ attributes.settings.recaptcha.site_key }>
				</div>
			}
		</form>
	);
}
