import { Card, CardHeader, CardBody, CardDivider, Button } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from '../../update-settings';

export default function ReSync() {
	const [ loading, setLoading ] = useState( false );
	const [ message, setMessage ] = useState('');
	const [ messageType, setMessageType ] = useState('error');

	const reSync = () => {
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/sync_template_library',
			method: 'POST',
			data: {
				type: 'formello_form',
				categories: 'form'
			}
		} ).then( (result) => {
			setLoading( false );
			setMessage( result.response );
			setMessageType( 'success' )
		} );
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
				onClick={ () => reSync() }
				text={ __( 'Re-Sync template', 'formello' ) }
				loading={ loading }
				message={ message }
				messageType={ messageType }
				setMessage={ setMessage }
			/>
		</Fragment>
	);
}
