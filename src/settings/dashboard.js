/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { Button, Placeholder, Spinner, TabPanel } from '@wordpress/components';

import { render, Fragment, useState, useEffect } from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import './dashboard.scss';
import getIcon from '../utils/get-icon';

import { useDispatch } from '@wordpress/data';
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

function App() {
	const [ isSaving, setSaving ] = useState( false );
	const [ apiLoaded, setApiLoaded ] = useState( false );
	const [ settings, setSettings ] = useState();
	const [ globalSettings, setGlobalSettings ] = useState();
	const { createNotice, removeNotice } = useDispatch( noticesStore );

	useEffect( () => {

	    api.loadPromise.then( () => {
	        let settings = new api.models.Settings();

	        if ( apiLoaded === false ) {
	            settings.fetch().then( ( response ) => {
	            	setSettings( response.formello )
	            	setGlobalSettings( response )
	            	setApiLoaded( true )
	            } );
	        }
	    } );

	}, [] )

	const tabs = [
		{
			name: 'general',
			title: 'General',
			component: General,
		},
		{
			name: 'recaptcha',
			title: 'ReCaptcha',
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

	const getSetting = ( group, name, defaultVal ) => {
		let result = defaultVal;

		if ( ! name ) {
			result = settings[ group ];
		}

		if ( 'undefined' !== typeof settings[ group ][ name ] ) {
			result = settings[ group ][ name ];
		}

		return result;
	};

	const storeSettings = () => {
		setSaving( true );

	    let update = new api.models.Settings( { formello: settings } );
	    update.save()
	    .done( () => {
			addNotice( 'info', 'Settings saved' );
	    } )
	    .always( () => setSaving( false ) )
	    .catch( (e) => addNotice( 'error', e.message, 'default' ) )
	}

	const saveSettingGroup = ( group, name, value ) => {
		setSettings( {
			...settings,
			[ group ]: {
				...settings[ group ],
				[ name ]: value,
			},
		} );
	};

	const saveSetting = ( key, value ) => {
		setSettings( {
			...settings,
			[ key ]: value,
		} );
	};

	const initialTab = getQueryArg( window.location.href, 'tab' );

	const updateUrl = ( tabName ) => {
		const newUrl = addQueryArgs( window.location.href, { tab: tabName } );
		window.history.replaceState( { path: newUrl }, '', newUrl );
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
										saveSetting={ saveSetting.bind( this ) }
										saveSettingGroup={ saveSettingGroup.bind(
											this
										) }
										settings={ settings }
										globalSettings={ globalSettings }
										addNotice={ addNotice }
									/>

									<Button
										isPrimary
										aria-disabled={ isSaving }
										isBusy={ isSaving }
										disabled={ isSaving }
										onClick={ ( e ) => storeSettings( e ) }
									>
										{ __( 'Save', 'formello' ) }
									</Button>
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
