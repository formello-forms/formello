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
import Licenses from './licenses.js';
import Notices from '../tools/notices.js';
import api from '@wordpress/api';

const components = {
	general: General,
	licenses: Licenses,
	recaptcha: Recaptcha,
	messages: Messages,
	integrations: Integrations,
};

function App() {
	const [ isSaving, setSaving ] = useState( false );
	const [ apiLoaded, setApiLoaded ] = useState( false );
	const [ settings, setSettings ] = useState();
	const { createNotice, removeNotice } = useDispatch( noticesStore );

	/*useEffect( () => {
		apiFetch( {
			path: '/formello/v1/settings',
			method: 'GET',
		} ).then( ( result ) => {
			setSettings( result.response );

			setApiLoaded( true );
		} );
	}, [] );*/

	const onChange = ( key, value ) => {
		setSaving( true );
		let newSettings = {
			...settings,
			[key]: value
		}
		setSettings( newSettings )
	    let update = new api.models.Settings( { formello: newSettings} );
	    update.save()
	    .done( () => {
			addNotice( 'info', 'Settings saved' );
	    } )
	    .always( () => setSaving( false ) )
	}

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

	const tabs = [
		{
			name: 'general',
			title: 'General',
		},
		{
			name: 'recaptcha',
			title: 'ReCaptcha',
		},
		{
			name: 'messages',
			title: 'Messages',
		},
		{
			name: 'integrations',
			title: 'Integrations',
		},
		/*{
			name: 'licenses',
			title: 'Licenses',
		},*/
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

		apiFetch( {
			path: '/formello/v1/settings',
			method: 'POST',
			data: {
				settings,
			},
		} ).then( () => {
			setSaving( false );
			addNotice( 'error', 'Settings saved' );
		} );
	};

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
						const SettingsTab = components[ tab.name ];
						return (
							<div className="formello-tablist">
								<div className="formello-settings-tab">
									<Notices />
									<SettingsTab
										saveSetting={ onChange.bind( this ) }
										saveSettingGroup={ saveSettingGroup.bind(
											this
										) }
										getSetting={ getSetting.bind( this ) }
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
