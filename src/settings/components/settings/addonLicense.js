import {
	BaseControl,
	Button,
	__experimentalInputControl as InputControl,
	CardBody,
	Card,
	CardHeader,
	CardFooter,
	Notice
} from '@wordpress/components';
import classnames from 'classnames';

import { useState, useRef, RawHTML } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../update-settings';
import UpdateLicense from '../update-license';

export default function AddonLicense( props ) {

	const { 
		title, 
		settings, 
		addonSettings, 
		optionName, 
		name, 
		saveSettings,
		setSettings, 
		icon, 
	} = props;
	const [ loading, setLoading ] = useState( false );
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const Icon = icon;

	const updateLicense = () => {
		const endpoint =
			'valid' !== addonSettings.license_status ? 'activate' : 'deactivate';

		return apiFetch( {
			path: '/formello/v1/license/' + endpoint,
			method: 'POST',
			data: {
				license: addonSettings.license,
				item_name: title,
			},
		} ).then( (result) => {

			if ( typeof result.response === 'object' ) {
				setLicense( 'license_status', result.response.license )
			} else {
				setLicense( 'license_status', result.response )
			}
			return Promise.resolve(result)
		} )

	};

	function setLicense( key, value ) {
		const newSettings = Object.assign( {}, settings[optionName] );
		newSettings[ key ] = value;
		setSettings( {
			...settings,
			[ optionName ]: newSettings
		} );
		setHasUpdates(true)
		if( 'license_status' === key ){
			saveSettings( optionName )
		}
	}

	return (
		<Card>
			<CardHeader size={ 'large' } justify={ 'flex-start' }>
				<Icon />
				<h2>{ title }</h2>
			</CardHeader>

			<CardBody>
				<UpdateLicense
					req={ updateLicense }
					license={ addonSettings.license }
					license_status={ addonSettings.license_status }
					onChange={ (val) => setLicense( 'license', val ) }
				/>
			</CardBody>
			<CardFooter>
				<UpdateSettings
					req={ () => saveSettings(optionName).finally( () => setHasUpdates(false) ) }
					text={ __( 'Save options', 'formello' ) }
					disabled={ ! hasUpdates }
					variant={ 'primary' }
				/>
			</CardFooter>
		</Card>
	);
}
