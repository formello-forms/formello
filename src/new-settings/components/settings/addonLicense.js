import {
	BaseControl,
	Button,
	__experimentalInputControl as InputControl,
	CardBody,
	Card,
	CardHeader,
	CardFooter
} from '@wordpress/components';

import { useState, useRef, RawHTML } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from './update-settings';

export default function AddonLicense( props ) {

	const { 
		title, 
		settings, 
		addonSettings, 
		optionName, 
		name, 
		showMessage, 
		setSettings, 
		icon, 
	} = props;
	const [ loading, setLoading ] = useState( false );
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const { saveEntityRecord } = useDispatch( coreStore );
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
				setLicense( 'license_status', result.response.license );

				if ( result.response.success ) {
					//onSettingsChange()
				}

				if (
					! result.success
				) {
					setLicense( 'license_status', result.response );
					onSettingsChange()
					console.log(settings)
				}
			},
			( result ) => {

			}
		).finally( () => console.log('ok') )
	};

	// Handle all setting changes, and save to the database.
	async function onSettingsChange( type = 'save' ) {
		let record = '';

		record = { [optionName]: settings[optionName] };

		let response = '';
		response = await saveEntityRecord(
			'root',
			'site',
			record
		);

		if ( response ) {
			setSettings( response );
			setHasUpdates( false );
		} else {
		}
	}

	function setLicense( key, value ) {
		const newSettings = Object.assign( {}, settings[optionName] );
		newSettings[ key ] = value;
		setSettings( {
			...settings,
			[ optionName ]: newSettings
		} );
		setHasUpdates(true);
	}

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
						value={ addonSettings.license }
						onChange={ ( val ) => {
							setLicense( 'license', val );
						} }
						type={ 'text' }
						readOnly={ 'valid' === addonSettings.license_status }
						autoComplete={ 'nope' }
						suffix={
							<Button
								onClick={ () => validateLicense() }
								isPrimary={ 'valid' !== addonSettings.license_status }
								isSecondary={
									'valid' === addonSettings.license_status
								}
								disabled={ loading || !addonSettings.license }
								aria-disabled={ loading }
								isBusy={ loading }
							>
								{ 'valid' !== addonSettings.license_status
									? 'Activate'
									: 'Deactivate' }
							</Button>
						}
					/>
				</BaseControl>
				{
					addonSettings.license_status && 
					<RawHTML>
						{ sprintf(
							/* translators: License status. */
							__(
								'License status: <strong class="license-%s">%s</strong>.',
								'formello'
							),
							`${ addonSettings.license_status || 'error' }`,
							`${ addonSettings.license_status }`,
						) }
					</RawHTML>
				}
			</CardBody>
		</Card>
	);
}
