import {
	Card,
	CardHeader,
	CardBody,
	ExternalLink,
} from '@wordpress/components';

import { RawHTML } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateLicense from '../update-license';

export default function General( props ) {
	const { settings, setSettings, saveSettings } = props;

	const license = settings.formello.license;
	const license_status = settings.formello.license_status;

	function setLicense( key, value ) {
		const newSettings = Object.assign( {}, settings.formello );
		newSettings[ key ] = value;
		setSettings( {
			...settings,
			formello: newSettings,
		} );
	}

	const updateLicense = () => {
		const endpoint =
			'valid' !== license_status ? 'activate' : 'deactivate';

		return apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license,
			},
		} ).then( ( result ) => {
			if ( result.response?.success ) {
				setLicense( 'license_status', result.response.license );
			}

			if (
				! result.success
			) {
				setLicense( 'license_status', result.response );
			}
			return Promise.resolve( result );
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
				<UpdateLicense
					req={ updateLicense }
					license={ license }
					license_status={ license_status }
					onChange={ ( val ) => setLicense( 'license', val ) }
					saveSettings={ saveSettings }
				/>
			</CardBody>
		</Card>
	);
}
