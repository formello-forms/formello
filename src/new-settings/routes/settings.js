/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, TabPanel } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import { useParams, useNavigate } from "react-router-dom";

import Help from '../components/settings/help.js';
import General from '../components/settings/general.js';
import Recaptcha from '../components/settings/recaptcha.js';
import Messages from '../components/settings/messages.js';
import Integrations from '../components/settings/integrations.js';
import Logging from '../components/settings/logging.js';
import Licenses from '../components/settings/licenses.js';
import api from '@wordpress/api';
import UpdateSettings from '../components/settings/update-settings';
import Header from '../components/masthead.js';

export default function Settings( props ) {

	const { savedSettings } = props;
	const [ settings, setSettings ] = useState( null );
	const [ hasUpdates, setHasUpdates ] = useState( false );

	const routeParams = useParams();
	const initialTab = routeParams.tab;
	const navigate = useNavigate();

	const updateUrl = ( tabName ) => {
		navigate( '/' + tabName );
	};

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

	function onSetSettings( newSettings ) {
		setSettings( newSettings );
	}

	return (
		<Fragment>
			<Header title={ __( 'Settings', 'formello' ) } />

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
	)
}