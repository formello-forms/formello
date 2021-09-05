import {
  TextControl,
  PanelRow,
  PanelBody,
  Button,
  SelectControl,
  __experimentalInputControl as InputControl
} from '@wordpress/components';

import { __, sprintf } from '@wordpress/i18n';

const {
	apiFetch,
} = wp;

export default function license( props ) {

	const {
		getSetting,
		updateLicense
	} = props;

	const validateLicense = ( val ) => {
		apiFetch( {
			path: '/formello/v1/license',
			method: 'POST',
			data: {
				license: getSetting( 'license' ),
			},
		} ).then( ( result ) => {
			this.setState( { isAPISaving: false } );
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
					<InputControl
						type='text'
						label={ __( 'License Key', 'formello' ) }
						value={ getSetting( 'license' ) }
						onChange={ (val) => {
							updateLicense( val )
						} }
						suffix={
							<Button 
								isPrimary
								onClick={ () => validateLicense() }
							>Validate</Button>
						}
					/>
				</PanelRow>
				<PanelRow>
					<p>{ __( 'Your free license key provides access to addons. You can still using Formello without a license key.', 'formello' ) }</p>
					<hr/>
					<p>{ __( 'Here you can find', 'formello' ) } <a href="https://wordpress.org/support/plugin/formello/">{ __( 'support' ) }</a>.</p>
					<p>{ __( 'If you like the plugin, you can share a review ', 'formello' ) } <a href="https://wordpress.org/support/plugin/formello/reviews/#new-post">{ __( 'here' ) }</a>.</p>
				</PanelRow>

			</div>
		</PanelBody>

    );

};
