import {
	Card,
	CardHeader,
	CardBody,
	TextControl,
	PanelRow,
	PanelBody,
	Button,
	Icon,
	SelectControl,
	ExternalLink,
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

export default function license( props ) {

	const {
		getSetting,
		saveLicense
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
				setLicenseStatus( result.response.license )
			};
			message.classList.add( 'formello-action-message--show' );
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
		<Fragment>
		<Card>

			<CardHeader>
				<h2>{ __( 'General', 'formello' ) }</h2>
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
					type='text'
					label={ __( 'License Key', 'formello' ) }
					value={ getSetting( 'license' ) }
					onChange={ (val) => {
						saveLicense( val )
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
				<h2>{ __( 'Need help?', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<p>{ __( 'We would love to help you out if you need any help.', 'formello' ) }</p>

				<Button 
					isSecondary 
					target="_blank"
					href="https://docs.formello.net">
						{ __( 'Documentation', 'formello' ) }
				</Button>
				<Button 
					isSecondary 
					target="_blank"
					href="https://wordpress.org/support/plugin/formello/">
						{ __( 'Ask a question', 'formello' ) }
				</Button>

				<h3>{ __( 'Do you like the plugin?', 'formello' ) }</h3>

				<p>{ __( 'If you like the plugin you can share a review to help us and spread some love!', 'formello' ) }</p>

				<Button 
					isPrimary 
					target="_blank"
					className="formello-ratings"
					href="https://wordpress.org/support/plugin/formello/reviews/#new-post">
						{ __( 'Leave a review', 'formello' ) }
						<Icon icon="star-filled" />
						<Icon icon="star-filled" />
						<Icon icon="star-filled" />
						<Icon icon="star-filled" />
						<Icon icon="star-filled" />
				</Button>

			</CardBody>

		</Card>
		</Fragment>
	);

};
