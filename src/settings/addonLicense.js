import {
	BaseControl,
	Button,
	__experimentalInputControl as InputControl,
	CardBody,
	Card,
	CardHeader,
} from '@wordpress/components';

import { useState, useRef } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import api from '@wordpress/api';

export default function AddonLicense( props ) {

	const { title, addonSettings, optionName, name, showMessage, addNotice, icon } = props;
	const [ loading, setLoading ] = useState( false );
	const [ settings, setSettings ] = useState( addonSettings );
	const elementRef = useRef();
	const Icon = icon;

	const validateLicense = () => {
		const endpoint =
			'valid' !== settings.license_status ? 'activate' : 'deactivate';
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: settings.license,
				item_name: title,
			},
		} ).then(
			( result ) => {
				setLoading( false );
				saveSettings( 'license_status', result.response.license );

				if ( result.response.success ) {
					showMessage(
						'License: ' + result.response.license,
						'success',
						elementRef
					);
				}

				if (
					! result.success ||
					! result.response ||
					! result.response.success
				) {
					showMessage(
						'License: ' + result.response,
						'error',
						elementRef
					);
				}
			},
			( result ) => {
				showMessage( 'License: ' + result.message, 'error', elementRef );
			}
		);
	};

	const saveSettings = ( key, value ) => {
		setSettings( {
			...settings,
			[ key ]: value,
		} );
	};

	const storeSettings = () => {
		setLoading( true );
		const update = new api.models.Settings( { [ optionName ]: settings } );
		update
			.save()
			.done( () => {
				addNotice( 'success', __( 'Settings saved', 'formello' ) );
			} )
			.always( () => setLoading( false ) )
			.catch( ( e ) => showMessage( e.message, 'error' ) );
	};

	return (
		<Card>
			<CardHeader size={ 'large' } justify={ 'flex-start' }>
				<Icon />
				<h2>{ title }</h2>
			</CardHeader>

			<CardBody>
				<BaseControl>
					<InputControl
						label={ __( 'License Key', 'formello-mailchimp' ) }
						value={ settings.license }
						onChange={ ( val ) => {
							saveSettings( 'license', val );
						} }
						type={ 'password' }
						readOnly={ 'valid' === settings.license_status }
						suffix={
							<Button
								onClick={ () => validateLicense() }
								isPrimary={ 'valid' !== settings.license_status }
								isSecondary={
									'valid' === settings.license_status
								}
								aria-disabled={ loading }
								isBusy={ loading }
							>
								{ 'valid' !== settings.license_status
									? 'Activate'
									: 'Deactivate' }
							</Button>
						}
					/>
					<span
						ref={ elementRef }
						className="formello-action-message"
					></span>
				</BaseControl>
				<Button
					onClick={ () => storeSettings() }
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
