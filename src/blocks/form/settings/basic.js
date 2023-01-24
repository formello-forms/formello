import { __, sprintf } from '@wordpress/i18n';

import { Fragment, RawHTML } from '@wordpress/element';

import {
	TextControl,
	ToggleControl,
	Notice,
	PanelBody,
	TextareaControl,
	BaseControl
} from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

import {
	URLInput,
} from '@wordpress/block-editor';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */
export function Settings( props ) {
	const { attributes, setAttributes, clientId } = props;

	const { 
		storeSubmissions, 
		recaptchaEnabled, 
		hide, redirectUrl, 
		successMessage, 
		errorMessage 
	} = attributes;

	const settingsUrl = addQueryArgs( 'edit.php', {
		post_type: 'formello_form',
		page: 'formello-settings',
	} ) + '#/recaptcha';
	
	return (
		<PanelBody
			title={ __( 'Settings', 'formello' ) }
			initialOpen={ true }
		>
			<ToggleControl
				label={ __( 'Store submissions', 'formello' ) }
				checked={ storeSubmissions }
				onChange={ ( val ) => {
					setAttributes( { storeSubmissions: val } );
				} }
			/>
			<ToggleControl
				label={ __( 'Enable ReCaptcha', 'formello' ) }
				checked={ recaptchaEnabled }
				onChange={ ( val ) => {
					setAttributes( { recaptchaEnabled: val } );
				} }
			/>
			{ ( '' === formello.settings.reCaptcha.site_key ||
				'' === formello.settings.reCaptcha.secret_key ) &&
					recaptchaEnabled && (
					<div className="block-editor-contrast-checker">
						<Notice
							status="warning"
							isDismissible={ false }
						>
							<RawHTML>
								{ sprintf(
									/* translators: Number of templates. */
									__(
										'Please be sure to add a ReCaptcha API key on %s',
										'formello'
									),
									`<a href="${ settingsUrl }">settings page</a>`
								) }
							</RawHTML>
						</Notice>
					</div>
				) }
			<ToggleControl
				label={ __( 'Hide form after submission', 'formello' ) }
				checked={ hide }
				onChange={ ( val ) => {
					setAttributes( { hide: val } );
				} }
			/>
			<BaseControl>
				<URLInput
					label={ __( 'Redirect Url', 'formello' ) }
					value={ redirectUrl }
					onChange={ ( newURL ) =>
						setAttributes( { redirectUrl: newURL } )
					}
					className={ 'formello-urlinput' }
				/>
			</BaseControl>
			<TextareaControl
				label={ __( 'Success Message', 'formello' ) }
				placeholder={ formello.settings.messages.form.success }
				value={ successMessage }
				onChange={ ( val ) =>
					setAttributes( { successMessage: val } )
				}
			/>
			<TextareaControl
				label={ __( 'Error Message', 'formello' ) }
				placeholder={ formello.settings.messages.form.error }
				value={ errorMessage }
				onChange={ ( val ) => setAttributes( { errorMessage: val } ) }
			/>
		</PanelBody>
	);
}
