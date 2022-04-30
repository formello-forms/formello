import {
  BaseControl,
  Button,
  __experimentalInputControl as InputControl,
  CardBody,
  Card,
  CardHeader
} from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';

import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import api from '@wordpress/api';

export default function AddonLicense(props) {

	const { title, addonSettings, optionName } = props
	const [ loading, setLoading ] = useState( false );
	const [ settings, setSettings ] = useState( addonSettings );

	const validateLicense = ( endpoint, e ) => {

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
				showMessage( result.response.license, 'success', e )
			}

			if ( ! result.success || ! result.response || !result.response.success ) {
				showMessage( result.response, 'error', e )
			}

		}, (result) => {
        	showMessage( result.message, 'error', e );
		})
	};

	const showMessage = ( message, type, e ) => {
		const msg = e.target.nextElementSibling;
		setLoading( false );

		msg.classList.add( 'formello-action-message--show' );
		msg.classList.remove( 'formello-action-message--error' );
		
		if( 'error' === type ){
			msg.classList.add( 'formello-action-message--error' );
		}
		msg.textContent = 'License status: ' + message;

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

	useEffect( () => {
		if( 'valid' === settings.license_status ){
			storeSettings()
		}
	}, [settings] )

	const storeSettings = () => {

	    let update = new api.models.Settings( { [optionName]: settings } );
	    update.save()
	    .done( () => {

	    } )
	    .always( () => setSaving( false ) )
	    .catch( (e) => console.log( 'error', e.message, 'default' ) )
	}

	return (
		<Card>

			<CardHeader>
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
					/>
				</BaseControl>					
				{ 'valid' === settings.license_status ?
					<Button
						onClick={ ( e ) =>
							validateLicense( 'deactivate', e )
						}
						isSecondary
						aria-disabled={ loading }
						isBusy={ loading }
					>
						Deactivate
					</Button>
					:
					<Button
						onClick={ ( e ) =>
							validateLicense( 'activate', e )
						}
						isPrimary
						aria-disabled={ loading }
						isBusy={ loading }
					>
						Activate
					</Button>
				}
				<span className="formello-action-message"></span>
			</CardBody>
		</Card>
	);
}
