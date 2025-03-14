/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalGrid as Grid, TabPanel } from '@wordpress/components';
import { Fragment, useContext } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import Help from '../../components/help.js';
import General from './components/general.js';
import Captcha from './components/captcha.js';
import Messages from './components/messages.js';
import Integrations from './components/integrations.js';
//import Licenses from '../components/settings/licenses.js';
import UpdateSettings from '../../components/update-settings';
import LoadingSpinner from '../../components/loading-spinner';
import Header from '../../components/masthead.js';
import { SettingsContext } from '../../context/settings-context';
import { useHistory, useLocation } from '../../router';

export default function Settings() {
	const { settings, hasUpdates, saveSettings } =
		useContext( SettingsContext );

	const history = useHistory();
	const { params } = useLocation();
	const changeTab = ( tabName ) => {
		history.push( { page: 'formello-settings', tab: tabName } );
	};

	const tabs = [
		{
			name: 'general',
			title: __( 'General', 'formello' ),
			component: General,
		},
		{
			name: 'captcha',
			title: 'Captcha',
			component: Captcha,
		},
		{
			name: 'messages',
			title: __( 'Messages', 'formello' ),
			component: Messages,
		},
		{
			name: 'integrations',
			title: __( 'Integrations', 'formello' ),
			component: Integrations,
		},
	];

	if ( ! settings ) {
		return (
			<LoadingSpinner text={ __( 'Fetching data…', 'search-console' ) } />
		);
	}

	return (
		<Fragment>
			<Header title={ __( 'Settings', 'formello' ) } />

			<div className="setting-tabs">
				{ applyFilters(
					'formello.dashboard.beforeSettings',
					'',
					this
				) }

				<TabPanel
					tabs={ tabs }
					initialTabName={ params.tab }
					onSelect={ ( tabName ) => changeTab( tabName ) }
				>
					{ ( tab ) => {
						const SettingsTab = tab.component;
						return (
							<Grid
								columns={ 4 }
								templateColumns="3fr 1fr"
								gap="4"
							>
								<div>
									<SettingsTab />
									{ ( 'general' === tab.name ||
										'captcha' === tab.name ||
										'messages' === tab.name ||
										'logging' === tab.name ) && (
										<UpdateSettings
											req={ saveSettings }
											text={ __(
												'Save options',
												'formello'
											) }
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
