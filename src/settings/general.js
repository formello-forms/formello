import {
	Card,
	CardHeader,
	CardBody,
	ToggleControl,
	PanelRow,
	PanelBody,
	Button,
	Icon,
	SelectControl,
	ExternalLink,
	Flex,
	__experimentalInputControl as InputControl
} from '@wordpress/components';

import {
	RawHTML,
	useState,
	Fragment
} from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';

const {
	apiFetch,
} = wp;

export default function General( props ) {

	const {
		getSetting,
		saveSetting
	} = props;

	const [loading, setLoading] = useState(false);
	const [licenseStatus, setLicenseStatus] = useState( getSetting('license_status') );

	const updateLicense = ( endpoint, e ) => {
		const message = e.target.nextElementSibling;
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: getSetting( 'license' ),
			},
		} ).then( ( result ) => {
			setLoading( false );
			if( result.response.success ){
				saveSetting( 'license_status', result.response.license )
			};
			message.classList.add( 'formello-action-message--show' );
			message.classList.remove( 'formello-action-message--error' );
			message.textContent = 'License ' + result.response.license;

			if ( ! result.success || ! result.response ) {
				message.textContent = 'License: ' + result.response;
				message.classList.add( 'formello-action-message--error' );
			}
			setTimeout( function() {
				message.classList.remove( 'formello-action-message--show' );
			}, 3000 );		} );
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
						__( '<p>Your %s key provides access to addons. You can still using Formello without a license key.</p>', 'formello' ),
						`<strong>free license</strong>` )
					}
				</RawHTML>
				<InputControl
					type='password'
					autoComplete='new-password'
					label={ __( 'License Key', 'formello' ) }
					value={ getSetting( 'license' ) }
					onChange={ (val) => {
						saveSetting( 'license', val )
					} }
				/>
				<p>
				{
					'valid' === licenseStatus ?
						<Fragment>
							<RawHTML>
								{ sprintf(
									__( '<p class="success">License status: %s.</p>', 'formello' ),
									`<strong>active</strong>` )
								}
							</RawHTML>
							<Button 
								onClick={ (e) => updateLicense('deactivate', e) }
								isSecondary
								aria-disabled={ loading }
								isBusy={ loading }
							>Deactivate</Button>
						</Fragment>
					:
						<Fragment>
							<Button 
								onClick={ (e) => updateLicense('activate', e) }
								aria-disabled={ loading }
								isPrimary
								isBusy={ loading }
							>Activate</Button>
						</Fragment>
				}
					<span className="formello-action-message"></span>
				</p>

			</CardBody>

		</Card>

		<Card>

			<CardHeader>
				<h2>{ __( 'Logging', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<p>{ __( 'To enable logging, please set this as checked.', 'formello' ) }</p>

				<ToggleControl
					label={ __( 'Enable log', 'formello' ) }
					checked={ getSetting( 'log', '' ) }
					onChange={ ( val ) =>
						saveSetting( 'log', val )
					}
				/>

			</CardBody>

		</Card>
		</>
	);

};
