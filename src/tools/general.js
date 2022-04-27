import { Card, CardHeader, CardBody, Button, Placeholder, Spinner, ToggleControl, ExternalLink } from '@wordpress/components';

import { useState, Fragment, useEffect } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import api from '@wordpress/api';
import apiFetch from '@wordpress/api-fetch';

export default function General( { addNotice } ) {
	const [ loading, setLoading ] = useState( false );
	const [ apiLoaded, setApiLoaded ] = useState( false );
	const [ settings, setSettings ] = useState( false );

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

	const onChange = ( key, value ) => {
		let newSettings = {
			...settings,
			[key]: value
		}
		setSettings( newSettings )
	    let update = new api.models.Settings( { formello: newSettings} );
	    update.save();
	};

	useEffect( () => {

	    api.loadPromise.then( () => {
	        let settings = new api.models.Settings();

	        if ( apiLoaded === false ) {
	            settings.fetch().then( ( response ) => {
	            	setSettings( response.formello )
	            	setApiLoaded( true )
	            } );
	        }
	    } );

	}, [] )

	if ( ! apiLoaded ) {
		return (
			<Placeholder className="formello-settings-placeholder">
				<Spinner />
			</Placeholder>
		);
	}

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
			<Card>
				<CardHeader>
					<h2>{ __( 'Logging', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<p>
						{ __(
							'To enable logging, please set this as checked.',
							'formello'
						) }
					</p>

					<ToggleControl
						label={ __( 'Enable log', 'formello' ) }
						checked={ settings.log }
						onChange={ ( val ) => { 
							onChange( 'log', val )
						} }
					/>
					{ settings.log && (
						<ExternalLink href={ settings.log_file }>
							{ __( 'View log', 'formello' ) }
						</ExternalLink>
					) }
				</CardBody>
			</Card>
		</Fragment>
	);
}
