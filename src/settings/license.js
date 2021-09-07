import {
  TextControl,
  PanelRow,
  PanelBody,
  Button,
  SelectControl,
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

	const updateLicense = ( endpoint ) => {
		console.log(getSetting('license_status'))
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: getSetting( 'license' ),
			},
		} ).then( ( result ) => {
			setLoading( false );
			setLicenseStatus( !licenseStatus );
			message.classList.add( 'formello-action-message--show' );
			message.textContent = result.response;

			if ( ! result.success || ! result.response ) {
				message.classList.add( 'formello-action-message--error' );
			} else {
				setTimeout( function() {
					message.classList.remove( 'formello-action-message--show' );
				}, 3000 );
			}
		} );
	};

	return (

		<PanelBody
			initialOpen={ true }
			title={ __( 'General', 'formello' ) }
		>
			<div className="formello-dashboard-panel-row-wrapper">
				<PanelRow>
					<RawHTML>
						{ sprintf(
							__( '<p>Your %s key provides access to addons. You can still using Formello without a license key.</p>', 'formello' ),
							`<strong>free license</strong>` )
						}
					</RawHTML>
					<InputControl
						type='password'
						label={ __( 'License Key', 'formello' ) }
						value={ getSetting( 'license' ) }
						onChange={ (val) => {
							saveLicense( val )
						} }
					/>
					{
						licenseStatus ?
							<Fragment>
								<RawHTML>
									{ sprintf(
										__( '<p>License status: %s.</p>', 'formello' ),
										`<strong>active</strong>` )
									}
								</RawHTML>
								<Button 
									onClick={ () => updateLicense('deactivate') }
									variant={ 'secondary' }
									isBusy={ loading }
								>Deactivate</Button>
							</Fragment>
						:
						<p>
							<Button 
								onClick={ () => updateLicense('activate') }
								variant={ 'primary' }
								isBusy={ loading }
							>Activate</Button>
						</p>
					}
				</PanelRow>
				<PanelRow>
					<hr/>
					<RawHTML>
						{ sprintf(
							__( '<p>Here you can find %s.</p>', 'formello' ),
							`<a href="https://wordpress.org/support/plugin/formello/">support</a>` )
						}
					</RawHTML>
					<RawHTML>
						{ sprintf(
							__( '<p>If you like the plugin, you can share a review %s.</p>', 'formello' ),
							`<a href="https://wordpress.org/support/plugin/formello/reviews/#new-post">here</a>` )
						}
					</RawHTML>
				</PanelRow>

			</div>
		</PanelBody>

	);

};
