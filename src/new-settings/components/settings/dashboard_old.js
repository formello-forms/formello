/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { Button, Placeholder, Spinner, TabPanel } from '@wordpress/components';

import { render, Fragment, useState, useEffect, useRef } from '@wordpress/element';

import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import './dashboard.scss';
import getIcon from '../utils/get-icon';

import { useDispatch, useSelect, dispatch } from '@wordpress/data';
import { getQueryArg, addQueryArgs } from '@wordpress/url';

import Help from './help.js';
import General from './general.js';
import Recaptcha from './recaptcha.js';
import Messages from './messages.js';
import Integrations from './integrations.js';
import Logging from './logging.js';
import Licenses from './licenses.js';
import api from '@wordpress/api';
import '../store';
import UpdateSettings from './update-settings';

function App() {
	const [ isSaving, setSaving ] = useState( false );
	const [ apiLoaded, setApiLoaded ] = useState( false );
	const elementRef = useRef();

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

	const storeSettings = () => {
		setSaving( true );

		const update = new api.models.Settings( { formello: settings } );
		update
			.save()
			.done( () => {
				showMessage( __( 'Settings saved', 'formello' ), 'info', elementRef );
			} )
			.always( () => setSaving( false ) )
			.catch( ( e ) => showMessage( e.message, 'error', elementRef ) );
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
			<div className="loading-settings">
				<Spinner />
				<span className="description">
					{ __( 'Loading settings…', 'formello' ) }
				</span>
			</div>
		);
	}

	return (
		<Fragment>
			<div className="masthead">
				<div className="inner-container">
					<div className="masthead__branding">
						<h1>
							{ getIcon( 'logo' ) }
							{ __( 'Settings', 'formello' ) }
						</h1>
					</div>
				</div>
			</div>
			<div className="setting-tabs">
				{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

				<TabPanel
					tabs={ tabs }
					initialTabName={ initialTab }
					onSelect={ ( tabName ) => updateUrl( tabName ) }
				>
					{ ( tab ) => {
						const SettingsTab = tab.component;
						return (
							<Fragment>
								<Help />
								<div className="setting-tabs__block-manager inner-container">
									<SettingsTab
										showMessage={ showMessage }
										settings={ settings }
									/>
									{ ( 'general' === tab.name ||
										'recaptcha' === tab.name ||
										'messages' === tab.name ||
										'logging' === tab.name ) && (
										<Fragment>
											<Button
												isPrimary
												aria-disabled={ isSaving }
												isBusy={ isSaving }
												disabled={ isSaving }
												onClick={ () => storeSettings() }
											>
												{ __( 'Save', 'formello' ) }
											</Button>
											<span
												ref={ elementRef }
												className="formello-action-message"
											></span>
											<UpdateSettings />
										</Fragment>
									) }
								</div>								
							</Fragment>

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
	render( <App />, document.getElementById( 'formello__plugin-settings' ) );
} );
