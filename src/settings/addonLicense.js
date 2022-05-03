import {
  BaseControl,
  Button,
  __experimentalInputControl as InputControl,
  CardBody,
  Card,
  CardHeader
} from '@wordpress/components';

import { useState, useEffect, useRef } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import api from '@wordpress/api';

export default function AddonLicense(props) {

	const { title, addonSettings, optionName, name } = props
	const [ loading, setLoading ] = useState( false );
	const [ settings, setSettings ] = useState( addonSettings );
	const elementRef = useRef();

	const validateLicense = () => {
		const endpoint = 'valid' !== settings.license_status ? 'activate' : 'deactivate'
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: settings.license,
				item_name: title,
			},
		} ).then( ( result ) => {

			setLoading( false );
			saveSettings( 'license_status', result.response.license )

			if ( result.response.success ) {
				showMessage( 'License: ' + result.response.license, 'success' )
			}

			if ( ! result.success || ! result.response || !result.response.success ) {
				showMessage( 'License: ' + result.response, 'error' )
			}

		}, (result) => {
			showMessage( 'License: ' + result.message, 'error' );
		})
	};

	const showMessage = ( message, type ) => {
		const msg = elementRef.current;
		setLoading( false );

		msg.classList.add( 'formello-action-message--show' );
		msg.classList.remove( 'formello-action-message--error' );
		
		if( 'error' === type ){
			msg.classList.add( 'formello-action-message--error' );
		}
		msg.textContent = message;

		setTimeout( function() {
			msg.classList.remove( 'formello-action-message--show' );
		}, 3000 )
	};

	const saveSettings = ( key, value ) => {
		setSettings( {
			...settings,
			[ key ]: value,
		} );
	};

	const storeSettings = () => {
		setLoading(true)
		let update = new api.models.Settings( { [optionName]: settings } );
		update.save()
		.done( () => {
			showMessage( __( 'Settings saved', 'formello' ), 'success' )
		} )
		.always( () => setLoading( false ) )
		.catch( (e) => showMessage( e.message, 'error' ) )
	}

	return (
		<Card>

			<CardHeader size={ 'large' } justify={ 'flex-start' }>
				<i className={ name }></i>
				<h2>{ title }</h2>
			</CardHeader>

			<CardBody>
				<BaseControl>
					<InputControl
						label={ __( 'License Key', 'formello-mailchimp' ) }
						value={ settings.license }
						onChange={ ( val ) => {
							saveSettings( 'license', val )
						} }
						readOnly={ 'valid' === settings.license_status }
						suffix={
							<Button
								onClick={ () =>
									validateLicense()
								}
								isPrimary={ 'valid' !== settings.license_status }
								isSecondary={ 'valid' === settings.license_status }
								aria-disabled={ loading }
								isBusy={ loading }
							>
								{'valid' !== settings.license_status ? 'Activate' : 'Deactivate'}
							</Button>
						}
					/>
				<span ref={ elementRef } className="formello-action-message"></span>
				</BaseControl>					
					<Button
						onClick={ ( e ) =>
							storeSettings()
						}
						isPrimary
						aria-disabled={ loading }
						isBusy={ loading }
					>
						Save
					</Button>
			</CardBody>
		</Card>
	);
}
