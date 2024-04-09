import { __, sprintf } from '@wordpress/i18n';

import { RawHTML } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';

import {
	SelectControl,
	ToggleControl,
	Notice,
	PanelBody,
	TextareaControl,
	BaseControl,
} from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { URLInput } from '@wordpress/block-editor';

export function Settings( props ) {
	const { attributes, setAttributes } = props;

	const {
		storeSubmissions,
		captchaEnabled,
		captchaType,
		hide,
		redirectUrl,
		successMessage,
		errorMessage,
	} = attributes;

	const settingsUrl = addQueryArgs( 'admin.php', {
		tab: 'captcha',
		page: 'formello-settings',
	} );

	const [ formello ] = useEntityProp( 'root', 'site', 'formello' );

	return (
		<PanelBody title={ __( 'Settings', 'formello' ) } initialOpen={ true }>
			<ToggleControl
				label={ __( 'Store submissions', 'formello' ) }
				checked={ storeSubmissions }
				onChange={ ( val ) => {
					setAttributes( { storeSubmissions: val } );
				} }
			/>
			<ToggleControl
				label={ __( 'Enable Captcha', 'formello' ) }
				checked={ captchaEnabled }
				onChange={ ( val ) => {
					setAttributes( { captchaEnabled: val } );
				} }
			/>
			{ captchaEnabled && (
				<SelectControl
					label={ __( 'Captcha service', 'formello' ) }
					value={ captchaType }
					options={ [
						{ label: 'reCaptcha', value: 'reCaptcha' },
						{ label: 'hCaptcha', value: 'hCaptcha' },
					] }
					onChange={ ( val ) =>
						setAttributes( { captchaType: val } )
					}
					__nextHasNoMarginBottom
				/>
			) }

			{ ( '' === formello[ captchaType ].site_key ||
				'' === formello[ captchaType ].secret_key ) &&
				captchaEnabled && (
					<Notice
						status="warning"
						isDismissible={ false }
						className={ 'formello-notice' }
					>
						<RawHTML>
							{ sprintf(
								/* translators: Url of settings page. */
								__(
									'Please be sure to add a %1$s API key on %2$s',
									'formello'
								),
								captchaType,
								`<a href="${ settingsUrl }">settings page</a>`
							) }
						</RawHTML>
					</Notice>
				) }
			<ToggleControl
				label={ __( 'Hide form after submission', 'formello' ) }
				checked={ hide }
				onChange={ ( val ) => {
					setAttributes( { hide: val } );
				} }
			/>
			<BaseControl
				help={ __(
					'Enter a URL you want to redirect your page to after form Submission',
					'formello'
				) }
			>
				<URLInput
					label={ __( 'Redirect Url', 'formello' ) }
					value={ redirectUrl }
					onChange={ ( newURL ) =>
						setAttributes( { redirectUrl: newURL } )
					}
					className={ 'formello-urlinput' }
					__nextHasNoMarginBottom
				/>
			</BaseControl>
			<TextareaControl
				label={ __( 'Success Message', 'formello' ) }
				placeholder={ formello.messages.form.success }
				value={ successMessage }
				onChange={ ( val ) => setAttributes( { successMessage: val } ) }
			/>
			<TextareaControl
				label={ __( 'Error Message', 'formello' ) }
				placeholder={ formello.messages.form.error }
				value={ errorMessage }
				onChange={ ( val ) => setAttributes( { errorMessage: val } ) }
			/>
		</PanelBody>
	);
}
