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

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../update-settings';
import MessageBox from '../message-box.js';

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
		apiurl,
		saveSettings
	} = props;
	const [ loading, setLoading ] = useState( false );
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const [ message, setMessage ] = useState(false)
	const Icon = icon;

	const validateKey = () => {
		setLoading( true );

		apiFetch( {
			path: '/formello/v1/' + name + '/validate',
			method: 'POST',
			data: {
				key: addonSettings.api_key
			}
		} ).then(
			( result ) => {
				setMessage({
					type: 'error',
					message: __( 'Api key is valid', 'formello' )
				})
			},
			( error ) => {
				setMessage({
					type: 'error',
					message: error.message
				})	
			}
		).catch( (error) => {
			setMessage({
				type: 'error',
				message: error.message
			})			
		} ).finally( () => setLoading(false) )
	};

	function setIntegration( key, value ) {
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
						label={ __( 'Api Key', 'formello' ) }
						value={ addonSettings.api_key }
						onChange={ ( val ) => {
							setIntegration( 'api_key', val );
						} }
						type={ 'text' }
						suffix={
							<Button
								onClick={ () => validateKey() }
								isSecondary
								aria-disabled={ loading }
								isBusy={ loading }
							>
								{ __( 'Check', 'formello' ) }
							</Button>
						}
					/>
					<RawHTML>
						{ sprintf(
							/* translators: Number of templates. */
							__(
								'<small>Get your %s API key by clicking %s.</small>',
								'formello'
							),
							title,
							`<a href="${ apiurl }">here</a>`
						) }
					</RawHTML>	
				</BaseControl>
				{ 
					message && (
						<MessageBox message={ message.message } messageType={ message.type } handleClose={ setMessage } key="message" />
					)
				}
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
