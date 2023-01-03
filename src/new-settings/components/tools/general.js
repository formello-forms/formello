import { Card, CardHeader, CardBody, CardDivider, Button } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import UpdateSettings from './update-settings';

export default function General() {
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
		} ).then( () => {
			setLoading( false );
			setMessage( __( 'Template synced!', 'formello' ) );
			setMessageType( 'success' )
		} );
	};

	return (
		<div className="setting-tabs__block-manager inner-container">
			<Card>
				<CardHeader>
					<h2>{ __( 'General', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<p>
						{ __(
							'If you need to reset template library.',
							'formello'
						) }
					</p>

					<div className="setting-controls__save-settings">
						<UpdateSettings
							onClick={ () => reSync() }
							text={ __( 'Re-Sync template', 'formello' ) }
						/>
					</div>

					<CardDivider />

					<p>
						{ __(
							'If you need to reset settings.',
							'formello'
						) }
					</p>

					<Button
						isPrimary
						aria-disabled={ loading }
						isBusy={ 'reset' === loading }
						target="_blank"
						onClick={ () => reSync() }
					>
						{ __( 'Reset Settings', 'formello' ) }
					</Button>

				</CardBody>
			</Card>
		</div>
	);
}
