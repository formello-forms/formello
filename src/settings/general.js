import {
	Card,
	CardHeader,
	CardBody,
	ToggleControl,
	Button,
	ExternalLink,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';

import { RawHTML, useState, Fragment } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default function General( props ) {
	const { settings, saveSetting, storeSettings } = props;

	const [ loading, setLoading ] = useState( false );
	const [ licenseStatus, setLicenseStatus ] = useState( settings.license_status );

	const updateLicense = ( endpoint, e ) => {
		const message = e.target.nextElementSibling;
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: settings.license,
			},
		} ).then( ( result ) => {
			setLoading( false );
			if ( result.response.success ) {
				saveSetting( 'license_status', result.response.license );
				setLicenseStatus( result.response.license )
			}
			message.classList.add( 'formello-action-message--show' );
			message.classList.remove( 'formello-action-message--error' );
			message.textContent = 'License ' + result.response.license;

			if ( ! result.success || ! result.response || !result.response.success ) {
				message.textContent = 'License: ' + result.response;
				message.classList.add( 'formello-action-message--error' );
			}
			setTimeout( function() {
				message.classList.remove( 'formello-action-message--show' );
			}, 3000 );
		} );
	};

	return (
		<>
			<Card>
				<CardHeader>
					<h2>{ __( 'License', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<ExternalLink href="https://formello.net">
						{ __( 'Get a FREE API Key' ) }
					</ExternalLink>
					<RawHTML>
						{ sprintf(
							/* translators: Addon license. */
							__(
								'<p>Your %s key provides access to addons. You can still using Formello without a license key.</p>',
								'formello'
							),
							`<strong>free license</strong>`
						) }
					</RawHTML>
					<InputControl
						type="password"
						autoComplete="new-password"
						label={ __( 'License Key', 'formello' ) }
						value={ settings.license }
						onChange={ ( val ) => {
							saveSetting( 'license', val );
						} }
						readOnly={ 'valid' === settings.license_status }
					/>
					<div>
						{ 'valid' === licenseStatus ? (
							<Fragment>
								<RawHTML>
									{ sprintf(
										/* translators: License status. */
										__(
											'<p class="success">License status: %s.</p>',
											'formello'
										),
										`<strong>active</strong>`
									) }
								</RawHTML>
								<Button
									onClick={ ( e ) =>
										updateLicense( 'deactivate', e )
									}
									isSecondary
									aria-disabled={ loading }
									isBusy={ loading }
								>
									Deactivate
								</Button>
							</Fragment>
						) : (
							<Fragment>
								<Button
									onClick={ ( e ) =>
										updateLicense( 'activate', e )
									}
									aria-disabled={ loading }
									isPrimary
									isBusy={ loading }
								>
									Activate
								</Button>
							</Fragment>
						) }
						<span className="formello-action-message"></span>
					</div>
				</CardBody>
			</Card>
		</>
	);
}
