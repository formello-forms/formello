import {
	Card,
	CardHeader,
	CardBody,
	ExternalLink,
	Button,
	__experimentalInputControl as InputControl,
	Notice,
} from '@wordpress/components';

import {
	RawHTML,
	useContext,
	Fragment,
	useRef,
	useState,
} from '@wordpress/element';

import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { dateI18n } from '@wordpress/date';
import UpdateLicense from '../../../components/update-license';
import { SettingsContext } from '../../../context/settings-context';

export default function General() {
	const { settings, updateSetting } = useContext( SettingsContext );

	const { saveEntityRecord } = useDispatch( coreStore );

	const licenseKey = useRef( settings.license?.license_key?.key ?? '' );

	const [ loading, setLoading ] = useState( false );
	const [ message, setMessage ] = useState( false );

	console.log( settings, licenseKey );

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

	const updateLicense = ( endpoint = 'activate' ) => {
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: licenseKey.current,
			},
		} )
			.then( ( result ) => {
				if ( result.response?.success ) {
					updateSetting( 'license', result.response.license );
				}

				if ( ! result.success ) {
					setMessage( result.response );
				}
			} )
			.finally( () => setLoading( false ) );
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
				<InputControl
					type="text"
					autoComplete="new-password"
					label={ __( 'License Key', 'formello' ) }
					value={ licenseKey.current }
					onChange={ ( val ) => ( licenseKey.current = val ) }
					suffix={
						<Fragment>
							<Button
								isBusy={ loading }
								aria-disabled={ loading }
								disabled={ loading }
								text={ __( 'check', 'formello' ) }
								onClick={ () => updateLicense( 'validate' ) }
							/>
							<Button
								variant="primary"
								isBusy={ loading }
								aria-disabled={ loading || '' === licenseKey }
								disabled={ loading || '' === licenseKey }
								text={ __( 'Activate', 'formello' ) }
								onClick={ () => updateLicense() }
							/>
						</Fragment>
					}
				/>
				{ message && (
					<Notice
						isDismissible={ false }
						className={
							'active' === settings.license?.license_key?.status
								? 'success'
								: 'warning'
						}
						status={
							'active' === settings.license?.license_key?.status
								? 'success'
								: 'warning'
						}
					>
						<RawHTML>{ message }</RawHTML>
					</Notice>
				) }
				{ settings?.license?.license_key?.status && (
					<Notice
						isDismissible={ false }
						status={
							'active' === settings.license?.license_key?.status
								? 'success'
								: 'warning'
						}
					>
						<RawHTML>
							{ sprintf(
								/* translators: %s: License status. */
								__(
									'<p>License status: <b>%1$s</b>. Expires: %2$s</p>',
									'formello'
								),
								settings.license.license_key.status,
								__( 'Never', 'tropical-juice' ) !==
									settings.license.license_key.expires_at
									? dateI18n(
											'd M, Y',
											settings.license.license_key
												.expires_at
									  )
									: __( 'Never', 'tropical-juice' )
							) }
						</RawHTML>
					</Notice>
				) }
			</CardBody>
		</Card>
	);
}
