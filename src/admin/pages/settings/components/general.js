import {
	Card,
	CardHeader,
	CardBody,
	ExternalLink,
} from '@wordpress/components';

import { RawHTML, useContext } from '@wordpress/element';

import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateLicense from '../../../components/update-license';
import { SettingsContext } from '../../../context/settings-context';

export default function General() {
	const { settings } = useContext( SettingsContext );

	const { saveEntityRecord } = useDispatch( coreStore );

	const license = settings.license;
	const license_status = settings.license_status;

	function setLicense( key, value ) {
		const newSettings = Object.assign( {}, settings );
		newSettings[ key ] = value;

		const record = { formello: newSettings };
		// store the license response immediately
		saveEntityRecord( 'root', 'site', record );

		setSettings( {
			...settings,
			formello: newSettings,
		} );
	}

	const updateLicense = () => {
		const endpoint = 'activate';

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

			if ( ! result.success ) {
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
					{ __( 'Get a FREE License' ) }
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
					//saveSettings={ saveSettings }
				/>
			</CardBody>
		</Card>
	);
}
