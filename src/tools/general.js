import { Card, CardHeader, CardBody, Button } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default function General( { addNotice } ) {
	const [ loading, setLoading ] = useState( false );

	const reSync = () => {
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/sync_template_library',
			method: 'POST',
		} ).then( () => {
			setLoading( false );
			addNotice( 'info', 'Template synced' );
		} );
	};

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h2>{ __( 'Template library', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<p>
						{ __(
							'If you need to reset template library.',
							'formello'
						) }
					</p>

					<Button
						isPrimary
						aria-disabled={ loading }
						isBusy={ loading }
						target="_blank"
						onClick={ () => reSync() }
					>
						{ __( 'Re-Sync template', 'formello' ) }
					</Button>
				</CardBody>
			</Card>
		</Fragment>
	);
}
