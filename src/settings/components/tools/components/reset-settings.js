import { Card, CardHeader, CardBody, CardDivider, Button } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../../update-settings';

export default function ResetSettings() {
	const [ loading, setLoading ] = useState( false );
	const [ message, setMessage ] = useState('');
	const [ messageType, setMessageType ] = useState('error');

	const resetSettings = () => {
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/settings/reset',
			method: 'POST',
		} ).then( (result) => {
			setLoading( false );
			setMessage( result.response );
			setMessageType( 'success' )
		} );
	};

	const confirmMessage = () => {

		if( confirm( __( 'This will reset all your settings. Are you sure?', 'formello' ) ) ){
			resetSettings()
		}

	};

	return (
		<Fragment>
			<p>
				{ __(
					'If you need to reset template library.',
					'formello'
				) }
			</p>
			<UpdateSettings
				onClick={ () => confirmMessage() }
				text={ __( 'Reset settings', 'formello' ) }
				loading={ loading }
				message={ message }
				messageType={ messageType }
				setMessage={ setMessage }
			/>
		</Fragment>
	);
}
