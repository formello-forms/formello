import {
	Card,
	CardHeader,
	CardBody,
	Button,
	ExternalLink,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';

import { RawHTML, useState, Fragment, useRef } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import MessageBox from './message-box.js';

export default function General( props ) {
	const { settings, setSettings, setHasUpdates } = props;
	const [ loading, setLoading ] = useState( false );
	const [ message, setMessage ] = useState('');
	const [ messageType, setMessageType ] = useState('error');
	const license = settings.formello.license ?? '';
	const license_status = settings.formello.license_status ?? '';

	function setLicense( key, value ) {
		const newSettings = Object.assign( {}, settings.formello );
		newSettings[ key ] = value;
		setSettings( {
			...settings,
			formello: newSettings
		} );
		setHasUpdates(true)
	}

	const elementRef = useRef();

	const updateLicense = () => {
		const endpoint =
			'valid' !== license_status ? 'activate' : 'deactivate';

		setLoading( true );
		apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: license,
			},
		} ).then( ( result ) => {
			setLoading( false );
			setLicense( 'license_status', result.response.license )

			if (
				! result.success ||
				! result.response ||
				! result.response.success
			) {
				setMessage( result.response )
				setMessageType( result.response.success ? 'success' : 'error' )
			}
		}, ( error ) => {
			setLoading( false );
			setLicense( 'license_status', error.response )
			setMessage( error.response )
			setMessageType( 'error' )
		} );
	};

	return (
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
					type="text"
					autoComplete="new-password"
					label={ __( 'License Key', 'formello' ) }
					value={ license }
					onChange={ ( val ) => {
						setLicense( 'license', val )
					} }
					readOnly={ 'valid' === license_status }
					suffix={
						<Button
							onClick={ () => updateLicense() }
							isPrimary={ 'valid' !== license_status }
							isSecondary={
								'valid' === license_status
							}
							aria-disabled={ loading }
							isBusy={ loading }
							disabled={ '' === license }
						>
							{ 'valid' !== license_status
								? 'Activate'
								: 'Deactivate' }
						</Button>
					}
				/>
				<MessageBox message={ message } messageType={ messageType } handleClose={ setMessage } />
				{
					'' !== license && '' !== license_status &&
					<RawHTML>
						{ sprintf(
							/* translators: License status. */
							__(
								'<p>License status: <strong class="license-%s">%s</strong>.</p>',
								'formello'
							),
							`${ license_status || 'invalid' }`,
							`${ license_status || 'invalid' }`,
						) }
					</RawHTML>
				}
			</CardBody>
		</Card>
	);
}
