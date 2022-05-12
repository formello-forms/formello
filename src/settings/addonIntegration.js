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
	const { showMessage, addNotice } = props;

	const { title, addonSettings, optionName, name } = props;
	const [ loading, setLoading ] = useState( false );
	const [ settings, setSettings ] = useState( addonSettings );
	const elementRef = useRef();

	const validateKey = () => {
		setLoading( true );

		apiFetch( {
			path: '/formello/v1/' + name + '/list',
			method: 'POST',
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
			() => {
				setLoading( false );
				showMessage(
					'Please insert a valid api key.',
					'error',
					elementRef
				);
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
				<i className={ name }></i>
				<h2>{ title }</h2>
			</CardHeader>

			<CardBody>
				<BaseControl>
					<InputControl
						label={ __( 'Api Key', 'formello-mailchimp' ) }
						value={ settings.api_key }
						onChange={ ( val ) => {
							saveSettings( 'api_key', val );
						} }
						type={ 'password' }
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
