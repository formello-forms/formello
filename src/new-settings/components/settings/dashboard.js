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
	const [ settings, setSettings ] = useState( null );
	const [ hasUpdates, setHasUpdates ] = useState( false );

	const { savedSettings } = useSelect( ( select ) => {
		const { getEntityRecord } = select( 'core' );
		const fetchedSettings =
			getEntityRecord( 'root', 'site' ) ?? null;
		return { savedSettings: fetchedSettings };
	} );

	function onSetSettings( newSettings ) {
		setSettings( newSettings );
	}

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

	const initialTab = getQueryArg( window.location.href, 'tab' );

	const updateUrl = ( tabName ) => {
		const newUrl = addQueryArgs( window.location.href, { tab: tabName } );
		window.history.replaceState( { path: newUrl }, '', newUrl );
	};

	// Display loading/error message while settings are being fetched.
	if ( ! savedSettings ) {
		return (
			<div className="loading-settings">
				<Spinner />
				<span className="description">
					{ __( 'Loading settings…', 'block-visibility' ) }
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
										settings={ settings ?? savedSettings }
										setSettings={ onSetSettings }
										hasUpdates={ hasUpdates }
										setHasUpdates={ setHasUpdates }
									/>
									{ ( 'general' === tab.name ||
										'recaptcha' === tab.name ||
										'messages' === tab.name ||
										'logging' === tab.name ) && (
										<Fragment>
											<UpdateSettings
												hasUpdates={ hasUpdates }
												settings={ settings }
												setSettings={ onSetSettings }
												setHasUpdates={ setHasUpdates }
												tabSettings={ 'formello' }
											/>
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
