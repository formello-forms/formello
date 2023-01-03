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
		apiurl
	} = props;
	const [ loading, setLoading ] = useState( false );
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const elementRef = useRef();
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
				setLoading( false );
				if ( ! result.length ) {
					showMessage(
						"Are you sure it's correct?",
						'error',
						elementRef
					);
				}
				showMessage( 'Good!', 'success', elementRef );
			},
			( result ) => {
				setLoading( false );
				showMessage(
					'Please insert a valid api key.',
					'error',
					elementRef
				);
			}
		);
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
						label={ __( 'Api Key', 'formello-mailchimp' ) }
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
			</CardBody>
			<CardFooter>
				<UpdateSettings
					hasUpdates={ hasUpdates }
					settings={ settings }
					setSettings={ setSettings }
					setHasUpdates={ setHasUpdates }
					hasUpdates={ hasUpdates }
					tabSettings={ optionName }
				/>
				<span
					ref={ elementRef }
					className="formello-action-message"
				></span>
			</CardFooter>
		</Card>
	);
}
