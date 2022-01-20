/**
 * WordPress dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	BaseControl,
	Button,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	TextControl,
	SelectControl,
	RadioControl,
	TabPanel
} from '@wordpress/components';

import {
	render,
	Component,
	Fragment,
	useState,
	useEffect
} from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

import {
	applyFilters,
} from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import './dashboard.scss';
import getIcon from '../utils/get-icon';

import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { getQueryArg, addQueryArgs } from '@wordpress/url';

import General from './general.js';
import Recaptcha from './recaptcha.js';
import Messages from './messages.js';
import Integrations from './integrations.js';
import Licenses from './licenses.js';
import About from './about.js';
import Notices from '../tools/notices.js';

const components = {
    general: General,
    licenses: Licenses,
    recaptcha: Recaptcha,
    messages: Messages,
    integrations: Integrations,
};


function App() {

	const [ isSaving, setSaving ] = useState(false);
	const [ apiLoaded, setApiLoaded ] = useState(false);
	const [ settings, setSettings ] = useState();
    const { createNotice, removeNotice } = useDispatch( noticesStore );

	useEffect( () => {
		apiFetch( {
			path: '/formello/v1/settings',
			method: 'GET'
		} ).then( ( result ) => {
			
			setSettings(result.response) 
			
			setApiLoaded(true)

		} );
	}, [] );

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
		{
			name: 'licenses',
			title: 'Licenses',
		},
	];

    const addNotice = ( status, content, type='snackbar' ) => {
        removeNotice( 'settings' )
        createNotice( status, content, {type: type, id: 'settings'} );
    }

	const getSetting = ( group, name, defaultVal ) => {
		let result = defaultVal;

		if( 'license' === group || 'license_status' === group ){
			result = settings[ group ];
		}

		if ( 'undefined' !== typeof settings[ group ][ name ] ) {
			result = settings[ group ][ name ];
		}

		return result;
	}

	const updateSettings = ( e ) => {
		setSaving( true )
		const message = e.target.nextElementSibling;

		apiFetch( {
			path: '/formello/v1/settings',
			method: 'POST',
			data: {
				settings: settings,
			},
		} ).then( ( result ) => {
			setSaving( false )
			addNotice( 'info', 'Settings saved' )
		} );
	}

	const showMessage = ( message ) => {
		message.classList.add( 'formello-action-message--show' );
		message.textContent = result.response;

		if ( ! result.success || ! result.response ) {
			message.classList.add( 'formello-action-message--error' );
		} else {
			setTimeout( function() {
				message.classList.remove( 'formello-action-message--show' );
			}, 3000 );
		}
	}

	const changeSettings = ( group, name, value ) => {
		setSettings( {
			...settings,
			[group]: {
				...settings[group],
				[name]: value,
			}
		} );
	};

	const saveLicense = ( value ) => {
		setSettings( {
				...settings,
				license: value
		} );
	};

	const initialTab = getQueryArg( window.location.href, 'tab' );

	const updateUrl = ( tabName ) => {
		let newUrl = addQueryArgs( window.location.href, { tab: tabName } )
		window.history.replaceState( { path: newUrl }, '', newUrl );
	}

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
						<h1>{ getIcon( 'logo' ) }{ __( 'Settings' ) }</h1>
					</div>
				</div>
				<div className="formello-settings-main">

					{ applyFilters( 'formello.dashboard.beforeSettings', '', this ) }

					<TabPanel
						className='formello-tablist'
						tabs={ tabs }
						initialTabName={ initialTab }
						onSelect={ ( tabName ) => updateUrl( tabName ) }
					>
						{ ( tab ) => {
						    const SettingsTab = components[tab.name];
						    return <Fragment>
						    		<SettingsTab 
										saveLicense={ saveLicense.bind(this) }
										changeSettings={ changeSettings.bind(this) }
										getSetting={ getSetting.bind(this) }
						    		/>
						    		{
						    			'general' !== tab.name &&
							    		<Button
										isPrimary
										aria-disabled={ isSaving }
										isBusy={ isSaving }
										disabled={ isSaving }
										onClick={ ( e ) => updateSettings( e ) }
									>
										{ __( 'Save', 'formello' ) }
									</Button>
						    		}			
								</Fragment>;

						}}

					</TabPanel>

					<Notices />

					{ applyFilters( 'formello.dashboard.settings', '', this ) }

					{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }

				</div>

			</Fragment>
		);
}

window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<App />,
		document.getElementById( 'formello-block-default-settings' )
	);
} );