import {
	Card,
	CardHeader,
	CardBody,
	Button,
	ExternalLink,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';

import { RawHTML, useState, Fragment, useRef } from '@wordpress/element';
import { useSelect, dispatch } from '@wordpress/data';

import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default function General( props ) {
	const { showMessage } = props;

	const settings = useSelect(
		( select ) => select( 'formello/data' ).getSettings(),
		[]
	);

	const [ loading, setLoading ] = useState( false );
	const elementRef = useRef();

	const updateLicense = () => {
		const endpoint =
			'valid' !== settings.license_status ? 'activate' : 'deactivate';

		setLoading( true );
		apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: settings.license,
			},
		} ).then( ( result ) => {
			setLoading( false );
			dispatch( 'formello/data' ).setSetting(
				'license_status',
				result.response.license
			);
			showMessage(
				'License ' + result.response.license,
				'success',
				elementRef
			);

			if (
				! result.success ||
				! result.response ||
				! result.response.success
			) {
				showMessage(
					'License ' + result.response,
					'error',
					elementRef
				);
			}
		}, ( error ) => {
			setLoading( false );
			showMessage(
				'License ' + error.response,
				'error',
				elementRef
			);
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
							dispatch( 'formello/data' ).setSetting(
								'license',
								val
							);
						} }
						readOnly={ 'valid' === settings.license_status }
						suffix={
							<Button
								onClick={ () => updateLicense() }
								isPrimary={ 'valid' !== settings.license_status }
								isSecondary={
									'valid' === settings.license_status
								}
								aria-disabled={ loading }
								isBusy={ loading }
							>
								{ 'valid' !== settings.license_status
									? 'Activate'
									: 'Deactivate' }
							</Button>
						}
					/>
					<div>
						<RawHTML>
							{ sprintf(
								/* translators: License status. */
								__(
									'<p class="success">License status: %s.</p>',
									'formello'
								),
								`<strong>${ settings.license_status }</strong>`
							) }
						</RawHTML>
						<span
							ref={ elementRef }
							className="formello-action-message"
						></span>
					</div>
				</CardBody>
			</Card>
		</>
	);
}
