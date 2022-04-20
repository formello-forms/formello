/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl, PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import {
	RichText
} from '@wordpress/block-editor';

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
export default function Label( props ) {

	const {
		attributes,
		setAttributes
	} = props;

	const labelClassName = classnames( attributes.labelClass, attributes.labelAlign, attributes.labelVAlign, {
		'hide': attributes.hideLabel,
		'required': attributes.required,
		'textarea-label': attributes.multiple || 'textarea' === attributes.type,
	} );

	return (
		<label className={ labelClassName }>

			<RichText
				tagName="span"
				value={ attributes.label }
				onChange={ ( val ) =>
					setAttributes( { label: val } )
				}
				placeholder={ __(
					'Enter label...',
					'formello'
				) }
				allowedFormats={ [
					'core/link'
				] }
			/>

			{ attributes.required && !attributes.hideRequired && (
				<span className='required'>{ attributes.requiredText }</span>
			) }		

		</label>
	);
}