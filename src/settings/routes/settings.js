/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalGrid as Grid,
	TabPanel,
} from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import { useParams, useNavigate } from 'react-router-dom';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';

import Help from '../components/settings/help.js';
import General from '../components/settings/general.js';
import Recaptcha from '../components/settings/recaptcha.js';
import Messages from '../components/settings/messages.js';
import Integrations from '../components/settings/integrations.js';
import Logging from '../components/settings/logging.js';
import Licenses from '../components/settings/licenses.js';
import UpdateSettings from '../components/update-settings';
import Header from '../components/masthead.js';

export default function Settings( props ) {
	const { savedSettings } = props;
	const [ settings, setSettings ] = useState( savedSettings );
	const [ hasUpdates, setHasUpdates ] = useState( false );

	const { saveEntityRecord } = useDispatch( coreStore );

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

	// Handle button update status
	function onSetSettings( newSettings ) {
		setHasUpdates( true );
		setSettings( newSettings );
	}

	// Handle all setting changes, and save to the database.
	async function saveSettings( optionName = 'formello' ) {
		let record = '';
		record = { [ optionName ]: settings[ optionName ] };

		let response = '';
		response = await saveEntityRecord(
			'root',
			'site',
			record
		);
		if ( response ) {
			setHasUpdates( false );
		}
		return response;
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
							<Grid columns={ 4 } templateColumns="3fr 1fr" gap="4">
								<div>
									<SettingsTab
										settings={ settings ?? savedSettings }
										setSettings={ onSetSettings }
										saveSettings={ saveSettings }
									/>
									{ ( 'general' === tab.name ||
										'recaptcha' === tab.name ||
										'messages' === tab.name ||
										'logging' === tab.name ) && (

										<UpdateSettings
											req={ saveSettings }
											text={ __( 'Save options', 'formello' ) }
											disabled={ ! hasUpdates }
											variant={ 'primary' }
										/>

									) }
								</div>
								<Help />
							</Grid>

						);
					} }
				</TabPanel>

				{ applyFilters( 'formello.dashboard.settings', '', this ) }

				{ applyFilters( 'formello.dashboard.afterSettings', '', this ) }
			</div>
		</Fragment>
	);
}
