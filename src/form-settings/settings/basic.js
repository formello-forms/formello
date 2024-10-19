import { __, sprintf } from '@wordpress/i18n';

import { RawHTML, Fragment } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';

import {
	SelectControl,
	ToggleControl,
	Notice,
	TextareaControl,
	BaseControl,
} from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { useSelect } from '@wordpress/data';
import { URLInput, store as blockEditorStore } from '@wordpress/block-editor';

export function Settings() {
	const { postType, postId } = useSelect( ( select ) => {
		return {
			postType: select( 'core/editor' ).getCurrentPostType(),
			postId: select( 'core/editor' ).getCurrentPostId(),
		};
	}, [] );

	const [ formello ] = useEntityProp( 'root', 'site', 'formello' );
	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	if ( ! meta._formello_settings ) {
		return <></>;
	}

	const {
		storeSubmissions,
		captchaEnabled,
		captchaType,
		hide,
		redirectUrl,
		successMessage,
	} = meta._formello_settings;

	const settingsUrl = addQueryArgs( 'admin.php', {
		tab: 'captcha',
		page: 'formello-settings',
	} );

	const setOptions = ( key, val ) => {
		setMeta( {
			...meta,
			_formello_settings: {
				...meta._formello_settings,
				[ key ]: val,
			},
		} );
	};

	return (
		<Fragment>
			<ToggleControl
				label={ __( 'Store submissions', 'formello' ) }
				checked={ storeSubmissions }
				onChange={ ( val ) => {
					setOptions( 'storeSubmissions', val );
				} }
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={ __( 'Enable Captcha', 'formello' ) }
				checked={ captchaEnabled }
				onChange={ ( val ) => {
					setOptions( 'captchaEnabled', val );
				} }
				__nextHasNoMarginBottom
			/>
			{ captchaEnabled && (
				<SelectControl
					label={ __( 'Captcha service', 'formello' ) }
					value={ captchaType }
					options={ [
						{ label: 'reCaptcha', value: 'reCaptcha' },
						{ label: 'hCaptcha', value: 'hCaptcha' },
					] }
					onChange={ ( val ) => setOptions( 'captchaType', val ) }
					__nextHasNoMarginBottom
				/>
			) }

			{ ( '' === formello?.[ captchaType ]?.site_key ||
				'' === formello?.[ captchaType ]?.secret_key ) &&
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
					setOptions( 'hide', val );
				} }
				__nextHasNoMarginBottom
			/>
			<BaseControl
				help={ __(
					'Enter a URL you want to redirect your page to after form Submission',
					'formello'
				) }
				__nextHasNoMarginBottom
			>
				<URLInput
					label={ __( 'Redirect Url', 'formello' ) }
					value={ redirectUrl }
					onChange={ ( newURL ) =>
						setOptions( 'redirectUrl', newURL )
					}
					className={ 'formello-urlinput' }
					__nextHasNoMarginBottom
				/>
			</BaseControl>
			<TextareaControl
				label={ __( 'Success Message', 'formello' ) }
				placeholder={ formello?.messages.form.success }
				value={ successMessage }
				onChange={ ( val ) => setOptions( 'successMessage', val ) }
				__nextHasNoMarginBottom
			/>
		</Fragment>
	);
}
