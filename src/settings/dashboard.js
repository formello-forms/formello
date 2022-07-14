/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { Button, Placeholder, Spinner, TabPanel } from '@wordpress/components';

import { render, Fragment, useState, useEffect } from '@wordpress/element';

import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import './dashboard.scss';
import getIcon from '../utils/get-icon';

import { useDispatch, useSelect, dispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { getQueryArg, addQueryArgs } from '@wordpress/url';

import Help from './help.js';
import General from './general.js';
import Recaptcha from './recaptcha.js';
import Messages from './messages.js';
import Integrations from './integrations.js';
import Logging from './logging.js';
import Licenses from './licenses.js';
import Notices from '../tools/notices.js';
import api from '@wordpress/api';
import '../store';

function App() {
	const [ isSaving, setSaving ] = useState( false );
	const [ apiLoaded, setApiLoaded ] = useState( false );
	const { createNotice, removeNotice } = useDispatch( noticesStore );

	const { settings } = useSelect( ( select ) => {
		return {
			settings: select( 'formello/data' ).getSettings()
		}
	} );

	useEffect( () => {
		api.loadPromise.then( () => {
			const model = new api.models.Settings();

			if ( apiLoaded === false ) {
				model.fetch().then( ( response ) => {
					dispatch( 'formello/data' ).setSettings( response );
					setApiLoaded( true );
				} );
			}
		} );
	}, [] );

	const tabs = [
		{
			name: 'general',
			title: 'General',
			component: General,
		},
		{
			name: 'recaptcha',
			title: 'reCaptcha',
			component: Recaptcha,
		},
		{
			name: 'messages',
			title: 'Messages',
			component: Messages,
		},
		{
			name: 'integrations',
			title: 'Integrations',
			component: Integrations,
		},
		{
			name: 'licenses',
			title: 'Licenses',
			component: Licenses,
		},
		{
			name: 'logging',
			title: 'Logging',
			component: Logging,
		},
	];

	const addNotice = ( status, content, type = 'snackbar' ) => {
		removeNotice( 'settings' );
		createNotice( status, content, { type, id: 'settings' } );
	};

	const storeSettings = () => {
		setSaving( true );

		const update = new api.models.Settings( { formello: settings } );
		update
			.save()
			.done( () => {
				addNotice( 'info', 'Settings saved' );
			} )
			.always( () => setSaving( false ) )
			.catch( ( e ) => addNotice( 'error', e.message, 'default' ) );
	};

	const initialTab = getQueryArg( window.location.href, 'tab' );

	const updateUrl = ( tabName ) => {
		const newUrl = addQueryArgs( window.location.href, { tab: tabName } );
		window.history.replaceState( { path: newUrl }, '', newUrl );
	};

	const showMessage = ( message, type, elementRef ) => {
		const msg = elementRef.current;

		msg.classList.add( 'formello-action-message--show' );
		msg.classList.remove( 'formello-action-message--error' );

		if ( 'error' === type ) {
			msg.classList.add( 'formello-action-message--error' );
		}
		msg.textContent = message;

		setTimeout( function() {
			msg.classList.remove( 'formello-action-message--show' );
		}, 3000 );
	};

	if ( ! apiLoaded ) {
		return (
			<Placeholder className="formello-settings-placeholder">
				<Spinner />
			</Placeholder>
		);
	}

	return (
		<Fragment>
			<div className="formello-settings-header">
				<div className="formello-container">
					<h1>
						{ getIcon( 'logo' ) }
						{ __( 'Settings' ) }
					</h1>
				</div>
			</div>
			<div className="formello-settings-main">
				{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

				<TabPanel
					tabs={ tabs }
					initialTabName={ initialTab }
					onSelect={ ( tabName ) => updateUrl( tabName ) }
				>
					{ ( tab ) => {
						const SettingsTab = tab.component;
						return (
							<div className="formello-tablist">
								<div className="formello-settings-tab">
									<Notices />
									<SettingsTab
										addNotice={ addNotice }
										showMessage={ showMessage }
									/>
									{ ( 'general' === tab.name ||
										'recaptcha' === tab.name ||
										'messages' === tab.name ||
										'logging' === tab.name ) && (
										<Button
											isPrimary
											aria-disabled={ isSaving }
											isBusy={ isSaving }
											disabled={ isSaving }
											onClick={ () => storeSettings() }
										>
											{ __( 'Save', 'formello' ) }
										</Button>
									) }
								</div>

								<Help />
							</div>
						);
					} }
				</TabPanel>

				{ applyFilters( 'formello.dashboard.settings', '', this ) }

				{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }
			</div>
		</Fragment>
	);
}

window.addEventListener( 'DOMContentLoaded', () => {
	render( <App />, document.getElementById( 'formello-block-default-settings' ) );
} );
